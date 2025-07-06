import { createMemberService, type MemberService } from './member';

export type ServiceContext = {
  storage: 'in-memory' | 'local-storage';
};

export type Services = {
  MemberService: MemberService;
};

export function createServices(context: ServiceContext): Services {
  const storage = context.storage;
  const serviceContext: ServiceContext = { storage };

  return {
    MemberService: createMemberService(serviceContext),
  };
}
