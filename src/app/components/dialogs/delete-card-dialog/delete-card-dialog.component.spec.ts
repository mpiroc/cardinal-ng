import { TestBed, async } from '@angular/core/testing'
import { config } from '../../../modules/cardinal.module'
import { DeleteCardDialogComponent } from './delete-card-dialog.component'

import { MdDialogRef } from '@angular/material'
import { Injectable } from '@angular/core'

@Injectable()
class EmptyProvider {
}


describe('components', () => {
  describe('DeleteCardDialogComponent', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        ...config,
        providers: config.providers.concat([
          { provide: MdDialogRef, useClass: EmptyProvider }
        ]),
      }).compileComponents()
    }))

    it('should initialize without errors', async(() => {
      const fixture = TestBed.createComponent(DeleteCardDialogComponent)
      const component = fixture.debugElement.componentInstance
      expect(component).toBeTruthy()
    }))
  })
})
