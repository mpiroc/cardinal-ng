import { NgModule } from '@angular/core';
import { LogService } from '../services/log.service';

@NgModule({
  providers: [
    LogService,
  ],
})
export class LogModule {
}
