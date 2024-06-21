import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/routes/Authorize/serviceAuthorize/auth.service';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { ChangeDetectorRef } from '@angular/core';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
interface CheckOption {
  label: string;
  value: string;
  checked: boolean;
}
interface WordListSetting {
  selectedWordNote: string | null;
  selectedLearnedStatuses: string;
}
@Component({
  selector: 'app-word-list-detail',
  templateUrl: './word-list-detail.component.html',
  styleUrls: ['./word-list-detail.component.css'],
})
export class WordListDetailComponent implements OnInit, OnDestroy {
  @Input() listOfWords: any[] = [];
  @Input() isRole: any;
  @Input() userId: any;
  @Input() courseInfo: any;
  @Input() percent: any;
  @Input() currentIndexWord: any;
  @Output() noteWord = new EventEmitter<any>();
  @Output() editWord = new EventEmitter<void>();
  @Output() settingWordList = new EventEmitter<WordListSetting>();
  @Output() updProgress = new EventEmitter<void>();
  @Output() updCurrentWord = new EventEmitter<void>();
  @Output() completion = new EventEmitter<void>();
  isFlipped: boolean = false;
  isPrevious = false;
  currentIndex: number = 0;
  isNext = true;
  autoNextInterval: any;
  isAutoNextActive: boolean = false;
  isVisible = false;
  isSetting = false;
  isFlag: any;
  editWordForm: FormGroup;
  isSettingWord = false;
  allChecked = false;
  indeterminate = false;
  checkOptionsOne: CheckOption[] = [
    { label: 'Từ vựng được đánh dấu', value: '1', checked: true },
    { label: 'Từ vựng chưa học', value: '0', checked: false },
    { label: 'Từ vựng đã học', value: '1', checked: false },
  ];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private authService: AuthService,
    private http: WordManagementService,
    private toast: NgToastService,
    private cdr: ChangeDetectorRef,
    private wordbookService: WordbookManagementService
  ) {
    this.editWordForm = this.fb.group({
      wordKanji: ['', Validators.required],
      wordHiragana: ['', Validators.required],
      wordExample: ['', Validators.required],
      wordMean: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.currentIndexWord = this.courseInfo.currentWord;
    this.currentIndex = this.currentIndexWord;
    this.updateNavigationButtons();
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.stopAutoNext();
  }

  showModal(): void {
    this.isVisible = true;
    const currentWord = this.listOfWords[this.currentIndex];
    this.editWordForm.patchValue({
      wordKanji: currentWord.wordKanji || '',
      wordHiragana: currentWord.wordHiragana || '',
      wordExample: currentWord.example || '',
      wordMean: currentWord.wordMean || '',
    });
  }
 handleOk(): void {
  console.log(1)
  if (this.editWordForm.valid) {
    const currentWord = this.listOfWords[this.currentIndex];
    const updatedWord = this.editWordForm.value;

    const formData = new FormData();
    formData.append('wordKanji', updatedWord.wordKanji);
    formData.append('wordHiragana', updatedWord.wordHiragana);
    formData.append('wordMean', updatedWord.wordMean);
    formData.append('wordExample', updatedWord.wordExample);

    this.http.editWord(currentWord.wordId, formData).subscribe(
      (response) => {
        this.listOfWords[this.currentIndex] = {
          ...currentWord,
          ...updatedWord,
        };
        this.editWord.emit();
      },
      (error) => {
        this.toast.error({
          detail: 'Error',
          summary: 'Xử lý lỗi',
          duration: 5000,
        });
      }
    );
  } else {
    console.error('Form is invalid');
  }
  this.isVisible = false;
}


  showModalSetting(): void {
    this.isSettingWord = true;
  }

  handleOkSetting(): void {
    this.isSetting = false;
  }

  handleCancelSetting(): void {
    this.isSetting = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onClickCard(event: any): void {
    this.isFlipped = !this.isFlipped;
  }

  async increase(): Promise<void> {
    await this.nextWord();
  }

  async decline(): Promise<void> {
    await this.previousWord();
  }

  async shuffleWords(): Promise<void> {
    for (let i = this.listOfWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.listOfWords[i], this.listOfWords[j]] = [
        this.listOfWords[j],
        this.listOfWords[i],
      ];
    }
    this.currentIndex = 0;
    this.resetFlip();
    this.updateProgress();
    await this.updateCurrentWordIndex();
  }

  async nextWord(): Promise<void> {
    await this.learnedStatusUpdate();

    if (this.currentIndex < this.listOfWords.length - 1) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = this.listOfWords.length - 1;
    }
    this.resetFlip();
    this.updateProgress();
    this.updateNavigationButtons();
    await this.updateCurrentWordIndex();
  }

  async previousWord(): Promise<void> {
    await this.learnedStatusUpdate();
    if (this.currentIndex >= 1) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = 0;
    }
    this.resetFlip();
    this.updateProgress();
    this.updateNavigationButtons();
    await this.updateCurrentWordIndex();
  }

  updateNavigationButtons(): void {
    this.isPrevious = this.currentIndex > 0;
    this.isNext = this.currentIndex < this.listOfWords.length - 1;
  }

  resetFlip(): void {
    this.isFlipped = false;
  }

  startAutoNext(): void {
    this.isAutoNextActive = true;
    this.autoNextInterval = setInterval(async () => {
      await this.learnedStatusUpdate();
      await this.increase();
    }, 5000);
  }

  stopAutoNext(): void {
    this.isAutoNextActive = false;
    if (this.autoNextInterval) {
      clearInterval(this.autoNextInterval);
    }
  }

  async updateProgress(): Promise<void> {
    if (this.listOfWords.length > 0) {
      if (this.currentIndex >= this.courseInfo.progress) {
        console.log(this.currentIndex);
        this.http
          .updateProgress(
            this.userId,
            this.courseInfo.courseId,
            this.currentIndex+1
          )
          .subscribe(
            (response) => {
              this.percent = Math.floor(
                (this.currentIndex / this.listOfWords.length) * 100
              );
              console.log(this.percent);
              this.updProgress.emit();
              if (this.percent === 100) {
                this.emitCompletionEvent();
              }
            },
            (error) => {
              this.toast.warning({
                detail: 'Warning',
                summary: 'Cập nhật tiến độ có trục trặc',
                duration: 5000,
              });
            }
          );
      } else {
        console.log('Percent is less than progress, no need to update.');
      }
    } else {
      this.currentIndex = 0;
    }
  }

  emitCompletionEvent(): void {
    this.completion.emit();
  }

  async updateCurrentWordIndex(): Promise<void> {
    try {
      await this.http
        .updateCurrentWord(
          this.userId,
          this.courseInfo.courseId,
          this.currentIndex
        )
        .toPromise();
    } catch (error) {
      this.updCurrentWord.emit();
    
    }
  }
  playSpeech(word: string,event:any) {
    event.stopPropagation();
    this.wordbookService.speechAPi(word).subscribe((response: Blob) => {
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map((item) => ({
        ...item,
        checked: true,
      }));
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map((item) => ({
        ...item,
        checked: false,
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  handleCancelSettingWord(): void {
    this.isSettingWord = false;
  }

  handleOkSettingWord() {
    const selectedWordNote = this.checkOptionsOne.find(
      (option) => option.label === 'Từ vựng được đánh dấu'
    )?.checked
      ? '1'
      : null;
    const selectedLearnedStatuses = this.checkOptionsOne
      .filter(
        (option) => option.label !== 'Từ vựng được đánh dấu' && option.checked
      )
      .map((option) => option.value)
      .join(',');
    this.currentIndex = 0;
    this.settingWordList.emit({ selectedWordNote, selectedLearnedStatuses });
    this.isSettingWord = false;
  }

  updateFlagButton(): void {
    if (this.listOfWords[this.currentIndex]?.wordNote === 1) {
      this.renderer.addClass(
        this.elementRef.nativeElement.querySelector('#flagButton'),
        'active'
      );
    } else {
      this.renderer.removeClass(
        this.elementRef.nativeElement.querySelector('#flagButton'),
        'active'
      );
    }
  }

  noteWordSend() {
    const wordId = this.listOfWords[this.currentIndex].wordId;
    const wordNote = this.listOfWords[this.currentIndex].wordNote === 0 ? 1 : 0;
    this.noteWord.emit({ wordId, wordNote });
  }

  async learnedStatusUpdate() {
    const currentWord = this.listOfWords[this.currentIndex];
    if (currentWord.learnedStatus !== 1) {
      try {
        await this.http
          .learnedUpdate(this.userId, currentWord.wordId)
          .toPromise();
        currentWord.learnedStatus = 1; // Update the local status to avoid redundant updates
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Không có phản hồi với hệ thống',
          duration: 5000,
        });
      }
    }
  }
}
