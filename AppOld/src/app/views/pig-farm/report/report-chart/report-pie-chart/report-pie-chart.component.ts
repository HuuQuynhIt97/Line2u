import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewEncapsulation, ViewChildren } from '@angular/core';
import { AccumulationChartComponent, AccumulationChart, IAccLoadedEventArgs, AccumulationTheme } from '@syncfusion/ej2-angular-charts';
import { ReportService } from 'src/app/_core/_service/report.service';
import { EmptyPointMode } from '@syncfusion/ej2-charts';
import { ExcelExportCompleteArgs, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-report-pie-chart',
  templateUrl: './report-pie-chart.component.html',
  styleUrls: ['./report-pie-chart.component.scss']
})
export class ReportPieChartComponent implements OnInit, OnChanges {
  @Input() chartData: any[] = [];
  @Input() data: any[] = [];
  @Input() datasets: any[] = [];
  @Input() startDate: any = new Date();
  @Input() endDate: any = new Date();
  @Input() kind: any = new Date();
  @Input() maximum = 0;
  @Input() minimum = 80;
  @Input() interval = 20;
  @Input() target = 0;
  @Input() legendChecked: boolean;
  @Input() isOpen: boolean = false;
  @Input() visibleMasker = true;
  @Input() visibleTarget = false;

  @ViewChildren('pie')
  public pie: QueryList<AccumulationChartComponent | AccumulationChart>;

  public animation: Object = {
    enable: true
  };
  //Initializing Legend
  public legendSettings: Object = {
    visible: false,
  };
  //Initializing Datalabel
  public dataLabel: Object = {
    visible: true,
    position: 'Inside', name: 'text',
    font: {
      fontWeight: '600', color: '#ffffff'
    }
  };
  dataSource: any;
  xAxisName: any;
  yAxisName: any;
  chartUnit: any;
  // custom code start
  public load(args: IAccLoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Boostrap4';
    args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };
  // custom code end
  public center: Object = { x: '50%', y: '50%' };
  public startAngle: number = 0;
  public endAngle: number = 360;
  public explode: boolean = false;
  public enableAnimation: boolean = true;
  public tooltip: Object = { enable: true, format: '${point.x} : <b>${point.y}</b>' };
  public title: string = '';
  chartDataTemp = [
  ];
  dataTemp = [
  ];
  headerDataTemp = [];
  bodyDataTemp = [];
  headerData = [];
  bodyData = [];
  constructor(
    private service: ReportService,
    private datePipe: DatePipe
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.legendChecked?.currentValue != changes.legendChecked?.previousValue) {
      this.legendChecked = changes.legendChecked.currentValue;
      this.legendSettings = {
        visible: this.legendChecked,
        toggleVisibility: true,
        position: 'Right'
      };
    }
    if (changes.visibleMasker?.currentValue != changes.visibleMasker?.previousValue) {
      this.visibleMasker = changes.visibleMasker.currentValue;
      this.dataLabel = {
        visible: this.visibleMasker,
        position: 'Inside', name: 'text',
        font: {
          fontWeight: '600', color: '#ffffff'
        }
      };
    }
    if (changes.isOpen?.currentValue != changes.isOpen?.previousValue) {
      this.isOpen = changes.isOpen.currentValue;
    }

    if (changes.data?.currentValue != changes.data?.previousValue) {
      this.data = changes.data.currentValue;
      this.loadDataTable();
    }
    if (changes.chartData?.currentValue != changes.chartData?.previousValue) {
      this.chartData = changes.chartData.currentValue;
      this.loadDataTable();

    }

  }

  ngOnInit() {
    this.getReportChartSetting();
    this.chartDataTemp = [
      { type: 'Column', xName: 'x', yName: 'y', colorName: '#ffffff', legend: 'Default' }
    ];
    this.dataTemp = [
      [{ x: "m1", y: 0 }, { x: "m2", y: 0 }, { x: "m3", y: 0 }, { x: "m4", y: 0 }, { x: "m5", y: 0 }]
    ];
    this.loadTempDataTable();
  }
  loadTempDataTable() {
    this.headerDataTemp = [];
    this.bodyDataTemp = [];
    this.headerDataTemp = this.dataTemp[0].map(x => x.x);
    this.headerDataTemp.unshift("");
    for (let index = 0; index < this.chartDataTemp.length; index++) {
      let datasets = this.dataTemp[index].map(x => x.y) as any[];
      datasets.unshift(this.chartDataTemp[index].legend);
      this.bodyDataTemp.push(datasets);
    }
  }
  loadDataTable() {
    this.headerData = [];
    this.bodyData = [];
    this.headerData = this.data[0].map(x => x.x);
    this.headerData.unshift("");
    for (let index = 0; index < this.chartData.length; index++) {
      let datasets = this.data[index].map(x => x.y);
      datasets.unshift(this.chartData[index].legend);
      this.bodyData.push(datasets);
    }
  }
  getReportChartSetting() {
    const lang = localStorage.getItem('lang');
    const menuLink = `/report/${this.kind}`;
    this.service.getReportChartSetting(menuLink, lang).subscribe(data => {
      this.title = data.chartName;
      this.chartUnit = data.chartUnit || "";
      this.tooltip = { enable: true, format: '${point.x} : <b>${point.y}' + this.chartUnit + '</b>' };
      this.xAxisName = data.xAxisName;
      this.yAxisName = data.yAxisName;
      this.yAxisName = data.yAxisName;
    })
  }
  async excelExport() {
    const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    const imgList = [];
    let i = 0;
    for (const item of this.pie.toArray()) {
      imgList.push(await this.getchartImg(i));
      i++;
    }
    this.service.excelExportPieChart({
      printBy: accountName,
      functionName: functionName.trim(),
      imageBase64: imgList
    }).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data.body);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();
    }, () => { });
  }

  public getchartImg(i) {
    return new Promise(function (res, rej) {
      var imagedata;
      var svg = document.querySelector(`#container${i}_svg`);
      var svgData = new XMLSerializer().serializeToString(svg);
      var svgData = new XMLSerializer().serializeToString(svg);
      var canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
      var svgSize = svg.getBoundingClientRect();
      canvas.width = svgSize.width;
      canvas.height = svgSize.height;
      var ctx = canvas.getContext("2d");
      var img = document.createElement("img");
      img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData));
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        var imagedata = canvas.toDataURL("image/png");
        canvas.remove();
        res(imagedata.replace('data:image/png;base64,', ''))
      };
    })

  }

  pdfExport() {
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}`
    this.pie.get(0).exportModule.export('PDF', fileName, 0, [...this.pie.toArray()]);
  }
  print() {
    let i = 0;
    const array = [];
    for (const item of this.pie.toArray()) {
      const id = `container${i}`;
      array.push(id);
      i++;
    }
    this.pie.get(0).print(array);

  }

  async odsExport() {
    const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    const imgList = [];
    let i = 0;
    for (const item of this.pie.toArray()) {
      imgList.push(await this.getchartImg(i));
      i++;
    }
    this.service.excelExportPieChart({
      printBy: accountName,
      functionName: functionName.trim(),
      imageBase64: imgList
    }).subscribe((data: any) => {
      const model = {
        functionName: fileName,
        file: data.body
      }
      this.service.downloadODSFile(model).subscribe((res: any) => {
        this.service.downloadBlob(res.body, fileName + '.ods', 'application/vnd.oasis.opendocument.spreadsheet')
      })
    }, () => { });
  }

}

