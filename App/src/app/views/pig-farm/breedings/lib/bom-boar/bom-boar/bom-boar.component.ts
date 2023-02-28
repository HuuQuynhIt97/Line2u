import { Component, OnInit } from '@angular/core';
import { BomBoar } from '../../../config';

@Component({
  selector: 'app-bom-boar',
  templateUrl: './bom-boar.component.html',
  styleUrls: ['./bom-boar.component.css']
})
export class BomBoarComponent implements OnInit {
  bom: BomBoar;
  active: any;
  constructor() { }
  screenHeight = (+(window as any).innerHeight - 108) + 'px';

  ngOnInit() {
    this.bom = {} as BomBoar;
  }
  selectBomBoar(args) {
    this.bom = args;
  }
  onActive(e) {}
}
