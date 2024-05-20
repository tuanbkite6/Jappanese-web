import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardData } from '../card-data.model';
@Component({
  selector: 'app-matching-card',
  templateUrl: './matching-card.component.html',
  styleUrls: ['./matching-card.component.css'],
  animations: [
    trigger('cardFlip', [
      state(
        'default',
        style({
          transform: 'none',
        })
      ),
      state(
        'flipped',
        style({
          transform: 'perspective(600px) rotateY(180deg)',
        })
      ),
      state(
        'matched',
        style({
          visibility: 'false',
          transform: 'scale(0.05)',
          opacity: 0,
        })
      ),
      transition('default => flipped', [animate('400ms')]),
      transition('flipped => default', [animate('400ms')]),
      transition('* => matched', [animate('400ms')]),
    ]),
  ],
})
export class MatchingCardComponent {
  @Input()
  data!: CardData;

  @Output() cardClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
