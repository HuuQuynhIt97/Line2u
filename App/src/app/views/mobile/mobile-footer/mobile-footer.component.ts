import { Component, OnInit } from '@angular/core';
import { SysMenuService } from 'src/app/_core/_service/sys-menu.service';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {
  lang= this.capitalize(localStorage.getItem("lang"));
  menus: any;
  CASH_IMAGE = ImagePathConstants.CASH_PAY_IMAGE;
  LINE_PAY_IMAGE = ImagePathConstants.LINE_PAY_IMAGE;
  constructor(
    private sysMenu: SysMenuService,
  ) { }

  ngOnInit() {
    this.getMenuBottomMobile()
  }
  getMenuBottomMobile() {
    this.sysMenu.getMenuBottomMobile(this.lang,"MOBILE").subscribe(res => {
      this.menus = res
    })
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
