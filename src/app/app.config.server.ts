// import { ApplicationConfig } from '@angular/core';
// import { provideServerRendering } from '@angular/platform-server';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';

// export const serverConfig: ApplicationConfig = {
//   providers: [
//     provideServerRendering(),
//     provideRouter(routes),
//   ],
// };

import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);