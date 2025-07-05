import { type ModalProps } from 'antd';
import { cloneElement, useState, type ReactElement, type ReactNode } from 'react';
import { ModalContentSetterContext } from '../contexts/modal';

type ModalProviderProps = {
  children: ReactNode;
};

export function ModalProvider(props: ModalProviderProps) {
  const { children } = props;

  const [modalContent, setModalContent] = useState<ReactElement<ModalProps> | null>(null);

  return (
    <ModalContentSetterContext.Provider value={setModalContent}>
      {children}
      {modalContent != null && cloneElement(modalContent, { open: true })}
    </ModalContentSetterContext.Provider>
  );
}
