import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { staticPath } from 'src/app/utils/staticPath';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { constant } from 'src/app/utils/constant';
import { CommunityComponent } from '../community/community.component';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';

interface Course {
  courseName: string;
  category: string;
  level: any;
}

@Component({
  selector: 'app-created-workbook',
  templateUrl: './created-workbook.component.html',
  styleUrls: ['./created-workbook.component.css'],
})
export class CreatedWorkbookComponent implements OnInit {
  allWordBook: any = [];
  userId: any;
  userInfo: any;
  currentWordBook: any;
  cachedWordBook: any;
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
    'Ngôn ngữ cho mục đích cụ thể'
  ];
  groupedCourses :any[] = [];
  isVisible = false;
  activeButton: string = '';
  visible = false;
  selectedValue: any;
  public courseForm = new FormGroup({
    category: new FormControl([[]]),
    level: new FormControl(''),
    name: new FormControl(''),
  });
  Name: any = '';
  Level: any = '';
  Category: any;
  courseLength: any;
  searchInput: any;
  constructor(
    private router: Router,
    private authService: AuthService,
    private wordbookService: WordbookManagementService,
    private wordService: WordManagementService,
    private message: NzMessageService,
    private toast: NgToastService,
    private http : CommunityManagementService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getUserId();
    if (this.userId) {
      this.getUserInfo(this.userId);
      this.fetchData().then(()=>{
        this.groupCourses()
      });
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  setActive() {

    switch (this.selectedValue) {
      case 'user':
        this.getAllWordBookCreatedByUser();
        break;
      case 'learning':
        this.fetchData();
        break;
      case 'other':
        this.getAllWordBookCreatedByOtherUser();
        break;
      case 'wordNote':
        this.getAllWordNote();
        break
    };
  }

  async fetchData() {
    await this.getAllWordBook(this.userId);
    this.groupCourses()
  }

  async getAllWordBook(id: any) {
    try {
      const response = await this.wordbookService.getAllCourseByUserId(id).toPromise();
      this.allWordBook = response;
    } catch (error) {
      this.allWordBook = [];
      this.toast.warning({
        detail: 'warning',
        summary: 'Người dùng không có khóa học nào',
        duration: 5000,
      });
    }
  }
  searchHandle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value;
    // this.router.navigate(['home/search/all-search']);
  }
  searchClick(){
    this.http.searchUserCourse(this.userId,this.searchInput).subscribe(
      data => {
        this.allWordBook = data;
        this.groupCourses()
      },
      error => {
        console.error('Error searching posts:', error);
      }
    );
  }
  groupCourses() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
    const recentCourses = this.allWordBook.filter((res: any) => new Date(res.learnedAt) >= oneDayAgo);
    const lastWeekCourses = this.allWordBook.filter((res: any) => new Date(res.learnedAt) < oneDayAgo && new Date(res.learnedAt) >= oneWeekAgo);
    const thisMonthCourses = this.allWordBook.filter((res: any) => new Date(res.learnedAt) < oneWeekAgo && new Date(res.learnedAt) >= oneMonthAgo);
    const olderCourses = this.allWordBook.filter((res: any) => new Date(res.learnedAt) < oneMonthAgo);
  
    this.groupedCourses = [
      { title: 'Hôm nay', courses: recentCourses.sort((a:any, b:any) => new Date(b.learnedAt).getTime() - new Date(a.learnedAt).getTime()) },
      { title: 'Tuần trước', courses: lastWeekCourses.sort((a:any, b:any) => new Date(b.learnedAt).getTime() - new Date(a.learnedAt).getTime()) },
      { title: 'Tháng này', courses: thisMonthCourses.sort((a:any, b:any) => new Date(b.learnedAt).getTime() - new Date(a.learnedAt).getTime()) },
      { title: 'Cũ hơn', courses: olderCourses.sort((a:any, b:any) => new Date(b.learnedAt).getTime() - new Date(a.learnedAt).getTime()) }
    ];
  
    console.log(this.groupedCourses); // For debugging purposes
  }
  
  async getAllWordBookCreatedByUser() {
    try {
      const response = await this.wordbookService.getCourseCreatedByUserId(this.userId).toPromise();
      this.allWordBook = response;
      this.groupCourses()
    } catch (error) {
      this.allWordBook = [];
      this.toast.warning({
        detail: 'warning',
        summary: 'Người dùng không có khóa học nào',
        duration: 5000,
      });
    }
  }

  async getUserInfo(userId: string) {
    try {
      const response = await this.authService.getUserInfo(userId).toPromise();
      this.userInfo = response;
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Không lấy được thông tin tác giả',
        duration: 5000,
      });
    }
  }

  async getAllWordBookCreatedByOtherUser() {
    try {
      const response = await this.wordbookService.getAllCourseByOtherUserId(this.userId).toPromise();
      this.allWordBook = response;
      this.groupCourses()

    } catch (error) {
      this.allWordBook = [];
      this.toast.warning({
        detail: 'warning',
        summary: 'Người dùng không có khóa học nào',
        duration: 5000,
      });
    }
  }
 async getAllWordNote() {
  try {
    const response = await this.wordbookService.getNoteCourse(this.userId).toPromise();
    this.allWordBook = response;
    this.groupCourses()

  } catch (error) {
    this.allWordBook = [];
    this.toast.warning({
      detail: 'warning',
      summary: 'Người dùng không có khóa học nào',
      duration: 5000,
    });
  }
 }
 async onClickSubmit() {
  if (this.courseForm.valid) {
    this.Name = '';
    this.Level = '';
    this.Category = '';

    try {
      const response: any = await this.wordbookService.createWordBook(this.userId, this.courseForm.value).toPromise();
      const newCourseId = response.courseId;

      this.message.loading('Khóa học đang được thêm');
      this.visible = false;
      this.router.navigate([`/${staticPath.EDIT}`]);
      this.wordbookService.setCurrentWordBook(newCourseId);
      
      this.toast.success({
        detail: 'Success',
        summary: 'Đã tạo học phần',
        duration: 5000,
      });
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Chưa tạo thành công',
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
  async getCourseById(courseId: any) {
    this.cachedWordBook = localStorage.getItem(constant.CACHE_WORDBOOK_LABEL);
    if (this.cachedWordBook) {
      this.currentWordBook = JSON.parse(this.cachedWordBook);
      try {
        const response = await this.wordbookService.getWordbookById(this.userId, courseId).toPromise();
        this.courseLength = response.length;
      } catch (error) {
        this.toast.warning({
          detail: 'Warning',
          summary: 'Bài viết không có từ nào, hãy thêm vào',
          duration: 5000,
        });
        this.courseLength = 0; 
      }
    }
  }
  
  async goToDetailWord(userId: any, id: any): Promise<void> {
    await this.getCourseById(id).then(()=>{

   
    console.log('Course', this.courseLength )
    if (  this.courseLength > 0) {
      this.router.navigate([`/${staticPath.COURSE}`, { id }]);
      this.wordbookService.setCurrentWordBook(id);
       this.wordbookService.updateLearnTimeCourse(userId, id).toPromise();
    } else {
      this.router.navigate([`/${staticPath.EDIT}`]);
      this.wordbookService.setCurrentWordBook(id);
    }
  })
  }

  async deleteCourse(wordBook: any) {
    const id = wordBook.courseId;
    if (confirm('Bạn có chắc sẽ xóa khóa học này không')) {
      try {
        await this.wordbookService.deleteWordBook(id).toPromise();
        this.fetchData()

      } catch (error) {
        console.error(error);
      }
      this.getAllWordBook(this.userId);
    }
  }
async noteCourse(courseId: string, wordNote:any, event: Event){
  event.stopPropagation();
  try {
    const response = await this.wordbookService.noteCourse(this.userId, courseId,wordNote).toPromise();
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
  onClickAddCourse() {
    this.isVisible = true;
  }

  closeModal() {
    if (this.isVisible) {
      this.isVisible = false;
    }
  }

  saveDataCache(label: string, data: any) {
    localStorage.setItem(label, JSON.stringify(data));
  }
}
