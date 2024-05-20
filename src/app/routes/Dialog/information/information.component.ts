import { Component, Renderer2 } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent {
  personalInfoForm!: FormGroup;
  showBubble: boolean = false;
  constructor(private formBuilder: FormBuilder,private renderer: Renderer2) { }

  ngOnInit(): void {
    this.personalInfoForm = this.formBuilder.group({
      gender: ['',Validators.required],
      address: ['',Validators.required],
      email: ['',Validators.required]
    });
    this.applySmileEffect();
    setTimeout(() => {
      this.renderer.addClass(document.querySelector('.bubble'), 'show');
      this.showBubble = true;
    }, 2000);
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
  onSubmit() {
    // Xử lý khi form được submit
    console.log(this.personalInfoForm.value);
  }
}
