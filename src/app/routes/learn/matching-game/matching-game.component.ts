
import { Component, OnInit } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { CardData } from './card-data.model';
@Component({
  selector: 'app-matching-game',
  templateUrl: './matching-game.component.html',
  styleUrls: ['./matching-game.component.css'],
  
})
export class MatchingGameComponent implements OnInit {

  wordList = [
    { word: 'こんにちは', mean: 'chào buổi sáng', wordId: '1' },
  { word: 'ありがとう', mean: 'cảm ơn', wordId: '2' },
  { word: 'さようなら', mean: 'tạm biệt', wordId: '3' },
  { word: 'おはよう', mean: 'chào buổi sáng (thân mật)', wordId: '4' },
  { word: 'こんばんは', mean: 'chào buổi tối', wordId: '5' },
    // Add more word-meaning pairs as needed
  ];

  cards: CardData[] = [];

  flippedCards: CardData[] = [];

  matchedCount = 0;

  shuffleArray(anArray: any[]): any[] {
    return anArray.map(a => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map(a => a[1]);
  }

  constructor() {

  }

  ngOnInit(): void {
    this.setupCards();
  }

  setupCards(): void {
    this.cards = [];
    this.wordList.forEach((content) => {
      const meandCard: CardData = {
        wordId: content.wordId,
        state: 'default',
        type: 'word',
        content: content.word,
      };
      const wordCard: CardData = {
        wordId: content.wordId,
        state: 'default',
        type:'mean',
        content: content.mean,
      }
      this.cards.push({ ...meandCard });
      this.cards.push({ ...wordCard });

    });

    this.cards = this.shuffleArray(this.cards);
  }

  cardClicked(index: number): void {
    const cardInfo = this.cards[index];

    if (cardInfo.state === 'default' && this.flippedCards.length < 2) {
      cardInfo.state = 'flipped';
      this.flippedCards.push(cardInfo);

      if (this.flippedCards.length > 1) {
        this.checkForCardMatch();
      }

    } else if (cardInfo.state === 'flipped') {
      cardInfo.state = 'default';
      this.flippedCards.pop();

    }
  }

  checkForCardMatch(): void {
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState = cardOne.wordId === cardTwo.wordId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;

      this.flippedCards = [];

      if (nextState === 'matched') {
        this.matchedCount++;

        // if (this.matchedCount === this.cardImages.length) {
        //   const dialogRef = this.dialog.open(RestartDialogComponent, {
        //     disableClose: true
        //   });

        //   dialogRef.afterClosed().subscribe(() => {
        //     this.restart();
        //   });
        // }
      }

    }, 1000);
  }

  restart(): void {
    this.matchedCount = 0;
    this.setupCards();
  }
}
