import { Inject, Injectable } from '@angular/core';
import { AppConfig } from './appconfig';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  constructor(@Inject('APP_CONFIG') private config: AppConfig) {}

  get apiUrl(): string {
    return this.config.apiUrl;
  }
}
