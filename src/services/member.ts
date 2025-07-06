import type { ServiceContext } from '.';
import { MemberRecord, type Member } from '../records/member';
import { createRecordSchema } from '../records/utils';

export type MemberService = {
  getMembers: () => Member[];
  addMember: (member: Member) => Member;
  updateMember: (index: number, member: Member) => Member;
  deleteMember: (index: number) => void;
};

export function createMemberService(context: ServiceContext): MemberService {
  switch (context.storage) {
    case 'in-memory':
      return createInMemoryMemberService();
    case 'local-storage':
      return createLocalStorageMemberService();
    default:
      throw context.storage satisfies never;
  }
}

export function createInMemoryMemberService(): MemberService {
  let members: Member[] = [
    {
      name: 'John Doe',
      address: '서울 강남구',
      memo: '외국인',
      joinDate: '2024-10-02',
      job: 'developer',
      isEmailAgreed: true,
    },
    {
      name: 'Foo Bar',
      address: '서울 서초구',
      memo: '한국인',
      joinDate: '2024-10-01',
      job: 'po',
      isEmailAgreed: false,
    },
  ];

  return {
    getMembers: (): Member[] => {
      return members;
    },
    addMember: (member: Member): Member => {
      members = [...members, member];
      return member;
    },
    updateMember: (index: number, member: Member): Member => {
      members = members.map((m, i) => i === index ? member : m);
      return member;
    },
    deleteMember: (index: number): void => {
      members = members.filter((_, i) => i !== index);
      return;
    },
  };
}

export function createLocalStorageMemberService(): MemberService {
  const MEMBERS_STORAGE_KEY = 'members';
  const membersSchema = createRecordSchema(MemberRecord);
  const getLocalStorageMembers = (): Member[] => {
    const jsonMembers = window.localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (jsonMembers == null) {
      return [];
    }
    const members = JSON.parse(jsonMembers);
    if (!Array.isArray(members)) {
      return [];
    }
    return members.flatMap((member) => {
      const result = membersSchema.safeParse(member);
      return result.success ? result.data : [];
    });
  };

  return {
    getMembers: (): Member[] => {
      return getLocalStorageMembers();
    },
    addMember: (member: Member): Member => {
      const newMembers = [...getLocalStorageMembers(), member];
      window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
      return member;
    },
    updateMember: (index: number, member: Member): Member => {
      const newMembers = getLocalStorageMembers().map((m, i) => i === index ? member : m);
      window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
      return member;
    },
    deleteMember: (index: number): void => {
      const newMembers = getLocalStorageMembers().filter((_, i) => i !== index);
      window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(newMembers));
      return;
    },
  };
}
