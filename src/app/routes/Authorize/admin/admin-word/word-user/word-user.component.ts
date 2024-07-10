import { Component } from '@angular/core';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';

@Component({
  selector: 'app-word-user',
  templateUrl: './word-user.component.html',
  styleUrls: ['./word-user.component.css']
})
export class WordUserComponent {
  constructor(private http : WordbookManagementService){}
  listWord : any ;
  ngOnInit():void{
  this.fetchData()
  }
  fetchData(){
  this.http.getWordsByType(0).subscribe(res => {
    this.listWord = res
  })
  }
}
