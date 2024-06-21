import { Component, OnInit } from '@angular/core';
import { CardData } from './card-data.model';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { constant } from 'src/app/utils/constant';
import { interval, Subscription } from 'rxjs';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-matching-game',
  templateUrl: './matching-game.component.html',
  styleUrls: ['./matching-game.component.css'],
})
export class MatchingGameComponent implements OnInit {
  userId: any;
  value1 = 1;
  wordNote: boolean = true;
  public interval$: Subscription | undefined;
  public counter: number = 60;
  wordNotLearned: boolean = false;
  isQuizCompleted: boolean = false; 
  currentWordBook: any;
  listSortedWord: any[] = [];
  wordList: any;
  cards: CardData[] = [];
  isVisible = true;
  isConfirmLoading = false;
  flippedCards: CardData[] = [];
  matchedCount = 0;
  markedWords = false;
  unlearnedWords = false;
  learnedWords = false;
  IncorrecCount = 0 ;
  CorrectCount = 0 ;
  wordCount = 4;
  courseInfo: any;
  cachedWordBook: any;
  loading = false;
  points: number = 0;
  isDropdownVisible = false;
  constructor(
    private wordbookService: WordbookManagementService,
    private authService: AuthService,
    private http: WordManagementService,
    private modal: NzModalService,
    private router: Router,
    private toast : NgToastService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.fetchData().then(() => {
      if (this.wordList) {
        this.setupCards(4);
        this.startCounter();
        this.getCourseInfo(this.userId);
      } else {
        console.error('Word list is undefined or null');
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  navigateBack() {
    this.router.navigate([`home/learn/course`], {
      queryParams: { id: this.currentWordBook },
    });
  }
  onDropdownVisibleChange(visible: boolean): void {
    this.isDropdownVisible = visible;
  }
  async getCourseInfo(userId: string) {
    this.cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (this.cachedWordBook) {
      this.currentWordBook = JSON.parse(this.cachedWordBook);
      try {
        const response = await this.wordbookService
          .getCourseInfo(this.currentWordBook, userId)
          .toPromise();
        this.courseInfo = response;
        console.log(response);
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Không lấy được thông tin của bài học',
          duration: 5000,
        });
      }
    }
  }
  async updatePoint(points: number){
    this.http.updatePoint(this.userId, this.currentWordBook, points)
   .subscribe((response: any) => {});
  }
  async settingGame() {
    const settings = {
      markedWords: this.markedWords ? 1 : 0,
      learnStauts: [
        this.unlearnedWords ? 0 : null,
        this.learnedWords ? 1 : null,
      ]
        .filter((status) => status !== null)
        .join(','),
      wordCount: this.wordCount,
    };
    await this.http.settingWordList(
        this.userId,
        this.currentWordBook,
        settings.markedWords,
        settings.learnStauts
      )
      .subscribe((response: any) => {
        this.wordList = response;
        if (this.wordList.length > 0) {
          this.setupCards(this.wordCount);
        } else {
          this.isVisible = false;
          const modal = this.modal.warning({
            nzTitle: 'Không có dữ liệu',
            nzContent:
              'Hiện tại không có dữ liệu nào về lựa chọn này bạn hãy chọn dữ liệu khác',
          });
          setTimeout(() => {
            modal.destroy();
            this.isVisible = true;
          }, 5000);
        }
      });
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
    this.settingGame();
    this.startCounter();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.startCounter();
  }

  onBack(): void {
    console.log('onBack');
  }

  stopCounter(): void {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.counter = 0;
  }

  shuffleArray(anArray: any[]): any[] {
    return anArray
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  }

  resetCounter(): void {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  startCounter(): void {
    this.interval$ = interval(1000).subscribe((val) => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        this.stopCounter(); // Stop counter when it reaches 0
      }
    });
    setTimeout(() => {
      this.stopCounter();
    }, 600000); // 10 minutes
  }

  async fetchData() {
    var cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (cachedWordBook) {
      this.currentWordBook = JSON.parse(cachedWordBook);
      console.log('Current Word Book:', this.currentWordBook);
      try {
        var response = await this.wordbookService
          .getWordbookById(this.userId, this.currentWordBook)
          .toPromise();
        this.wordList = response;
        console.log('Fetched Word List:', this.wordList);
      } catch (error) {
        console.error('Error fetching word list:', error);
      }
    } else {
      console.warn('No cached word book found');
    }
  }

  setupCards(wordNum: number): void {
    if (!this.wordList) {
      console.error('Word list is not available');
      return;
    }

    this.cards = [];
    const limitWordList = this.wordList.slice(0, wordNum);
    limitWordList.forEach((content: any) => {
      const meandCard: CardData = {
        wordId: content.wordId,
        state: 'default',
        type: 'word',
        content: content.wordKanji,
      };
      const wordCard: CardData = {
        wordId: content.wordId,
        state: 'default',
        type: 'mean',
        content: content.wordMean,
      };
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
    }else if(this.flippedCards.length == 0){
      this.isQuizCompleted = true;
    }
  }

  checkForCardMatch(): void {
    const audio = new Audio();
    setTimeout(() => {
      const cardOne = this.flippedCards[0];
      const cardTwo = this.flippedCards[1];
      const nextState =
        cardOne.wordId === cardTwo.wordId ? 'matched' : 'default';
      cardOne.state = cardTwo.state = nextState;
      this.flippedCards = [];
      if (nextState === 'matched') {
        audio.src = 'assets/sounds/correct.mp3';
        this.matchedCount++;
        this.points += 10;
        this.CorrectCount++;
        if(this.CorrectCount === this.wordList.length) {
          this.isQuizCompleted = true;
          const gamePoint = this.courseInfo.coursePoint + this.points
          this.updatePoint(gamePoint);
        }
      } else {
        audio.src = 'assets/sounds/incorrect.mp3';
        this.points -= 5;
        this.IncorrecCount++;
        console.log(this.points);

      }
    }, 1000);
    audio.load();
    audio.play();
  }

  restart(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.matchedCount = 0;
      this.setupCards(4);
    }, 2000);
  }

  async getUserId() {
    const userId = this.authService.getUserIdFromToken();
    console.log(userId);
    if (!userId) {
      console.error('User ID not found');
      return;
    } else {
      this.userId = userId;
    }
  }
}
