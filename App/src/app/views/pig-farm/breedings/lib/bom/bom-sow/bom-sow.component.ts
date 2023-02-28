import { Component, OnInit } from '@angular/core';
import { BomSow } from '../../../config';

@Component({
  selector: 'app-bom-sow',
  templateUrl: './bom-sow.component.html',
  styleUrls: ['./bom-sow.component.css']
})
export class BomSowComponent implements OnInit {
  bom: BomSow;
  active: any;
  constructor() { }
  screenHeight = (+(window as any).innerHeight - 108) + 'px';

  ngOnInit() {
    this.bom = {} as BomSow;
  }
  selectBomSow(args) {
    this.bom = args;
  }
  onActive(e) {}
}
