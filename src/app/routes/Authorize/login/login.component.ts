import { Component, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from '../serviceAuthorize/auth.service';
import { UserStoreService } from '../serviceAuthorize/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  inputFields = ['userName', 'userPassword', 'userConfirmPassword'];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private userStore: UserStoreService,
    private toast: NgToastService
  ) {}
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  type: string = 'password';
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      userPassword: ['', Validators.required],
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
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  onLogin() {
    if (this.loginForm.valid) {
      //Send the obj to db
      this.auth.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          console.log(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          let tokenPayload = this.auth.decodeToken();
          console.log(tokenPayload)
          this.userStore.setFullNameForStore(tokenPayload.sub);
          this.userStore.setRoleforStore(tokenPayload.typ);
          this.auth.storeToken(res.token); //luu token vao localstorage
          this.toast.success({
            detail: 'Success',
            summary: 'Login success',
            duration: 5000,
          });
          this.router.navigate(['../home/dashboard']); // chinh sau
        },
        error: (err: any) => {
          this.toast.warning({
            detail: 'Warning',
            summary: 'Some error have occured, possibly the password or name is incorrect',
            duration: 5000,
          });
          console.log(err);
        },
      });
    } else {
      this.inputFields.forEach(field => {
        if (!this.loginForm.get(field)?.value) {
          document.getElementById(`${field}-error`)?.classList.add('show');
        } else {
            document.getElementById(`${field}-error`)?.classList.remove('show');
        }
      });
    }
  }
  private validateAllFormFileds(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFileds(control);
      }
    });
  }
}
