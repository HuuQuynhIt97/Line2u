import { Component, Input, OnInit } from '@angular/core';
import { BOM_TAB_Constant } from 'src/app/_core/_constants';
import { Bom } from 'src/app/_core/_model/bom';

@Component({
  selector: 'app-bom-right',
  templateUrl: './bom-right.component.html',
  styleUrls: ['./bom-right.component.css']
})
export class BomRightComponent implements OnInit {
  active: string;
  ngOnInit() {
    this.active = BOM_TAB_Constant.Move;
  }

  onActive(active) {
    this.active = active;
  }

}
