import { Component } from '@angular/core';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.css']
})
export class FirstLoginComponent {
isVisible = false;  
onclick = (event: any) => {
 return this.isVisible = true;
}
}