import { type ReactNode } from 'react';
import type { Services } from '../services';
import { ServicesContext } from '../contexts/sevice';

type ServiceProviderProps = {
  children: ReactNode;
  services: Services;
};

export function ServiceProvider(props: ServiceProviderProps) {
  const { children, services } = props;
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
