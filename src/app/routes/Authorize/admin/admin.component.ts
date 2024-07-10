import { Component, OnInit } from '@angular/core';
import { WordbookManagementService } from 'src/app/services/wordbook-management/wordbook-management.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  listWord : any ;
ngOnInit(): void {
}
constructor(private hrrp : WordbookManagementService){}

}
