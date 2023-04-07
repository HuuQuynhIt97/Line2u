import { Component, OnInit } from '@angular/core';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
@Component({
  selector: 'app-footer1',
  templateUrl: './footer1.component.html',
  styleUrls: ['./footer1.component.css']
})
export class Footer1Component implements OnInit {
  CASH_IMAGE = ImagePathConstants.CASH_PAY_IMAGE;
  LINE_PAY_IMAGE = ImagePathConstants.LINE_PAY_IMAGE;
  constructor() { }

  ngOnInit() {
  }

}
