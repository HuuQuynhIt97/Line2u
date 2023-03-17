import { Component, OnInit } from '@angular/core';
import { SysMenuService } from 'src/app/_core/_service/sys-menu.service';

@Component({
  selector: 'app-mobile-footer',
  templateUrl: './mobile-footer.component.html',
  styleUrls: ['./mobile-footer.component.scss']
})
export class MobileFooterComponent implements OnInit {
  lang= this.capitalize(localStorage.getItem("lang"));
  menus: any;
  constructor(
    private sysMenu: SysMenuService,
  ) { }

  ngOnInit() {
    this.getMenuBottomMobile()
  }
  getMenuBottomMobile() {
    this.sysMenu.getMenuBottomMobile(this.lang,"MOBILE").subscribe(res => {
      console.log(res)
      this.menus = res
    })
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
