import { AppComponent } from './app/app.component';
import { serverConfig } from './app/app.config.server';
import { bootstrapApplication } from '@angular/platform-browser';

// ✅ Same bootstrapApplication as browser
//    but with serverConfig instead of appConfig
const bootstrap = () => bootstrapApplication(AppComponent, serverConfig);

export default bootstrap;
