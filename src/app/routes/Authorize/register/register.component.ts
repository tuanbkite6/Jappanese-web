import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../serviceAuthorize/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signUpForm!: FormGroup ;
  inputFields = ['userName', 'userPassword', 'userConfirmPassword'];
  constructor( private fb : FormBuilder,private toast : NgToastService,private router : Router,private auth : AuthService) { }
  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      userName : ['',Validators.required],
      userPassword : ['',Validators.required],
      userConfirmPassword : ['',Validators.required]
    });
    }
    ngOnChanges(changes: SimpleChanges):void{
      console.log("change")
    }
    change(tagId: string){
     const input = document.getElementById(tagId);
     if(input){
      input.classList.remove('show')
     }
    }
    // change(errorId: string) {
    //   console.log(1)
    //   const errorElement = document.getElementById(errorId);
    //   if (errorElement) {
    //     errorElement.classList.remove('show');
    //   }
    // }
    checkPassword() {
      if (this.signUpForm.value.userPassword !== this.signUpForm.value.userConfirmPassword) {
        // this.signUpForm.controls['userPasswordConfirm'].setErrors({ confirm: true });
        this.toast.error({detail: "Thất bại",summary: "Nhập lại xác nhận mật khẩu", duration: 5000});
        return false;
      } else {
        return true;
      }
      
    }
    onSignUp() {
      if (this.signUpForm.valid && this.checkPassword()) {
        this.auth.signUp(this.signUpForm.value)
          .subscribe({
            next: (res: any) => {
              this.signUpForm.reset();
              this.auth.storeToken(res.token)
              this.toast.success({detail: "Thành công", summary: "Đăng ký thành công", duration: 5000});
              this.router.navigate(['../firstlogin/info']);
            },
            error: (err: any) => {
              this.toast.error({detail: "Thất bại", summary: "Tài khoản đã tồn tại.", duration: 5000});
            }
          });
      } else {
        this.inputFields.forEach(field => {
          if (!this.signUpForm.get(field)?.value) {
            document.getElementById(`${field}-error`)?.classList.add('show');
          } else {
              document.getElementById(`${field}-error`)?.classList.remove('show');
          }
        });
      }
    }
    
   
 }
