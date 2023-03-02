import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Browser } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/_core/_service/dashboard.service';
export interface Dashboard {
  title: string;
  data: any;
}
@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
  providers: [DatePipe]
})
export class DashboardContainerComponent implements OnInit, OnDestroy {
  @Input() dashboardGuid = '';
  reportType = 'Default';
  dataSource = [];

  //Initializing Primary X Axis
  public primaryXAxis: Object = {
    valueType: 'Category', interval: 1, majorGridLines: { width: 0 }
  };
  //Initializing Primary Y Axis
  public primaryYAxis: Object = {
    majorGridLines: { width: 0 },
    majorTickLines: { width: 0 }, lineStyle: { width: 0 }, labelStyle: { color: 'transparent' }
  };
  public marker: Object = { dataLabel: { visible: true, position: 'Center', font: { fontWeight: '600', color: '#ffffff' } } }
  public title: string = '';
  public tooltip: Object = {
    enable: true
  };
  data2: any;
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    if (selectedTheme === 'highcontrast') {
      // args.chart.series[0].marker.dataLabel.font.color= '#000000';
      // args.chart.series[1].marker.dataLabel.font.color= '#000000';
      // args.chart.series[2].marker.dataLabel.font.color= '#000000';
    }
  };
  // custom code end
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = Browser.isDevice ? '100%' : '100%';

  public legendSettings: Object = {
    visible: false
  };
  yearMonth = new Date();
  subscriptions: Subscription[] =  [];

  selectedValue1: any;
  selectedValue2: any;
  onFiltering1(e) {
    if (e.text === '') {
      e.updateData(this.data);
    } else {
      const query = new Query().search(e.text, 'MenuName');
      e.updateData(this.data, query);
    }
  }
  onFiltering2(e) {
    if (e.text === '') {
      e.updateData(this.data2);
    } else {
      const query = new Query().search(e.text, 'MenuName');
      e.updateData(this.data2, query);
    }
  }
  data: any;
  constructor(
    private service: DashboardService, 
    private datePipe: DatePipe,
    private alertify: AlertifyService,
    private translate: TranslateService
    ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x=> x.unsubscribe())
  }
  ngOnInit() {
    this.dashboarConfig1();
    this.dashboarConfig2();

    this.reportType = 'Default';
    this.subscriptions.push(this.service.currentDashboard.subscribe( guid => {
      this.dashboardGuid = guid;
      if (this.dashboardGuid && typeof(guid) == 'string') {
        this.loadData();
      }
    }));
  }
  onChange(args) {
    if (args.isInteracted) {
      const yearMonth = this.datePipe.transform(args.value, "yyyy-MM-dd");
      this.filter(yearMonth);
    }
  }
  dashboarConfig1() {
    this.service.dashboarConfig1().subscribe(data => {
      this.data = data;
    });
  }
  dashboarConfig2() {
    this.service.dashboarConfig2().subscribe(data => {
      this.data2 = data;
    });
  }
  loadData() {
    let lang = localStorage.getItem('lang');
    this.reportType = 'Default';
    this.service.getDashboards(this.dashboardGuid, this.datePipe.transform(this.yearMonth, "yyyy-MM-dd"), lang).subscribe(data => {
      this.dataSource = data;
      if (this.dataSource.length === 0) {
        this.reportType = 'EmptyData';
      } else {
        this.reportType = 'Loaded';
      }
    }, () => {this.reportType = 'Default';});
  }
  back() {
    const yearMonth = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.filter(yearMonth);
  }
  filter(yearMonth) {
    this.reportType = 'Default';
    let lang = localStorage.getItem('lang');

    this.service.getDashboards(this.dashboardGuid, yearMonth, lang).subscribe(data => {
      this.dataSource = data;
      this.reportType = 'Loaded';
      if (this.dataSource.length === 0) {
        this.reportType = 'NoData';
      }
    }, () => {this.reportType = 'Default';});
  }
  onClickRow(item) {
    if (item.link) {
      window.open(item.link, '_blank');
    } else {
      this.alertify.warning(this.translate.instant("The link is invalid"))
    }
  }
}
