import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import apiRequestInterpector from './core/interceptors/api-request.interceptor';
import apiResponseInterpector from './core/interceptors/api-response.interceptor';
import { definePreset } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
        primary: {
            50: '{rose.50}',
            100: '{rose.100}',
            200: '{rose.200}',
            300: '{rose.300}',
            400: '{rose.400}',
            500: '{rose.500}',
            600: '{rose.600}',
            700: '{rose.700}',
            800: '{rose.800}',
            900: '{rose.900}',
            950: '{rose.950}'
        }
  }
})

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiRequestInterpector, apiResponseInterpector])),
    MessageService,
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark-mode'
        }
      }
    })
  ]
};
