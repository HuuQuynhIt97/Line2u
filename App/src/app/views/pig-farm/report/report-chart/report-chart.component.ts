import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from 'src/app/_core/_service/report.service';
import { DataManager, Query, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss']
})
export class ReportChartComponent implements OnInit {
  baseUrl = environment.apiUrl;
  roomGuid1: string = "";
  roomGuid2: string = "";
  makeOrderGuid1: string = "";
  makeOrderGuid2: string = "";
  roomGuid1Visibled: boolean;
  roomGuid2Visibled: boolean;
  makeOrderGuid1Visibled: boolean;
  makeOrderGuid2Visibled: boolean;
  fields: object = { text: 'headerText', value: 'field' };
  orderBy: string;
  thenBy: string;
  startDate: any = new Date();
  endDate: any = new Date();
  chartType = '';
  @Input() kind: string;
  legendChecked = false;
  maximum = 80;
  minimum = 0;
  interval = 20;
  isOpen = false;
  chartData: any;
  target = 0;
  visibleMasker = true;
  data: any;
  visibleTarget = false;
  fields2: object = { text: 'name', value: 'id' };
  chartTypeData= [
    {id: 'Bar', name: 'Bar'},
    {id: 'Pie', name: 'Pie'},
    {id: 'Lines', name: 'Lines'},
  ]
  constructor(
    private service: ReportService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) { }
  ngOnInit() {
  this.chartType = 'Bar';
  this.loadConfig();
  }
  loadConfig() {
    const menuLink = `/report/${this.kind}`;
    let query = new Query();
    query.where("type", "equal", menuLink);
    const accessToken = localStorage.getItem("token");
    new DataManager(
      {
        url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      }).executeQuery(query).then((x: any)=> {
        const configData = x.result || [];
        for (const x of configData) {
          switch (x.no) {
            case "MakeOrderGuid1":
              setTimeout(() => this.makeOrderGuid1Visibled = x.value === "1" ? true : false)
              break;
            case "MakeOrderGuid2":
              setTimeout(() => this.makeOrderGuid2Visibled = x.value === "1" ? true : false)
              break;
            case "RoomGuid1":
              setTimeout(() => this.roomGuid1Visibled = x.value === "1" ? true : false)
              break;
            case "RoomGuid2":
              setTimeout(() => this.roomGuid2Visibled = x.value === "1" ? true : false)
              break;
          }
        }

      });
  }
  loadData() {
    const d1 = this.datePipe.transform(this.startDate, 'yyyy/MM/dd');
    const d2 = this.datePipe.transform(this.endDate, 'yyyy/MM/dd');
    const lang = localStorage.getItem('lang');
    const menuLink = `/report/${this.kind}`;
    this.spinner.show('default')
    this.service.getReportChart(d1, d2, menuLink, lang).subscribe(res => {
      this.data = res.data;
      this.chartData = res.chartData;
      this.isOpen = true;
      this.spinner.hide('default')
    }, () => this.spinner.hide('default'))
  }
  filter() {
    this.loadData();
  }

}
