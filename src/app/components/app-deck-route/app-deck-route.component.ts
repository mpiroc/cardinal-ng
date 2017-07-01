import { Component } from '@angular/core';

@Component({
  selector: 'app-deck-route',
  templateUrl: './app-deck-route.component.html',
  styleUrls: [ './app-deck-route.component.css' ],
})
export class AppDeckRouteComponent {
  mockData: any;

  constructor() {
    this.mockData = [
      {
        front: 'some front side text',
        back: 'some back side text',
        nextDue: 'Tomorrow',
      },
      {
        front: 'some front side text',
        back: 'some back side text',
        nextDue: 'Tomorrow',
      },
      {
        front: 'some front side text',
        back: 'some back side text',
        nextDue: 'Tomorrow',
      },
      {
        front: 'some front side text',
        back: 'some back side text',
        nextDue: 'Tomorrow',
      },
      {
        front: 'some front side text',
        back: 'some back side text',
        nextDue: 'Tomorrow',
      },
    ];
  }
}