import type { ModalProps } from 'antd';
import { createContext, type ReactElement } from 'react';

export const ModalContentSetterContext = createContext<((content: ReactElement<ModalProps> | null) => void)>(() => {});
