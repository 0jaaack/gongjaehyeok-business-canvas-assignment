import { type ReactNode } from 'react';
import { ModalProvider } from '../components/ModalProvider';

export const createModalWrapper = () => ({ children }: { children: ReactNode }) => (
  <ModalProvider>
    {children}
  </ModalProvider>
);
