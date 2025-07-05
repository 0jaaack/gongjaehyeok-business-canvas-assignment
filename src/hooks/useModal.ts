import { useCallback, useContext, type ReactElement } from 'react';
import { ModalContentSetterContext } from '../contexts/modal';
import type { ModalProps } from 'antd';

export function useModal() {
  const setModalContent = useContext(ModalContentSetterContext);

  const openModal = useCallback((modal: ReactElement<ModalProps>) => {
    setModalContent(modal);
  }, [setModalContent]);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, [setModalContent]);

  return { openModal, closeModal };
}
