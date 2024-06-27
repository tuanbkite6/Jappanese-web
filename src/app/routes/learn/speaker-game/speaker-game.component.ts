import { Component, OnInit } from '@angular/core';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { constant } from 'src/app/utils/constant';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { interval, Subscription } from 'rxjs';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
interface Word {
  wordKanji : string;
  wordMean: string;
  wordHiragana: string;
}
@Component({
  selector: 'app-speaker-game',
  templateUrl: './speaker-game.component.html',
  styleUrls: ['./speaker-game.component.css']
})
export class SpeakerGameComponent implements OnInit {
 public len: number = 0;
  public word: Word | null = null;
  public index: number = 0;
  public guesses: number[] = [];
  public gameOver: string | null = null;
  public letters: string[] = [];
  public letterToGuess: string[] = [];
  public letterStaging: string[] = [];
  public correct: number = 0;
  public chances: number = 3;
  public score: number = 0;
  public chosenLetter: string[] = [];
  public numbers: number[] = [];
  public guessedLetters: string[] = [];
  currentWordBook: any;
  userId: any;
  value1 = 1;
  wordNote: boolean = true;
  public interval$: Subscription | undefined;
  public counter: number = 60;
  wordNotLearned: boolean = false;
  isQuizCompleted: boolean = false; 
  listSortedWord: any[] = [];
  wordList: Word[] = [];
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
  recording = false;
  audioChunks: Blob[] = [];
  mediaRecorder: MediaRecorder | null = null;
  constructor(
    private wordbookService: WordbookManagementService,
    private authService: AuthService,
    private http: WordManagementService,
    private modal: NzModalService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit() {
    this.getUserId();
    this.fetchData().then(() => {
      if (this.wordList) {
        this.startCounter();
        this.getCourseInfo(this.userId);
        this.start()
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
  playSpeech(word: string) {
    this.wordbookService.speechAPi(word).subscribe((response: Blob) => {
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);
      audio.addEventListener('play', () => {
        this.startAnimation();
      });
      audio.addEventListener('ended', () => {
        this.stopAnimation();
      });
      audio.play();
      
    });
  }
  startAnimation(): void {
    const boxContainer = document.getElementById('boxContainer');
    const audioIcon:any  = document.getElementById('fa-volume-high');
    if (boxContainer) {
      boxContainer.style.display = 'flex';
      audioIcon.style.display = 'none';
    }
  }
  
  stopAnimation(): void {
    const boxContainer = document.getElementById('boxContainer');
    const audioIcon:any  = document.getElementById('fa-volume-high');
    if (boxContainer) {
      boxContainer.style.display = 'none';
      audioIcon.style.display = 'block';
    }
  }

  // Mock method to play speech
  speak(wordKanji: string): void {
    console.log('Playing speech for:', wordKanji);
    // Integrate your speech playing logic here
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
        } else {
          this.isVisible = false;
          const modal = this.modal.warning({
            nzTitle: 'Không có dữ liệu',
            nzContent: 'Hiện tại không có dữ liệu nào về lựa chọn này bạn hãy chọn dữ liệu khác',
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
        this.clear(); // Call clear when the counter reaches 0
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

  stopCounter(): void {
    if (this.interval$) {
      this.interval$.unsubscribe();
    }
    this.counter = 0;
  }

  start() {
    if (this.guesses.length === this.wordList.length) {
      this.isQuizCompleted = true;
      const gamePoint = this.courseInfo.coursePoint + this.points;
      this.updatePoint(gamePoint)
      console.log('Starting')
    } else {
      this.len = this.wordList.length;
      this.index = Math.floor(Math.random() * this.len);
      this.check(this.index);
    }
  }

  check(index: number) {
    if (this.guesses.includes(index)) {
      this.start();
    } else {
      this.guesses.push(index);
      this.word = this.wordList[index];
      this.getLetters();
      console.log('check')
    }
  }

  getLetters() {
    if (this.word) {
      this.letters = this.word.wordHiragana.split('');
      this.guessedLetters = Array(this.letters.length).fill('');
      this.letterStaging = [...this.letters];
      let alphabet = "かきくけこさしすせそなにぬねのたちつてとなにぬねのまみむめもんやらりるれろ".split("");

      for (let i = 0; i < 6; i++) {
        const element = Math.floor(Math.random() * 38);
        if (!this.letters.includes(alphabet[element])) {
          this.letterStaging.push(alphabet[element]);
        }
      }

      this.letterToGuess = this.shuffle(this.letterStaging);
      this.numbers = Array(this.chances).fill(4);
    }
  }

  newGame() {
    location.reload();
  }

  shuffle(array: string[]): string[] {
    let currentIndex = array.length, temporaryValue: string, randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  guess(letter: string, i: number) {
    const audio = new Audio()
    if (!this.chosenLetter.includes(letter) && this.word) {
      this.chosenLetter.push(letter);
      const isCorrect = this.letters.includes(letter);
      const idxs: number[] = [];

      if (this.chances > 0) {
        this.resetCounter()
        if (isCorrect) {
          for (let j = this.letters.length - 1; j >= 0; j--) {
            if (this.letters[j] === letter) {
              audio.src = 'assets/sounds/correct.mp3';
              idxs.push(j);
            }
          }

          idxs.forEach(index => {
            this.guessedLetters[index] = letter;
            this.correct++;
          });

          document.getElementById(`btn${i}`)!.className = "success";

          if (this.correct === this.letters.length) {
            this.points += 10;
            setTimeout(() => {this.clear();},1500)
          }
        } else {
          this.points -= 2;
          audio.src = 'assets/sounds/incorrect.mp3';
          document.getElementById(`btn${i}`)!.className = "fail";
          this.chances--;
          this.numbers = Array(this.chances).fill(4);

          if (this.chances === 0) {
            this.points -= 5 ;
            this.IncorrecCount--;
            this.clear();
            this.stopCounter()
          }
        }
      } else {
        this.clear();
      }
    }
    audio.load();
    audio.play();
  }

  clear() {
    this.resetCounter()
    if (this.word) {
      this.guessedLetters = Array(this.letters.length).fill('');
      this.letterToGuess.forEach((_, index) => {
        const btn = document.getElementById(`btn${index}`);
        if (btn) {
          btn.className = "capitalize";
        }
      });

      this.chosenLetter = [];
      this.chances = 3;
      this.numbers = Array(this.chances).fill(4);
      this.correct = 0;
      this.letterToGuess = [];
      this.start();
    }
  }
  restart(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.matchedCount = 0;
    }, 2000);
  }

  async getUserId() {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found');
      return;
    } else {
      this.userId = userId;
    }
  }
  startRecording(): void {
    this.audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm; codecs=opus',
          audioBitsPerSecond: 48000 * 16 // Adjust to match the sample rate
        });

        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.start();
        this.recording = true;
      })
      .catch(err => {
        console.error('Error accessing microphone:', err);
      });
  }
  saveRecording(): void {
    if (this.audioChunks.length === 0) {
      console.error('No audio recorded.');
      return;
    }

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm; codecs=opus' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'recording.webm';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  stopRecording(): void {
    if (this.mediaRecorder && this.recording) {
      this.mediaRecorder.stop();
      this.recording = false;
    }
  }

  sendRecording(): void {
    if (this.audioChunks.length === 0) {
      console.error('No audio recorded.');
      return;
    }

    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm; codecs=opus' });

    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.webm');

    // Replace with your API endpoint
    const apiUrl = 'http://localhost:43268/SpeechToText/transcribe';

    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(transcription => {
      console.log('Transcription:', transcription);
      // Handle transcription response as needed
    })
    .catch(error => {
      console.error('Error sending recording:', error);
    });
  }
}
