import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommunityManagementService } from 'src/app/services/community/community-management.service';
import { AuthService } from '../../Authorize/serviceAuthorize/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

interface Category {
  name: string;
  imageUrl: string;
  checked: boolean;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  showBubble: boolean = false;
  userCategory: Category[] = [
    { name: 'Ẩm thực', imageUrl: 'https://th.bing.com/th/id/OIP.qVnOkhF2Wq5XER6nWh2LogHaFp?w=235&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Đời sống', imageUrl: 'https://th.bing.com/th/id/OIP.-28i8A7520Fo79AveOim3AHaF7?w=244&h=195&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Bussiness', imageUrl: 'https://th.bing.com/th?q=Business+Person+Icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247', checked: false },
    { name: 'Giao thông', imageUrl: 'https://th.bing.com/th/id/OIP.Hh4bSp8DZ5KfNa7f7j0_VAHaHx?w=203&h=213&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Y tế', imageUrl: 'https://th.bing.com/th/id/OIP.AbcQw9WrJpPHGJGEkhXPTQHaHa?w=202&h=202&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Học tập', imageUrl: 'https://th.bing.com/th/id/OIP.pcB7jL_4dpIB3Lr_wq0fjgHaH7?w=168&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Thể thao', imageUrl: 'https://th.bing.com/th/id/OIP.EC5g8xXuqE21E_xDuzfV0gHaFL?w=249&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7', checked: false },
    { name: 'Gia đình', imageUrl: 'https://th.bing.com/th?q=Muslim+Family+Icon&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-WW&cc=VN&setlang=en&adlt=strict&t=1&mw=247', checked: false }
  ];

  userId: any;

  constructor(
    private http: CommunityManagementService,
    private renderer: Renderer2,
    private authService: AuthService,
    private toast: NgToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserId();
    this.applySmileEffect();
    setTimeout(() => {
      this.renderer.addClass(document.querySelector('.bubble'), 'show');
      this.showBubble = true;
    }, 1000);
  }
  applySmileEffect(): void {
    const robotFace = document.querySelector(".cute-robot-v1 .circle-bg .robot-face");
    const robotEyes = document.querySelectorAll(".cute-robot-v1 .circle-bg .eyes");
    const robotMouth = document.querySelector(".cute-robot-v1 .circle-bg .mouth");
    if (robotFace && robotEyes && robotMouth) {
      robotFace.classList.add("robot-smile");
      robotEyes.forEach((eye: Element) => {
        eye.classList.add("robot-smile");
      });
      robotMouth.classList.add("robot-smile");
    
      setTimeout(() => {
        this.removeSmileEffect(robotFace, robotEyes, robotMouth);
      }, 2000); // 2 giây
    }
  }

  removeSmileEffect(robotFace: Element, robotEyes: NodeListOf<Element>, robotMouth: Element): void {
  robotFace.classList.remove("robot-smile");
  robotEyes.forEach((eye: Element) => {
  eye.classList.remove("robot-smile");
  });
  robotMouth.classList.remove("robot-smile");
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

  toggleCheckbox(category: Category): void {
    category.checked = !category.checked;
  }

  updateCategories(): void {
    const selectedCategories = this.userCategory.filter(category => category.checked).map(category => category.name);
    
    // Assuming you have an API method in CommunityManagementService for updating categories
    this.http.updateCategories(this.userId, selectedCategories).subscribe(
      (response) => {
        this.router.navigate(['firstlogin']);
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
    );
  }
}
