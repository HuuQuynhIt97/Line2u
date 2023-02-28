import { CullingComponent } from './../culling/culling.component';
import { Component, Input, OnInit } from '@angular/core';
import { RECORD_TAB_Constant } from 'src/app/_core/_constants';

@Component({
  selector: 'app-record-parent',
  templateUrl: './record-parent.component.html',
  styleUrls: ['./record-parent.component.css']
})
export class RecordParentComponent implements OnInit {
  active: string;
 @Input() pigType;
  constructor() { }

  ngOnInit() {
    this.active = RECORD_TAB_Constant.Detail;
  }

}
