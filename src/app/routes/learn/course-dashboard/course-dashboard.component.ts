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
import { LearnService } from 'src/app/services/Learn/learn.service';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
@Component({
  selector: 'app-course-dashboard',
  templateUrl: './course-dashboard.component.html',
  styleUrls: ['./course-dashboard.component.css'],
})
export class CourseDashboardComponent implements OnInit {
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
  visibleCopy:any = false;
  settingVisible = false;
  currentData: any;
  wordListData: any;
  isRole: any;
  editWordForm: any;
  currentWord: any;
  newCourseName : any ;
  selectedValue: any;
  userId: any;
  classList : any[] = [];
  isClass: any = false
  showCongratulation = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private learn : LearnService,
    private wordbookService: WordbookManagementService,
    private message: NzMessageService,
    private http: WordManagementService,
    private toast: NgToastService,
    private authService: AuthService,
    private eRef: ElementRef,
    private community : CommunityManagementService,
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
      await this.getUserInfo();
      await this.getCourseInfo(this.userId); 
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
          .getWordbookById(this.userId, this.currentWordBook)
          .toPromise();
        this.currentData = response;
        this.wordListData = response;
        console.log(response)
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Bài viết không có từ nào, hãy thêm vào',
          duration: 5000,
        });
      }
    }
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
        console.log('creatorInfo', this.creatorInfo);
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
        this.courseInfo = response;
        console.log('courseInfo', this.courseInfo);
        this.percent = Math.floor((this.courseInfo.progress / this.courseInfo.totalWord) * 100);
        console.log('percent', this.percent);
        this.checkUserRole(this.courseInfo.creatorId);
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Không lấy được thông tin của bài học',
          duration: 5000,
        });
      }
    }
  }

  onClickShareButton(id: any) {
    console.log('id' + id.toString());
    this.router.navigate([`/${staticPath.COMMUNITY}`, { id }]);
    this.wordbookService.currentWordBook(id);
  }

  onClickSetting() {
    this.settingVisible = !this.settingVisible;
    console.log('Setting clicked');
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  handleOkClass(): void {
    console.log('Button ok clicked!');
    this.isClass = false;
  }

  handleCancelClass(): void {
    console.log('Button cancel clicked!');
    this.isClass= false;
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
    try {
      const response = await this.http
        .noteWord(this.userId, wordId, wordNote)
        .toPromise();
      // Assuming the response contains the updated data
      this.fetchData(); // Refresh data after note update
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Sửa không thành công',
        duration: 5000,
      });
    }
  }

  onWordEdited(): void {
    this.fetchData();
    console.log('aloo');
  }

  onUpdateProgress(): void {
    this.getCourseInfo(this.userId);
  }

  onUpdateCurrentWord(): void {
    this.getCourseInfo(this.userId);
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

  settingWordList() {
    // this.getCourseInfo(this.userId)
  }

  onSettingWordList(event: any) {
    console.log('event', event.selectedWordNote, event.selectedLearnedStatuses);
    this.http
      .settingWordList(
        this.userId,
        this.courseInfo.courseId,
        event.selectedWordNote,
        event.selectedLearnedStatuses
      )
      .subscribe(
        (response: any) => {
          this.currentData = response;
        },
        (error: any) => {
          console.error('Error setting word list filters', error);
        }
      );
  }
  open(): void {
    this.visibleCopy = true;
  }
  close(): void {
    this.visibleCopy = false;
  }
  async onClickSubmit() {
    try {
      this.wordbookService.copyWordBook(this.userId, this.currentWordBook, { Name: this.newCourseName })
        .subscribe(
          (response: any) => {
            const newCourseId = response.courseId;
            
            this.message.loading('Khóa học đang được sao chép');
            this.visibleCopy = false;
            this.wordbookService.setCurrentWordBook(newCourseId);
            this.newCourseName = '';
            this.toast.success({
              detail: 'Success',
              summary: 'Đã sao chép thành công',
              duration: 5000,
            });
            window.location.href = `/${staticPath.COURSE}`,{id:newCourseId};
          },
          (error) => {
            this.toast.warning({
              detail: 'Warning',
              summary: 'Hãy nhập tên tài liệu',
              duration: 5000,
            });
          }
        );
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Hãy nhập tên tài liệu',
        duration: 5000,
      });
    }
  }
  
  getFilteredWords() {
    let wordNote: any;
    let learnedStatus1: any;

    switch (this.selectedValue) {
      case '1':
        learnedStatus1 = '1'; // Assuming "1" means learning
        break;
      case '2':
        learnedStatus1 = '0'; // Assuming "0" means not learning
        break;
      case '3':
        wordNote = '1'; // Assuming "1" means marked
        break;
    }
    console.log('note', wordNote, learnedStatus1);
    this.http
      .settingWordList(
        this.userId,
        this.courseInfo.courseId,
        wordNote,
        learnedStatus1
      )
      .subscribe(
        (response: any) => {
          this.wordListData = response;
        },
        (error: any) => {
          console.error('Error fetching filtered words', error);
        }
      );
  }
  async showModalRanking() {
    this.isRanking = true;
    this.wordbookService.rankingUser(this.currentWordBook).subscribe((res: any) => {
      this.rankingList = res;
      console.log('ranking',this.rankingList);
    });
  }
  onClickAddCourse (id:any){
    this.community.addCourseInClass(id,this.currentWordBook).
    subscribe(
      (response) => {
        this.router.navigate(['home/class'], { queryParams: { classId: id } });
        this.toast.info({
          detail: 'Thông tin',
          summary: 'Đã thêm học phần ',
          duration: 2000,
        });
      },
      (error) => {
        
        this.toast.warning({
          detail: 'Thông tin',
          summary: 'Học phần đã có trong lớp ',
          duration: 2000,
        });
      }
   )
  }
  async ShowListClass(){
    this.isClass = true 
    try {
      this.learn.getCreatedClasses(this.userId).subscribe(
        (data: any) => {
          this.classList = data;
          console.log('data', this.classList);
        },
        (error) => {
          console.error('Error fetching created classes', error);
        }
      );
    } catch (err) {
      console.error('Error in getCreatedClassData method', err);
    }
  }
  playSpeech(word: string) {
    this.wordbookService.speechAPi(word).subscribe((response: Blob) => {
      const audioUrl = URL.createObjectURL(response);
      const audio = new Audio(audioUrl);
      audio.play();
    });
  }
handleCancelRanking(){
this.isRanking = false;
}
handleOkRanking(){
this.isRanking = false;
}
  onClickExport() {
    this.http.exportWordList(this.courseInfo.courseId).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Danh sách từ-${this.courseInfo.courseId}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.settingVisible = false;
      },
      (error: any) => {
        console.error('Error exporting wordbook', error);
      }
    );
  }

  onClickDeleteCourse() {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa học phần này khỏi học liệu không ?',
      nzContent:
        '<b style="color: red;">Học liệu của bạn sẽ bị xóa hoàn toàn khỏi hệ thống</b>',
      nzOkText: 'Xóa học phần',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.http.deleteCourse(this.courseInfo.courseId).subscribe(
          (response: any) => {
            console.log('Course deleted successfully', response);
            this.router.navigate(['/home/created-wordbooks']);
          },
          (error: any) => {
            console.error('Error deleting course', error);
          }
        ),
      nzCancelText: 'Hủy',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  onClickTrashCourse() {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn bỏ học phần này khỏi học liệu không ?',
      nzContent: '<b style="color: red;">Bỏ đi sẽ mất nhiều điều đó</b>',
      nzOkText: 'Bỏ học phần',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.http.trashCourse(this.userId, this.courseInfo.courseId).subscribe(
          (response: any) => {
            console.log('Course trashed successfully', response);
            this.router.navigate(['/home/created-wordbooks']);
          },
          (error: any) => {
            console.error('Error trashing course', error);
          }
        ),
      nzCancelText: 'Hủy',
      nzOnCancel: () => console.log('Cancel'),
    });
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

  saveEditedWord(data: any) {
    const updateword = this.editWordForm.value;
    if (this.editWordForm.valid) {
      const formData = new FormData();
      formData.append('wordHiragana', updateword.wordHiragana);
      formData.append('wordKanji', updateword.wordKanji);
      formData.append('wordMean', updateword.wordMean);
      if (updateword.wordExample) {
        formData.append('wordExample', updateword.wordExample);
      }
      if (updateword.imageFile) {
        formData.append('imageFile', updateword.imageFile);
      }
  
      this.wordbookService.updateWord(data.wordId, formData).subscribe((res) => {
        data = { ...data, ...updateword };
        this.fetchData();
        this.editWordId = null;
      });
    }
  }
  

  cancelEdit() {
    this.editWordId = null;
  }
}
