import { Subscription } from 'rxjs';
import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BIO_SECURITY_TAB_Constant } from 'src/app/_core/_constants';

let height = window.innerHeight - 92;
@Component({
  selector: 'app-bio-security',
  templateUrl: './bio-security.component.html',
  styleUrls: ['./bio-security.component.scss']
})
export class BioSecurityComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription: Subscription = new Subscription();
  pigType: any;
  bottomDetailHeight = (height / 2) -40- 15;
  bottomHeight = (height / 2) - 117 - 15;
  topHeight = (height / 2) - 117 - 15;
  active: string;
  screenHeight = height;
  leftHeight = this.screenHeight / 2 + 'px';
  rightHeight = this.screenHeight / 2+ 'px';
  @HostListener('window:resize', ['$event'])
onResize(event) {
  const h = event.target.innerHeight - 92;
  this.leftHeight = h / 2 + 'px';
  this.rightHeight = h / 2+ 'px';
  this.bottomHeight = (h / 2) - 117 - 15;
  this.topHeight = (h / 2) - 117 - 15;
  this.bottomDetailHeight = (h / 2) - 40 -15
}
  constructor(
     private  route:ActivatedRoute
  ) {

   }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.subscription.add(this.route.data.subscribe(x=> {
      this.pigType = x.pigType;
      this.active = BIO_SECURITY_TAB_Constant.Record;
    }));
  }
}
