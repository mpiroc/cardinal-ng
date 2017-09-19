import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { EditDeckDialogComponent, IEditDeckDialogData  } from './edit-deck-dialog.component'

import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'

@Injectable()
class EmptyProvider {
}

@Injectable()
class EditDeckDialogData implements IEditDeckDialogData {
  title: 'myTitle'
}

describe('components', () => {
  describe('EditDeckDialogComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        ...config,
        providers: config.providers.concat([
          { provide: MdDialogRef, useClass: EmptyProvider },
          { provide: MD_DIALOG_DATA, useClass: EditDeckDialogData }
        ])
      }).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(EditDeckDialogComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
