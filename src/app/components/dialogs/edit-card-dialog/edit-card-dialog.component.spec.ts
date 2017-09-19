import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { EditCardDialogComponent, IEditCardDialogData } from './edit-card-dialog.component'

import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/of'

@Injectable()
class EmptyProvider {
}

@Injectable()
class EditCardDialogData implements IEditCardDialogData {
  title: 'myTitle'
}

describe('components', () => {
  describe('EditCardDialogComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        ...config,
        providers: config.providers.concat([
          { provide: MdDialogRef, useClass: EmptyProvider },
          { provide: MD_DIALOG_DATA, useClass: EditCardDialogData }
        ])
      }).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(EditCardDialogComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
