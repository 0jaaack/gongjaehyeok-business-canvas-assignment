import { type ReactElement, type ReactNode } from 'react';
import { ModalProvider } from '../components/ModalProvider';
import { createServices, type ServiceContext, type Services } from '../services';
import { ServiceProvider } from '../components/ServiceProvider';

export type WrapperFunction = ({ children }: { children?: ReactNode }) => ReactElement;

export const createModalWrapper = () => ({ children }: { children?: ReactNode }): ReactElement => (
  <ModalProvider>
    {children}
  </ModalProvider>
);

const DEFAULT_CONTEXT: ServiceContext = { storage: 'in-memory' };

export const createServiceProvider = (services?: Services) => ({ children }: { children?: ReactNode }): ReactElement => (
  <ServiceProvider services={services ?? createServices(DEFAULT_CONTEXT)}>
    {children}
  </ServiceProvider>
);

export const createCombineWrapper = (wrappers: WrapperFunction[]): WrapperFunction => {
  return ({ children }: { children?: ReactNode }): ReactElement => {
    return wrappers.reduce((element, Wrapper) => <Wrapper>{element}</Wrapper>, <>{children}</>);
  };
};
