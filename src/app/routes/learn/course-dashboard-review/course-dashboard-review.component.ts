import { NgToastService } from 'ng-angular-popup';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { constant } from 'src/app/utils/constant';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { WordListDetailComponent } from '../word-list/word-list-detail/word-list-detail/word-list-detail.component';
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { staticPath } from 'src/app/utils/staticPath';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-course-dashboard-review',
  templateUrl: './course-dashboard-review.component.html',
  styleUrls: ['./course-dashboard-review.component.css']
})
export class CourseDashboardReviewComponent implements OnInit  {
  currentWordBook: any;
  cachedWordBook: any;
  courseName: string | undefined;
  courseInfo: any;
isRanking : any =false;
  disabled = false;
  rankingList : any[]= []
  creatorInfo: any;
  isCreator: boolean = false;
  percent = 0;
  isEdit = false;
  editWordId: any;
  isVisible = false;
  settingVisible = false;
  currentData: any;
  wordListData: any;
  isRole: any;
  editWordForm: any;
  currentWord: any;
  selectedValue: any;
  userId: any;
  showCongratulation = false;
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
    this.editWordForm = this.fb.group({
      wordKanji: ['', Validators.required],
      wordHiragana: ['', Validators.required],
      wordMean: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getUserId();
    if (this.userId) {
      console.log(`User ID: ${this.userId}`);
      await this.fetchData();
      console.log(`Percent:${this.percent} `)
    } else {
      console.error('User ID not set');
    }
  }

  async fetchData() {
    this.cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (this.cachedWordBook) {
      this.currentWordBook = JSON.parse(this.cachedWordBook);
      try {
        const response = await this.wordbookService
          .getCourseByStatus(this.userId, this.currentWordBook)
          .toPromise();
        this.currentData = response;
        this.wordListData = response;
        console.log('current',this.currentData)
        console.log('wordListData', this.wordListData);
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Bài viết không có từ nào, hãy thêm vào',
          duration: 5000,
        });
      }
    }
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

  async noteWordReceive(wordId: string, wordNote: any): Promise<void> {
    console.log('word',wordNote)
    try {
      const response = await this.http
        .noteWord(this.userId, wordId, wordNote)
        .toPromise();
      this.fetchData(); // Refresh data after note update
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Sửa không thành công',
        duration: 5000,
      });
    }
  }
  onClickEditWord(data: any): void {
    this.editWordId = data.wordId;
    this.isEdit = !this.isEdit;
    const currentWord = data;
    this.editWordForm.patchValue({
      wordKanji: currentWord.wordKanji || '',
      wordHiragana: currentWord.wordHiragana || '',
      wordMean: currentWord.wordMean || '',
    });
  }

  onWordEdited(): void {
    this.fetchData();
    console.log('aloo');
  }


  checkUserRole(creatorInfo: any) {
    if (this.userId == creatorInfo) {
      this.isRole = true;
    } else {
      this.isRole = false;
    }
  }

  showCongratulationDialog(): void {
    // Hiển thị dialog chúc mừng ở đây
    // Ví dụ:
    this.showCongratulation = true;
  }

 

  
  }


 
  

