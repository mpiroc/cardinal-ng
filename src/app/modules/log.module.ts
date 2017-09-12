import { NgModule } from '@angular/core';
import { LogService, LogServiceImplementation } from '../services/log.service';

@NgModule({
  providers: [
    { provide: LogService, useClass: LogServiceImplementation },
  ],
})
export class LogModule {
}
