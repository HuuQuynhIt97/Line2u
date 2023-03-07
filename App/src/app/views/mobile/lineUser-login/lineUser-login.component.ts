import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lineUser-login',
  templateUrl: './lineUser-login.component.html',
  styleUrls: ['./lineUser-login.component.scss']
})
export class LineUserLoginComponent implements OnInit {
  public urlLineAuth = environment.redirectOfficialAccount;
  sysConf: any;
  constructor(
    private sanitizer: DomSanitizer,
  ) { }
  
  ngOnInit() {
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
    console.log(this.sysConf)
  }

  templateData(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
