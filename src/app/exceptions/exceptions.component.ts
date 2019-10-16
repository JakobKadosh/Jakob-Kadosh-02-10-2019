import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/shared/services/api.service';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.scss']
})
export class ExceptionsComponent implements OnInit {
  errorMsg:string;
  
  constructor(private service:ApiService) { }

  ngOnInit() {
    this.errorMsg="Sorry. Error occurred on "+this.service.errorMsg;
  }

}
