import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Subscription } from 'rxjs';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { constant } from 'src/app/utils/constant';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.css']
})
export class QuizGameComponent implements OnInit {
  public name: string = "";
  userId: any;
  value1 = 1;
  wordNote: boolean = true;
  public interval$: Subscription | undefined;
  public counter: number = 60;
  wordNotLearned: boolean = false;
  isQuizCompleted: boolean = false; 
  currentWordBook: any;
  listSortedWord: any[] = [];
  isVisible = true;
  isConfirmLoading = false;
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
  wordList : any[] = [];
  public currentQuestion: number = 0;
  public correctAnswer: number = 0;
  public inCorrectAnswer: number = 0;
  public progress: string = "0";
  public questionList: any[] = [];
  
  constructor(
    private wordbookService : WordbookManagementService,
    private router : Router,
    private http: WordManagementService,
    private modal : NzModalService,
    private authService : AuthService,
    private toast : NgToastService
  ) { }

  ngOnInit(): void {
    this.getUserId();
    this.fetchData().then(()=>{
      this.getCourseInfo(this.userId)
    });
    this.name = localStorage.getItem("name") || "";
    this.startCounter();
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
        this.generateQuestionList();
      } catch (error) {
        console.error('Error fetching word list:', error);
      }
    } else {
      console.warn('No cached word book found');
    }
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
        if (this.wordList.length == 0) {
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
        } else {
          this.generateQuestionList();
        }
      });
  }

  generateQuestionList(): void {
    this.questionList = this.wordList.map(wordObject => {
      // Randomly decide whether the question will be based on wordKanji or wordMean
      const useKanjiAsQuestion = Math.random() > 0.5;
      
      let questionText: string;
      let correctAnswerText: string;
      let otherOptions: string[];
  
      if (useKanjiAsQuestion) {
        // Set wordKanji as the question and wordMean as the correct answer
        questionText = wordObject.wordKanji;
        correctAnswerText = wordObject.wordMean;
        // Create a list of other meanings excluding the current word's meaning
        otherOptions = this.wordList
          .filter(wordObj => wordObj.wordMean !== wordObject.wordMean)
          .map(wordObj => wordObj.wordMean);
      } else {
        // Set wordMean as the question and wordKanji as the correct answer
        questionText = wordObject.wordMean;
        correctAnswerText = wordObject.wordKanji;
        // Create a list of other kanjis excluding the current word's kanji
        otherOptions = this.wordList
          .filter(wordObj => wordObj.wordKanji !== wordObject.wordKanji)
          .map(wordObj => wordObj.wordKanji);
      }
  
      // Shuffle the other options
      this.shuffleArray(otherOptions);
  
      // Select three random incorrect answers
      let incorrectOptions = otherOptions.slice(0, 3);
  
      // Create options array with one correct and three incorrect answers
      let options = [
        { optionText: correctAnswerText, correct: true },
        ...incorrectOptions.map(option => ({ optionText: option, correct: false }))
      ];
  
      // Shuffle the options so the correct answer isn't always first
      this.shuffleArray(options);
  
      // Return question object
      return {
        questionText: questionText,
        options: options,
        explain: "Explanation goes here" 
      };
    });
    this.currentQuestion = 0;
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
    this.progress = "0";
  }
  
  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.startCounter();
  }

  async updatePoint(points: number){
    this.http.updatePoint(this.userId, this.currentWordBook, points)
   .subscribe((response: any) => {});
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

  nextQuestion(): void {
    if (this.currentQuestion < this.questionList.length - 1) {
      this.currentQuestion++;
      this.getProgressPercent();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.getProgressPercent();
    }
  }

  answer(currentQno: number, option: any): void {
    const audio = new Audio();
    if (currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      const gamePoint = this.courseInfo.coursePoint + this.points
      this.updatePoint(gamePoint);
      this.stopCounter();
    }

    if (option.correct) {
      audio.src='assets/sounds/correct.mp3';
      this.points += 10;
      this.correctAnswer++;
      setTimeout(() => {
        this.nextQuestion();
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      audio.src='assets/sounds/incorrect.mp3';
      setTimeout(() => {
        this.nextQuestion();
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
      this.points -= 10;
    }
    audio.load();
    audio.play();
  }

  startCounter(): void {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        if (this.currentQuestion < this.questionList.length - 1) {
          this.currentQuestion++;
          this.counter = 60;
          this.points -= 10;
        } else {
          this.isQuizCompleted = true;
          this.stopCounter();
        }
      }
    });
    setTimeout(() => {
      this.stopCounter();
    }, 600000); // 10 minutes
  }

  stopCounter(): void {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.counter = 0;
  }

  resetCounter(): void {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  resetQuiz(): void {
    this.resetCounter();
    this.points = 0;
    this.counter = 60;
    this.currentQuestion = 0;
    this.progress = "0";
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
    this.isQuizCompleted = false;
  }

  getProgressPercent(): string {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }

  navigateBack() {
    this.router.navigate([`home/learn/course`], {
      queryParams: { id: this.currentWordBook },
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
}
