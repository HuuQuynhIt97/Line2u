import { Component, OnInit } from '@angular/core';
import { BomGilt } from '../../../config';

@Component({
  selector: 'app-bom-gilt',
  templateUrl: './bom-gilt.component.html',
  styleUrls: ['./bom-gilt.component.css']
})
export class BomGiltComponent implements OnInit {
  bom: BomGilt;
  active: any;
  constructor() { }
  screenHeight = (+(window as any).innerHeight - 108) + 'px';

  ngOnInit() {
    this.bom = {} as BomGilt;
  }
  selectBomGilt(args) {
    this.bom = args;
  }
  onActive(e) {}
}
