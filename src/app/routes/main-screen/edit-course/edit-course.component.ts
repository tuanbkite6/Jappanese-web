import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { constant } from 'src/app/utils/constant';
import { Observable } from 'rxjs';
import { staticPath } from 'src/app/utils/staticPath';
// import { CourseUpdateDto } from 'src/app/models/cours-update-dto';  // Adjust the import path as needed

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent implements OnInit {
  optionsKanji: string[] = [];
  optionHiragana: string[] = [];
  optionMean: string[] = [];
  listOfOption: string[] = [
    'Từ vựng cơ bản',
    'Ngữ pháp',
    'Luyện nói',
    'Luyện nghe hiểu',
    'Luyện đọc hiểu',
    'Kỹ năng viết',
    'Phát âm',
    'Hiểu biết văn hóa',
    'Cụm từ thông dụng',
    'Thành ngữ và tiếng lóng',
    'Chuẩn bị thi',
    'Ngôn ngữ kinh doanh',
    'Ngôn ngữ du lịch',
    'Chủ đề nâng cao',
    'Ngôn ngữ cho mục đích cụ thể',
  ];
  courseForm: FormGroup;
  cachedWordBook: any;
  userId: any;
  currentWordBook: any;
  creatorInfo: any;
  currentData: any;
  listWordSystem : any;
  initialTerms: any[] = [];
  levelCourse: any;
  imageUrl: any;
  file: File | undefined;
  termImageUrl: string[] = [];
  selectedFile: File | null = null;
  imageMin: File | null = null;
  canUpdate: any = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private wordbookService: WordbookManagementService,
    private message: NzMessageService,
    private http: WordManagementService,
    private toast: NgToastService,
    private authService: AuthService,
    private eRef: ElementRef,
    private modal: NzModalService
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      category: [[]],
      level: [''],
      terms: this.fb.array([]),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getUserId();
    if (this.userId) {
      this.fetchData();
      this.getUserInfo();
      this.getCourseInfo(this.userId);
    }
    this.getListWordSystem()
  }

  get terms(): FormArray {
    return this.courseForm.get('terms') as FormArray;
  }
getListWordSystem(){
  this.wordbookService.getWordsByType(1).subscribe(data => {
    this.listWordSystem = data;
  });
  }

  addTerm(): void {
    let allTermsValid = true;
    for (let i = 0; i < this.terms.length; i++) {
        const term = this.terms.at(i).value;
        if (!term.Kanji || !term.Hiragana || !term.Mean) {
            this.toast.warning({
                detail: 'Warning',
                summary: 'Vui lòng hoàn thành tất cả từ vựng hiện tại trước khi thêm từ mới.',
                duration: 5000,
            });
            allTermsValid = false;
            break;
        }
    }
    if (this.terms.length >= 1 && this.terms.length > this.initialTerms.length) {
        if ( allTermsValid) {
            const lastTerm = this.terms.at(this.terms.length - 1).value;
            this.saveTerm(lastTerm, this.terms.length - 1).then(() => {
                this.createNewTerm();
            });
        } 
    } else {
        this.createNewTerm();
    }
  }


  createNewTerm(): void {
    const wordGroup = this.fb.group({
      Kanji: ['', Validators.required],
      Hiragana: ['', Validators.required],
      Mean: ['', Validators.required],
      Example: ['', Validators.required],
      imageUrl: [''],
    });
    this.terms.push(wordGroup);
    this.termImageUrl.push('');
  }
  async saveTerm(term: any, index: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const formData = new FormData();
        formData.append('WordHiragana', term.Hiragana);
        formData.append('WordKanji', term.Kanji);
        formData.append('WordMean', term.Mean);
        formData.append('Example', term.Example);
        if (this.file) {
            formData.append('ImageFile', this.file);
        }
        console.log(formData);
        this.http.createWord(this.currentWordBook, formData).subscribe(
            (response) => {
                this.toast.success({
                    detail: 'Success',
                    summary: 'Từ vựng đã được lưu',
                    duration: 5000,
                });
                this.loadData();
                resolve();
            },
            (error) => {
                this.toast.warning({
                    detail: 'Warning',
                    summary: 'Hãy thêm Kanji,Hiragana,định nghĩa để lưu',
                    duration: 5000,
                });
                reject(error);
            }
        );
    });
}

  deleteTerm(index: number): void {
    this.terms.removeAt(index);
  }
  onFileSelected(event: any, index: number) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.termImageUrl[index] = e.target.result;
        this.terms.at(index).patchValue({ imageUrl: this.file });
      };
      reader.readAsDataURL(this.file);
    }
    console.log(this.file);
  }

  cancelImage(index: number) {
    this.termImageUrl[index] = ''; // Xóa URL hình ảnh của từng từ vựng
    // Đặt lại giá trị của input file
    const fileInput = <HTMLInputElement>document.getElementById('file');
    fileInput.value = '';
  }
  async saveCourse() {
    const lastTerm = this.terms.at(this.terms.length - 1).value;
    if (!lastTerm.Kanji || !lastTerm.Hiragana || !lastTerm.Mean) {
        this.toast.warning({
            detail: 'Warning',
            summary: 'Vui lòng hoàn thành tất cả từ vựng hiện tại trước khi thêm từ mới.',
            duration: 5000,
        });
        return;
    }

    if (this.terms.length > this.initialTerms.length) {
        try {
            await this.saveTerm(lastTerm, this.terms.length - 1);
            setTimeout(() => {
                this.router.navigate([`/${staticPath.COURSE}`, { id: this.currentWordBook }]);
            }, 3000);
        } catch (error) {
            console.error("Failed to save term:", error);
            return; // Exit the function if saving the term fails
        }
    }

    if (this.courseForm.valid) {
        const courseData = {
            courseName: this.courseForm.value.courseName,
            level: this.courseForm.value.level,
            category: this.courseForm.value.category,
        };
        this.wordbookService.updateCourse(this.currentWordBook, courseData).subscribe(
            async (response) => {
                for (let i = 0; i < this.terms.length; i++) {
                    const term = this.terms.at(i).value;
                    await this.updateWord(term, i);
                }
                this.router.navigate([`/${staticPath.COURSE}`, { id: this.currentWordBook }]);
                this.toast.success({
                    detail: 'Success',
                    summary: 'Đã chỉnh sửa học phần',
                    duration: 5000,
                });
            },
            (error) => {
                this.toast.error({
                    detail: 'Lỗi',
                    summary: 'Chưa chỉnh sửa thành công',
                    duration: 5000,
                });
            }
        );
    }
}

  onFocusOut(event: FocusEvent, index: number): void {
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      const term = this.terms.controls[index];
      this.updateWord(term.value, index);

    }
  }

  async updateWord(term: any, index: number) {
    const initialTerm = this.initialTerms[index];
    if (
      term.Kanji !== initialTerm.Kanji ||
      term.Hiragana !== initialTerm.Hiragana ||
      term.Mean !== initialTerm.Mean ||
      term.Example !== initialTerm.Example ||
      term.imageUrl !== initialTerm.imageUrl
    ) {
      // Prepare data to send to API
      const formData = new FormData();
      if (term.Hiragana !== initialTerm.Hiragana) {
        formData.append('WordHiragana', term.Hiragana);
      } else {
        formData.append('WordHiragana', initialTerm.Hiragana);
      }
      if (term.Kanji !== initialTerm.Kanji) {
        formData.append('WordKanji', term.Kanji);
      } else {
        formData.append('WordKanji', initialTerm.Kanji);
      }
      if (term.Mean !== initialTerm.Mean) {
        formData.append('WordMean', term.Mean);
      } else {
        formData.append('WordMean', initialTerm.Mean);
      }
      if (term.Example !== initialTerm.Example) {
        formData.append('WordExample', term.Example);
      } else {
        formData.append('WordExample', initialTerm.Example);
      }
      if (term.imageUrl && term.imageUrl !== initialTerm.imageUrl) {
        formData.append('ImageFile', term.imageUrl);
      }

      try {
        const response = await this.wordbookService
          .updateWord(term.wordId, formData)
          .toPromise();
        this.toast.success({
          detail: 'Success',
          summary: 'Từ vựng đã được cập nhật',
          duration: 5000,
        });
        // Update initial term after successful update
        this.initialTerms[index] = { ...term };
      } catch (error) {
        console.error('Error updating term:', error);
        this.toast.warning({
          detail: 'Warning',
          summary: 'Cập nhật từ vựng thất bại',
          duration: 5000,
        });
      }
    }
  }
  async fetchData() {
    this.cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (this.cachedWordBook) {
      this.currentWordBook = JSON.parse(this.cachedWordBook);
      try {
        const response = await this.wordbookService
          .getWordbookById(this.userId, this.currentWordBook)
          .toPromise();
        this.currentData = response;
        response.forEach((term: any) => {
          const termGroup = this.fb.group({
            Kanji: [term.wordKanji],
            Hiragana: [term.wordHiragana],
            Mean: [term.wordMean],
            Example: [term.example],
            imageUrl: [term.wordImg],
            wordId: [term.wordId],
          });
          this.terms.push(termGroup);
          this.termImageUrl.push(term.wordImg || '');
        });
        this.initialTerms = this.terms.value.slice();
        console.log('initial', this.initialTerms); // Store initial terms
      } catch (error) {
        const NullGroup = this.fb.group({
          Kanji: '',
          Hiragana: '',
          Mean: '',
          Example: '',
          imageUrl: '',
          wordId: '',
        });
        this.canUpdate = true;
        this.terms.push(NullGroup);
        this.toast.warning({
          detail: 'Warning',
          summary: 'Bài viết không có từ nào, hãy thêm vào',
          duration: 5000,
        });
      }
      console.log(this.terms.length)
    }
  }
async loadData(){
  const response = await this.wordbookService
  .getWordbookById(this.userId, this.currentWordBook)
  .subscribe(
    (response) => {
      this.currentData = response;
    },
    (error) => {
      const NullGroup = this.fb.group({
        Kanji: '',
        Hiragana: '',
        Mean: '',
        Example: '',
        imageUrl: '',
        wordId: '',
      });
      this.terms.push(NullGroup);
    }
  );
  
}
  async getUserId() {
    try {
      const userId = await this.authService.getUserIdFromToken();
      if (!userId) {
        console.error('User ID not found');
      } else {
        this.userId = userId;
      }
    } catch (error) {
      console.error('Error getting User ID', error);
    }
  }
  async deleteWord(wordId: string, index: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa từ này khỏi học phần không ?',
      nzContent:
        '<b style="color: red;">Từ vựng sẽ bị xóa hoàn toàn khỏi hệ thống</b>',
      nzOkText: 'Xóa từ vựng',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        //lỗi xóa chưa bị nhảy vào error
        if (wordId == null) {
          this.deleteTerm(index);
        } else {
          const response = await this.wordbookService
            .deleteWord(this.currentWordBook, wordId)
            .subscribe(
              (response) => {
                this.loadData()
                this.deleteTerm(index);
                this.toast.success({
                  detail: 'Success',
                  summary: 'Từ vựng đã được xoá',
                  duration: 5000,
                });
              },
              (error) => {
                this.toast.warning({
                  detail: 'Warning',
                  summary: 'Chưa xóa được từ vựng',
                  duration: 5000,
                });
              }
            );
        }
      },
      nzCancelText: 'Hủy',
      nzOnCancel: () => console.log('Cancel'),
    });
  }
  async getUserInfo() {
    this.cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (this.cachedWordBook) {
      this.currentWordBook = JSON.parse(this.cachedWordBook);
      try {
        const response = await this.wordbookService
          .getCreatorInfo(this.currentWordBook)
          .toPromise();
        this.creatorInfo = response;
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Không lấy được thông tin tác giả',
          duration: 5000,
        });
      }
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
        this.courseForm.patchValue({
          courseName: response.courseName,
          category: response.category,
          level: response.level,
        });
        this.levelCourse = response.level;
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Không lấy được thông tin của bài học',
          duration: 5000,
        });
      }
    }
  }

  getUpdatedTerms(): any[] {
    return this.courseForm.value.terms.filter((term: any, index: number) => {
      if (!this.initialTerms[index]) {
        return true;
      }
      const initialTerm = this.initialTerms[index];
      return (
        term.Kanji !== initialTerm.Kanji ||
        term.Hiragana !== initialTerm.Hiragana ||
        term.Mean !== initialTerm.Mean ||
        term.Example !== initialTerm.Example ||
        term.imageUrl !== initialTerm.imageUrl
      );
    });
  }
  inputValue : any;
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.optionsKanji = value ? [value, value + value, value + value + value] : [];
  }

}
