import { useSyncExternalStore, useMemo } from 'react';
import { type Member } from '../records/member';
import { useServices } from './useServices';

export function useMembers(): [Member[], {
  addMember: (member: Member) => Member;
  updateMember: (index: number, member: Member) => Member;
  deleteMember: (index: number) => void;
}] {
  const { MemberService } = useServices();
  const [store, actions] = useMemo(() => {
    let listeners: (() => void)[] = [];
    let cache: Member[] | null = null;

    const notify = () => {
      cache = null;
      listeners.forEach(callback => callback());
    };

    const store = {
      subscribe: (callback: () => void) => {
        listeners.push(callback);
        return () => listeners = listeners.filter(l => l !== callback);
      },
      getSnapshot: () => cache ?? (cache = MemberService.getMembers()),
    };

    const actions = {
      addMember: (member: Member) => {
        const result = MemberService.addMember(member);
        notify();
        return result;
      },
      updateMember: (index: number, member: Member) => {
        const result = MemberService.updateMember(index, member);
        notify();
        return result;
      },
      deleteMember: (index: number) => {
        MemberService.deleteMember(index);
        notify();
      },
    };

    return [store, actions];
  }, [MemberService]);
  const members = useSyncExternalStore(store.subscribe, store.getSnapshot);

  return [members, actions];
}
