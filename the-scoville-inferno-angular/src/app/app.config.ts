import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import apiRequestInterpector from './core/interceptors/api-request.interceptor';
import apiResponseInterpector from './core/interceptors/api-response.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiRequestInterpector, apiResponseInterpector])),
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'dark-mode'
        }
      }
    })
  ]
};
