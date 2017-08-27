import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserDeck } from '../../models/firebase-models';

@Component({
  selector: 'cardinal-review-deck-route',
  templateUrl: './review-deck-route.component.html',
  styleUrls: [ './review-deck-route.component.css' ],
})
export class ReviewDeckRouteComponent implements OnInit {
  private deck: IUserDeck;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.deck = this.activatedRoute.snapshot.data['deck'];
  }
}