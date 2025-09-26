import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppConfig } from './app/appconfig';

fetch('/assets/config.json')
  .then(res => res.json())
  .then((config: AppConfig) => {
    platformBrowserDynamic([
      { provide: 'APP_CONFIG', useValue: config }
    ])
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
  });

