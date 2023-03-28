import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { lineConfig } from 'src/environments/environment';
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
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  ngOnInit() {
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
    console.log(this.sysConf)
  }
  back() {
    const uri = this.router.url;
    let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
    if(uri === isLogin_Cus_url) {
      this.router.navigate(['home']);
    }else {
      this.router.navigate([isLogin_Cus_url]);
    }
  }
  login() {
    const uri = decodeURI(this.route.snapshot.queryParams.uri)
    var uri_line = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineConfig.client_id}&redirect_uri=${lineConfig.redirect_uri}&state=NO_STATE&scope=profile%20openid%20email`
    window.location.assign(uri_line)
    // this.router.navigate([this.urlLineAuth])
  }
  templateData(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
