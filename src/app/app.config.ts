import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import  Aura  from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoaderInterceptor } from './components/interceptos/loader.interceptor';
import { AuthInterceptor } from './components/interceptos/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
        withInterceptors([LoaderInterceptor, AuthInterceptor])
    ),
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),
  ]
};