import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lineUser-login',
  templateUrl: './lineUser-login.component.html',
  styleUrls: ['./lineUser-login.component.scss']
})
export class LineUserLoginComponent implements OnInit {
  public urlLineAuth = environment.redirectOfficialAccount;
  constructor() { }

  ngOnInit() {
  }

}
