import { useContext } from 'react';
import { type Services } from '../services';
import { ServicesContext } from '../contexts/sevice';

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (services == null) {
    throw new Error('ServicesContext is not found');
  }
  return services;
}
