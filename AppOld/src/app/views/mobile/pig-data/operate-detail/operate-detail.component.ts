import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operate-detail',
  templateUrl: './operate-detail.component.html',
  styleUrls: ['./operate-detail.component.css']
})
export class OperateDetailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToHome() {
    this.router.navigate(['/mobile/home']);
  }
  goToOperateDetail()  {
    this.router.navigate(['/mobile/operate-detail']);
  }
  goToDetail() {}
  goToFeeding() {this.router.navigate(['/mobile/feeding']);}

}
