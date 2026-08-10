import { AppEnvironment } from './environment.model';

/** Development environment. Used by `ng serve` and `ng build --configuration development`. */
export const environment: AppEnvironment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  siteUrl: 'http://localhost:4200',
  enableDebugTools: true,
};
