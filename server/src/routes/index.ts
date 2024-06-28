import { patientRoutes } from './patient';
import { authRoutes } from './auth';
import { customFieldRoutes } from './customField';

export const routes = [...authRoutes, ...patientRoutes, ...customFieldRoutes];
