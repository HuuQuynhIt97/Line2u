import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-back-previous-page',
  templateUrl: './back-previous-page.component.html',
  styleUrls: ['./back-previous-page.component.css']
})
export class BackPreviousPageComponent implements OnInit {

  constructor(
    private _location: Location
  ) { }

  ngOnInit() {
  }
  Back() {
    this._location.back();
  }
}
