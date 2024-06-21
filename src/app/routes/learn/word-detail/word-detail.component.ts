import { Component } from '@angular/core';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { constant } from 'src/app/utils/constant';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-word-detail',
  templateUrl: './word-detail.component.html',
  styleUrls: ['./word-detail.component.css'],
})
export class WordDetailComponent {
  currentWordBook: any;
  editingWordBook: any;
  currentWordIndex: number = 0;
  userId: any;
  listSortedWord: any[] = [];
  hideResultMode: boolean = true;
  autoReview: boolean = false;
  isShowResult: boolean = false;
  date: any = new Date().toISOString();
  constructor(
    private wordbookService: WordbookManagementService,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.fetchData();
  }

  async fetchData() {
    var cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (cachedWordBook) {
      this.currentWordBook = JSON.parse(cachedWordBook);
      if (this.currentWordBook !== "1" && this.currentWordBook !== "2" && this.currentWordBook !== "3" && this.currentWordBook !== "4") {
        var response = await this.wordbookService
          .getWordbookById(this.userId, this.currentWordBook)
          .toPromise();
        this.currentWordBook = response;
      } else {
        var response = await this.wordbookService.getCourseByStatus(this.userId, this.currentWordBook).toPromise();
        this.currentWordBook = response;
      }
    }
  
    this.listSortedWord = Object.assign([], this.currentWordBook);
    console.log(this.listSortedWord);
  }
  
  getListSorted() {
    this.currentWordBook.wordList.forEach((element: any) => {
      console.log(element.lastLearnAt);
      console.log(this.date);
      if (element.lastLearnAt > this.date) {
        console.log('lastLearnAt lon hon');
      } else {
        console.log('today lon hon');
      }
    });
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

  async onClickReaction(wordId: any, level: number) {
    console.log(this.editingWordBook);

    var thisWord = this.listSortedWord.findIndex(
      (element: any) => element.id == wordId
    );
    this.wordbookService.updateWordStatus(this.userId, wordId, level).subscribe(
      (response) => {
        this.currentWordIndex++;
        this.isShowResult = false;
        this.toast.success({
          detail: 'Success',
          summary: 'Đã cập nhật',
          duration: 1000,
        });
      },
      (err) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Không cập nhật được',
          duration: 1000,
        });
      }
    );
    console.log(thisWord);
  }

  onClickNext() {
    this.currentWordIndex++;
  }

  onClickShowResult() {
    if (this.isShowResult) {
      this.isShowResult = false;
    } else {
      this.isShowResult = true;
    }
  }
}
