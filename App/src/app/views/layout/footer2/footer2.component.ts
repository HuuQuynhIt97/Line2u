import { Component, OnInit } from '@angular/core';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
@Component({
  selector: 'app-footer2',
  templateUrl: './footer2.component.html',
  styleUrls: ['./footer2.component.scss']
})
export class Footer2Component implements OnInit {
  CASH_IMAGE = ImagePathConstants.CASH_PAY_IMAGE;
  LINE_PAY_IMAGE = ImagePathConstants.LINE_PAY_IMAGE;
  constructor() { }

  ngOnInit() {
  }

}
