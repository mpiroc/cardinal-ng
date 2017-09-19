import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { DeleteDeckDialogComponent, IDeleteDeckDialogData } from './delete-deck-dialog.component'

import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'

@Injectable()
class EmptyProvider {
}

@Injectable()
class DeleteDeckDialogData implements IDeleteDeckDialogData {
  name$: Observable<string> = Observable.of('myName')
}

describe('components', () => {
  describe('DeleteDeckDialogComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        ...config,
        providers: config.providers.concat([
          { provide: MdDialogRef, useClass: EmptyProvider },
          { provide: MD_DIALOG_DATA, useClass: DeleteDeckDialogData }
        ])
      }).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(DeleteDeckDialogComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
