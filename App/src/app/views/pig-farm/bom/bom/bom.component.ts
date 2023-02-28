import { Component, OnInit } from '@angular/core';
import { Bom } from 'src/app/_core/_model/bom';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.css']
})
export class BomComponent implements OnInit {
  bom: Bom;
  constructor() { }
  screenHeight = (+(window as any).innerHeight - 108) + 'px';

  ngOnInit() {
    this.bom = {} as Bom;
  }
  selectBOM(args) {
    this.bom = args;
  }
}
