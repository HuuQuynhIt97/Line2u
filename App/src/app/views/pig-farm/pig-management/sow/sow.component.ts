import { Component, OnInit } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { RECORD_TAB_Constant } from 'src/app/_core/_constants';
import { PigType } from 'src/app/_core/_constants/pig-type.constant';

@Component({
  selector: 'app-sow',
  templateUrl: './sow.component.html',
  styleUrls: ['./sow.component.scss']
})
export class SowComponent implements OnInit {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  active: string;
  pigType: string;
  makeOrderGuid: any;
  penGuid: any;

  constructor(
    config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }
  }

  ngOnInit() {
    this.active = RECORD_TAB_Constant.Detail;
    this.pigType = PigType.Sow;
  }
  onSelectMakeOrder(e) {
    this.makeOrderGuid = e?.guid;
    this.penGuid = e?.penGuid;
  }
}
