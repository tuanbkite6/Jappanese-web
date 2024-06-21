import { Component, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent {
  personalInfoForm!: FormGroup;
  showBubble: boolean = false;
  userId: any ;
  constructor(
    private formBuilder: FormBuilder,
     private renderer: Renderer2,
     private http : CommunityManagementService,
     private authService: AuthService,
     private toast : NgToastService,
     private router : Router,
    ) {
      this.personalInfoForm = this.formBuilder.group({
        gender: ['', Validators.required],
        address: ['', Validators.required],
        email: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.getUserId().then();
    this.applySmileEffect();
    setTimeout(() => {
      this.renderer.addClass(document.querySelector('.bubble'), 'show');
      this.showBubble = true;
    }, 2000);
  }
  applySmileEffect(): void {
    const robotFace = document.querySelector(
      '.cute-robot-v1 .circle-bg .robot-face'
    );
    const robotEyes = document.querySelectorAll(
      '.cute-robot-v1 .circle-bg .eyes'
    );
    const robotMouth = document.querySelector(
      '.cute-robot-v1 .circle-bg .mouth'
    );

    if (robotFace && robotEyes && robotMouth) {
      robotFace.classList.add('robot-smile');
      robotEyes.forEach((eye: Element) => {
        eye.classList.add('robot-smile');
      });
      robotMouth.classList.add('robot-smile');

      setTimeout(() => {
        this.removeSmileEffect(robotFace, robotEyes, robotMouth);
      }, 2000); // 2 giây
    }
  }

  removeSmileEffect(
    robotFace: Element,
    robotEyes: NodeListOf<Element>,
    robotMouth: Element
  ): void {
    robotFace.classList.remove('robot-smile');
    robotEyes.forEach((eye: Element) => {
      eye.classList.remove('robot-smile');
    });
    robotMouth.classList.remove('robot-smile');
  }
  onSubmit() {
    // Xử lý khi form được submit
    console.log(this.personalInfoForm.value);
    if (this.personalInfoForm.valid) {
this.http.updateInfo(this.userId, this.personalInfoForm.value).subscribe(
  (response) => {
    this.router.navigate(['firstlogin/level']);
    this.toast.success({
      detail: 'Thành công',
      summary: 'Đã cập nhật thông tin',
      duration: 5000,
    });
  },
  (error) => {
    this.toast.error({
      detail: 'Lỗi',
      summary: 'Có vấn đề',
      duration: 5000,
    });
  }
)
  }else{
    this.toast.warning({
      detail: 'Warning',
      summary: 'Vui lòng điền đầy đủ thông tin',
      duration: 5000,
    });
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
}
