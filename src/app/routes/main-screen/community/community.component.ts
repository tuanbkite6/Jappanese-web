import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { NzMessageComponent, NzMessageService } from 'ng-zorro-antd/message';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { WordManagementService } from 'src/app/services/word-management/word-management.service';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { ActivatedRoute } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { AnyAsyncThunk } from '@reduxjs/toolkit/dist/matchers';
interface courseCommunity {
  avatar: string;
  authorName: string;
  titleName: string;
  content: string;
  totalWorld: number;
  headerContent?: string;
  rating: any;
  comment?: string;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  userIdFromToken: any;
  @ViewChild('comment') inputComment: any;
  selectCourse: any;
  postForm : FormGroup;
  isIcon = true;
  showModal = false;
  selectedCommentId :any;
  courseId: string | null = null;
  isCourseInfo = false;
  commentData: any;
  userInfo: any;
  userId: any;
  file: File | undefined;
  selectedFile: File | null = null;
  imageMin: File | null = null;
  isListWord: any = false;
  searchInput: any;
  listReply: any;
  hasReply: any;
  async ngOnInit(): Promise<void> {
    await this.getUserId();
    if (this.userId) {
      this.getUser(this.userId);
      this.fetchData();
    this.getAllCourseById();
    }
    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id');
      console.log('Course ID from URL:', this.courseId); // Debugging log
      if (this.courseId) {
        this.hasExpand = false;
        this.isCourseInfo = true;
        this.isIcon = false;
        this.wordbookService
          .getCourseInfo(this.courseId, this.userId)
          .subscribe((course) => {
            this.selectCourse = course;
            console.log('course selected', course);
          });
      }
    });
    
  }
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private toast: NgToastService,
    private HTTP: HttpClient,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private http: CommunityManagementService,
    private wordbookService: WordbookManagementService,
    private course: WordbookManagementService
  ) {
    this.postForm = new FormGroup({
      postImage: new FormControl(''),
      postContent: new FormControl('', Validators.required), 
      courseId: new FormControl('', Validators.required)
    });
  }
  listWord: any;
  replyComment : any ;
  inputReply :any ;
  imagePost: any ;
  isRating: any;
  likeComment: any;
  isUpload = true;
  isHintPost: any;
  hasExpand = true;
  isVisible = false;
  hasComment: any;
  selectPostId : any ;
  private badWord: string[] = [
    'dm',
    'duma',
    'cc',
    'vl',
    'suc vat',
    'vch',
    'cl',
    'lol',
    'wtf',
    'concho',
    'concho',
    'vc',
    'cut',
    'loz',
    'dien',
    'khung',
    'che',
    'dam',
    'chan',
    'bu',
    'buda',
    'ngao',
    'ngu',
    'dan',
    'dot',
    'do',
    'sua',
    'may',
    'tao',
    'sucsinh',
    'm',
    'dmm',
    'concak',
    'concac',
    'giet',
    'dam',
    'danhnhau',
    'xienchet',
    'memay',
    'concumay',
  ];
  Content: any;
  Image: any;
  CourseID: any;
  courseImport: any;
  data: any;
  star: any ; 
  rating: any;
  commentForm = new FormGroup({
    comment: new FormControl(''),
  });
  replyForm = new FormGroup({
    replyText: new FormControl(''),
  })
  listPost: any;
  handleOpenRating(idPost: any): any {
    this.isRating = this.isRating === idPost ? null : idPost;
  }
  listCourse: any;
  openModal(): any {
    this.isVisible = true;
   this.wordbookService.getAllCourseByUserId(this.userId).subscribe((data) => {
    this.listCourse= data;
   })
  }
  openModalCourse(idCourse: any): any {
    this.isListWord = true;
    console.log(idCourse);
    this.course.getWordById(idCourse).subscribe((res) => {
      this.listWord = res;
    });
  }
  closeModalCourse(): any {
    this.isListWord = false;
  }
  checkComment(comment: any, words: string[]): boolean {
    return words.some((word) => comment.includes(word));
  }
  onSubmit(postId: any) {
    let handleword = this.inputComment.nativeElement.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
    console.log(handleword);
    if (!this.checkComment(handleword, this.badWord)) {
      this.inputComment.nativeElement.value = '';
      this.http
        .sendComment(this.userId, postId, this.commentForm.value)
        .subscribe({
          next: (res: any) => {
            this.commentForm.reset();
            this.message.info('Đã gửi bình luận');
            this.fetchComment(postId);
            this.fetchData()

            
          },
          error: (err: any) => {
            this.hasComment = null;
            this.toast.warning({
              detail: 'warning',
              summary: 'Bình luận bài viết không thành công',
              duration: 5000,
            });
          },
        });
    } else {
      this.message.warning('Bài viết chứa chứa từ ngữ phản cảm');
    }
  }
  openModalCommentSetting(commentId: number) {
    this.selectedCommentId = this.selectedCommentId === commentId ? null : commentId;
    this.showModal = true;
  }

  closeModalCommentSetting() {
    this.showModal = false;
    this.selectedCommentId = null;
  }
  updateComment(commentId: string, updatedText: string, postId: any) {
    this.http.editComment(commentId, updatedText).subscribe(
      response => {
        console.log('Comment updated successfully', response);
        this.fetchComment(postId)
      },
      error => {
        console.error('Error updating comment', error);
      }
    );
  }
  deleteComment(commentId: string,postId:any) {
    this.http.deleteComment(commentId).subscribe(
      response => {
        console.log('Comment deleted successfully', response);
      },
      error => {
        this.fetchComment(postId)
        console.error('Error deleting comment', error);
      }
    );
  }
  showReplyInput(id : any){
    this.inputComment = this.inputComment === id ? null : id;
  }
 
  transform(value: string): string {
    const postedAt = new Date(value);
    const now = new Date();
    const timeDifference = now.getTime() - postedAt.getTime();

    // Chuyển đổi milliseconds thành giây
    const seconds = Math.floor(timeDifference / 1000);

    // Tính toán số ngày, giờ và phút
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return `${minutes} phút trước`;
    }
  }
  getReplies(commentId : any) {
    this.hasReply = this.hasReply === commentId ? null : commentId;
    this.http.getReplies(commentId).subscribe((res) => {
      // this.listReply = res;
      this.listReply = res.map((comment:any) => ({
        ...comment,
        timeAgo: this.calculateTimeAgo(comment.postedAt)
      }));
    });
  }
  submitReply(commentId: any) {
    console.log(this.replyForm.value)
    
      
      // Handle submitting the reply
      this.http.addReply(this.userId,commentId, this.replyForm.value).subscribe(response => {
        console.log('Reply submitted successfully', response);
        this.showReplyInput(commentId)
        this.getReplies(commentId)
        // Optionally reset the reply input
        // this.replyForm.value = '';
        // comment.replyText = '';
      }, error => {
        console.error('Error submitting reply', error);
      });
    
    }
  // inputImage(e: any): any {
  //   this.isUpload = false;
  //   console.log(this.isUpload);
  //   if (e.target.files) {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(e.target.files[0]);
  //     reader.onload = (event: any) => {
  //       this.Image = event.target.result;
  //       // this.postForm.patchValue({
  //       //   image: event.target.result
  //       // })
  //     };
  //     // this.postForm.get('image').updateValueAndValidity();
  //   }
  // }

  calculateTimeAgo(postedAt: string): string {
    const postedDate = new Date(postedAt); // Convert the postedAt string to a Date object
    const now = new Date(); // Get the current date

    const timeDifference = now.getTime() - postedDate.getTime(); // Calculate the time difference in milliseconds
    const seconds = Math.floor(timeDifference / 1000); // Convert milliseconds to seconds

    // Calculate days, hours, and minutes
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Determine the appropriate time ago format
    if (days > 0) {
      return `${days} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return `${minutes} phút trước`;
    }
  }
  inputImage(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      this.isUpload = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePost = e.target.result;
        this.postForm.patchValue({ postImageFile: this.file }); // Update FormGroup with selected file
      };
      reader.readAsDataURL(this.file);
      console.log(this.file)
    }
  }
  closeModal(): any {
    if (this.isVisible) {
      this.isVisible = false;
    }
  }
  //Rating bài viết của người dùng
  async countStart(postId:any,courseId: any) {
    this.isRating = null;
    try {
      await this.http.handelRating(postId,courseId, this.star).toPromise();
    } catch (error) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Không thể đánh giá bài viết',
        duration: 2000,
      });
    }
    this.fetchData();
  }

  async onClickSend() {
    if (this.postForm.invalid) {
      this.toast.error({
        detail: 'Error',
        summary: 'Hãy nhập hết vào ô input để đăng bài',
        duration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append('postContent', this.postForm.get('postContent')!.value);
    formData.append('courseId', this.postForm.get('courseId')!.value);
  if (this.file) {
    formData.append('postImageFile', this.file);
  }
console.log('form',formData)
    try {
      await this.http
      .handelSharePost(this.userId, formData).toPromise();
      this.resetForm();
      this.fetchData();
      this.toast.success({
        detail: 'Thành công',
        summary: 'Đã đăng bài ',
        duration: 2000,
      });
    } catch (error) {
      this.toast.error({
        detail: 'Lỗi',
        summary: 'Lỗi hệ thống',
        duration: 2000,
      });
    }

  }
  searchHandle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value;
    // this.router.navigate(['home/search/all-search']);
  }
  searchClick(){
    this.http.searchPosts(this.searchInput).subscribe(
      data => {
        this.listPost = data;
      },
      error => {
        console.error('Error searching posts:', error);
      }
    );
  }
  resetForm() {
    this.postForm.reset();
    this.Image = '';
    this.selectCourse = '';
    this.Content = '';
    this.CourseID = '';
    this.isUpload = true;
    this.isIcon = true;
    this.hasExpand = true;
    this.isCourseInfo = false;
  }
  onClickClose(): void {
    this.hasExpand = true;
    this.isIcon = true;
    this.isCourseInfo = false;
    this.resetForm();
  }
  onClickHandleExpand(): void {
    this.hasExpand = false;
  }
  onClickHandleCommentExpand(idPost: any): void {
    this.hasComment = this.hasComment === idPost ? null : idPost;
    this.selectPostId = idPost;
    this.http.getAllComment(idPost).subscribe({
      next: (res: any) => {
        this.commentData = res.map((comment:any) => ({
          ...comment,
          timeAgo: this.calculateTimeAgo(comment.postedAt)
        }));
      },
      error: (err: any) => {
        this.hasComment = null;

        this.toast.info({
          detail: 'Info',
          summary: 'Bài viết này không có bình luận nào',
          duration: 2000,
        });
      },
    });
  }
  fetchComment(idPost : any){
    this.http.getAllComment(idPost).subscribe({
      next: (res: any) => {
        this.commentData = res.map((comment:any) => ({
          ...comment,
          timeAgo: this.calculateTimeAgo(comment.postedAt)
        }));
      },
      error: (err: any) => {
        this.hasComment = null;

        this.toast.info({
          detail: 'Info',
          summary: 'Bài viết này không có bình luận nào',
          duration: 2000,
        });
      },
    });
  }
  onClickHandleHint(idPost: any): void {
    if (confirm('Bạn có muốn ẩn bài viết ')) {
      this.isHintPost = this.isHintPost === idPost ? null : idPost;
      this.message.info('Bài đăng đã bị ẩn');
    } else {
      this.message.info('Bài đăng vẫn tồn tại trong tường');
    }
  }
  likeCommentHandle(commentId: string): void {
    const isLiked = this.likeComment === commentId;
    this.likeComment = isLiked ? null : commentId;

    this.http.updateLikeCount(commentId, isLiked).subscribe(
      () => {
        const comment = this.commentData.find((c: any) => c.commentId === commentId);
        if (comment) {
          if (isLiked) {
            comment.likeCount -= 1; // Giảm likeCount nếu đã like và toggle thành unlike
          } else {
            comment.likeCount += 1; // Tăng likeCount nếu chưa like và toggle thành like
          }
          console.log(comment); // Đảm bảo là comment đã được cập nhật đúng
          this.fetchComment(this.selectPostId); // Gọi lại API để cập nhật danh sách comment sau khi like/unlike
        }
      },
      error => {
        console.error('Error updating like count:', error);
        // Xử lý lỗi nếu cần thiết
      }
    );
}


  getAllCourseByUserId(): any {}
  async fetchData() {
    var response = await this.http.getAllPost().subscribe((res: any) => {
      this.listPost = res;
    });
    console.log(this.listPost);
  }
  getTopRatedPosts(): void {
    this.http.filterTopRatedPosts().subscribe(
      data => {
        this.listPost = data;
      },
      error => {
        console.error('Error fetching top-rated posts:', error);
      }
    );
  }
  getMostCommentedPosts(): void {
    this.http.filterMostCommentedPosts().subscribe(
      data => {
        this.listPost = data;
      },
      error => {
        console.error('Error fetching most commented posts:', error);
      }
    );
  }
  getMostImportedPosts(): void {
    this.http.getMostImportedPosts().subscribe(
      data => {
        this.listPost = data;
      },
      error => {
        console.error('Error fetching most imported posts', error);
      }
    );
  }
  
  getAllCourseById(): any {
    this.course.getAllCourseByUserId(this.userId).subscribe((res) => {
      this.listCourse = res;
    });
  }
  async onClickCourse(courseId: any) {
    this.closeModal();
    // this.courseId.setValue() = courseId ;
    this.wordbookService
      .getCourseInfo(courseId, this.userId)
      .subscribe((res) => {
        this.selectCourse = res;
        console.log(this.selectCourse);
      });
    this.isIcon = false;
    this.isCourseInfo = true;
    this.postForm.controls['courseId'].setValue(courseId);
  }
  editComment(commentId: any) {}

  importToMyCourse(idCourse: any) {
    this.courseImport = idCourse;
    this.http.importCourse(this.userId, idCourse).subscribe({
      next: (res: any) => {
        console.log(res.message);
        this.toast.success({
          detail: 'Thành công',
          summary: 'Thêm khóa học thành công',
          duration: 1000,
        });
      },
      error: (err: any) => {
        console.log(err.message);
        this.toast.error({
          detail: 'Lỗi',
          summary: 'Bạn đã có học liệu này rồi',
          duration: 2000,
        });
      },
    });
  }
  async getUser(id: string) {
    try {
      const res = await this.HTTP.get(
        'http://localhost:43268/api/users/' + id
      ).toPromise();
      this.userInfo = res;
      console.log('User Info:', this.userInfo);
      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }
  async getUserId() {
    try {
      const userId = await this.auth.getUserIdFromToken();
      if (!userId) {
        console.error('User ID not found');
      } else {
        this.userId = userId;
      }
    } catch (error) {
      console.error('Error getting User ID', error);
    }
  }
  activateFormWithCourse(courseId: string): void {
    this.wordbookService
      .getCourseInfo(courseId, this.userId)
      .subscribe((course) => {
        this.selectCourse = course;
        console.log('course selected', course);
      });
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.termImageUrl[index] = e.target.result;
        // this.terms.at(index).patchValue({ imageUrl: this.file });
      };
      reader.readAsDataURL(this.file);
    }
    console.log(this.file);
  }
  cancelImage() {
    this.Image = '';
    this.isUpload = true;
    this.postForm.patchValue({ postImage: '' });
  }
}

function formatDistance(arg0: Date, arg1: Date) {
  throw new Error('Function not implemented.');
}
