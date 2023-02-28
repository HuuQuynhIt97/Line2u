import { Component, HostListener, OnInit } from '@angular/core';
let innerHeight = window.innerHeight - 92;

@Component({
  selector: 'app-report-config',
  templateUrl: './report-config.component.html',
  styleUrls: ['./report-config.component.scss']
})
export class ReportConfigComponent implements OnInit {
  systemMenuGuid: string;
  bottomDetailHeight = (innerHeight / 2) -40- 15;
  bottomHeight = (innerHeight / 2) - 117 - 15;
  topHeight = (innerHeight / 2) - 117 - 15;
  active: string;
  screenHeight = innerHeight;
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
  constructor() { }

  ngOnInit() {
  }
  onSystemMenuGuid(args) {
    this.systemMenuGuid =args;
  }
}
