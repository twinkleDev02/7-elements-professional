import { AppEnvironment } from './environment.model';

/**
 * Production environment. Swapped in at build time via the `fileReplacements`
 * entry in `angular.json` (production configuration).
 */
export const environment: AppEnvironment = {
  production: true,
  apiUrl: '/api',
  siteUrl: 'https://www.7elementsprofessional.com',
  enableDebugTools: false,
};
