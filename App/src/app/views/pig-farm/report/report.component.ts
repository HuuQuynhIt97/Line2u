
import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { ReportService } from 'src/app/_core/_service/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy  {
  subscription: Subscription = new Subscription();
  kind: string;
  reportType = 'Default';
  constructor(
    private service: ReportService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.kind = route.snapshot.paramMap.get('kind');
    if (this.kind) {
      this.getReportType();
    }
  }
  ngOnInit(): void {
    this.subscription.add(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).pipe(map(() => this.route)).subscribe((e) => {
      this.kind = e.snapshot.paramMap.get('kind');
      this.getReportType();
    }));
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  getReportType() {
    const menuLink = `/report/${this.kind}`;
    this.service.getReportType(menuLink).subscribe( (menu: any) => {
      this.reportType = menu.reportType;
    }, () => this.reportType = 'Default')
  }
}
