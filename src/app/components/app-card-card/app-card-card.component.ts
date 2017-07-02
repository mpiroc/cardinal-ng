import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-card',
  templateUrl: 'app-card-card.component.html',
  styleUrls: [ 'app-card-card.component.css' ],
})
export class AppCardCardComponent {
  @Input() card: any;
}