import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent, ChartTheme, Chart, DataLabelSettingsModel, ILegendRenderEventArgs, ILoadedEventArgs, IPointRenderEventArgs, ChartModule } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { ReportService } from 'src/app/_core/_service/report.service';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-report-bar-chart',
  templateUrl: './report-bar-chart.component.html',
  styleUrls: ['./report-bar-chart.component.scss']
})
export class ReportBarChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') public chart: ChartComponent | Chart;
  @ViewChild('grid') public grid: GridComponent;
  @Input() chartData: any[] = [];
  @Input() data: any[]= [];
  @Input() datasets: any[]= [];
  @Input() startDate: any = new Date();
  @Input() endDate: any = new Date();
  @Input() kind: any = new Date();
  @Input() maximum = 0;
  @Input() minimum = 80;
  @Input() interval = 20;
  @Input() target = 0;
  @Input() legendChecked: boolean;
  @Input() isOpen: boolean;
  @Input() visibleMasker = true;
  @Input() visibleTarget = false;
  public radius: Object = { bottomLeft: 5, bottomRight: 5, topLeft: 5, topRight: 5 }
  palette = ["#00A300", "#00A300", "#00A300", "#00A300", "#00A300", "#E94649", "#E94649", "#00A300"];
  auto: any = false;
  //Initializing Primary X Axis
  public primaryXAxis: Object = {
    valueType: 'Category',
    title: '',
    majorGridLines: { width: 0 },
    minorGridLines: { width: 0 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
    };
  //Initializing Primary Y Axis
  public primaryYAxis: Object = {
    majorGridLines: { width: 1 },
    minimum: 0,
    maximum: 80,
    interval: 20,
    title: '',
    minorGridLines: { width: 1 },
    majorTickLines: { width: 0 },
    minorTickLines: { width: 0 }
  };
  public legendSettings: Object = {
    visible: false,
    toggleVisibility: true,
    position: 'Right'
  };
  enableAnimation = true;
  public marker: Object = {
    dataLabel: {
      visible: true, position: 'Outer',
      border: { width: 2, color: '#fd7e14' }, showZero: true, opacity: 0.8,
      font: { fontSize: '20px', fontWeight: '600', color: '#fd7e14' },
    } as DataLabelSettingsModel
  }

  public title: string = '';
  intervalGlobal: any;
  public tooltip: Object = {
    enable: true
  };
  yAxisName: any;
  xAxisName: any;
  dataSource: any[];
  printBy: any;
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Bootstrap4';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    //args.chart.series[0].marker.dataLabel.font.color= '#008000';
  };
  // custom code end
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = Browser.isDevice ? '100%' : '100%';

  public pointRender(args: IPointRenderEventArgs): void {
    args.fill = this.palette[args.point.index];

  };
  count = 0;
  public legendRender(args: ILegendRenderEventArgs): void {
    var data = this.datasets[this.count];
    args.text = args.text + " : " + data.gold;
    this.count++;
  }
  chartDataTemp = [
    { type: 'Column', xName: 'x', yName: 'y', colorName: '#f8120eff', legend: 'Default' }
  ];
  dataTemp = [
    [{ x: "m1", y: 0 }, { x: "m2", y: 0 }, { x: "m3", y: 0 }, { x: "m4", y: 0 }, { x: "m5", y: 0 }]
  ];
  headerDataTemp = [];
  bodyDataTemp = [];
  headerData = [];
  bodyData = [];

  constructor(
    private service: ReportService,
    private datePipe: DatePipe,
    private translate: TranslateService,
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
      this.marker = {
        dataLabel: {
          visible: this.visibleMasker, position: 'Outer',
          border: { width: 2, color: '#fd7e14' }, showZero: true, opacity: 0.8,
          font: { fontSize: '20px', fontWeight: '600', color: '#fd7e14' },
        } as DataLabelSettingsModel
      }
    }
    if (changes.visibleTarget?.currentValue != changes.visibleTarget?.previousValue) {
      this.visibleTarget = changes.visibleTarget.currentValue;
      this.loadTargetData();
    }
    if (changes.isOpen?.currentValue != changes.isOpen?.previousValue) {
      this.isOpen = changes.isOpen.currentValue;
    }
    if (changes.target?.currentValue != changes.target?.previousValue) {
      this.target = changes.target.currentValue;
      this.loadTargetData();
    }
    if (changes.data?.currentValue != changes.data?.previousValue) {
      this.data = changes.data.currentValue;
      this.loadTargetData();
      this.loadDataTable();

    }
    if (changes.chartData?.currentValue != changes.chartData?.previousValue) {
      this.chartData = changes.chartData.currentValue;
      this.loadDataTable();
    }
    if (changes.maximum?.currentValue != changes.maximum?.previousValue) {
      this.maximum = changes.maximum.currentValue;
      this.primaryYAxis = {
        majorGridLines: { width: 1 },
        minimum: this.minimum,
        maximum: this.maximum,
        interval: this.interval,
        title: this.yAxisName,
        minorGridLines: { width: 1 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
      };
    }

    if (changes.minimum?.currentValue != changes.minimum?.previousValue) {
      this.minimum = changes.minimum.currentValue;
      this.primaryYAxis = {
        majorGridLines: { width: 1 },
        minimum: this.minimum,
        maximum: this.maximum,
        interval: this.interval,
        title: this.yAxisName,
        minorGridLines: { width: 1 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
      };
    }
    if (changes.interval?.currentValue != changes.interval?.previousValue) {
      this.interval = changes.interval.currentValue;
      this.primaryYAxis = {
        majorGridLines: { width: 1 },
        minimum: this.minimum,
        maximum: this.maximum,
        interval: this.interval,
        title: this.yAxisName,
        minorGridLines: { width: 1 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
      };
    }
  }

  ngOnInit() {
    this.loadTempDataTable();
    this.getReportChartSetting();
    this.loadLang()
  }
  loadLang() {
     this.translate.get('Print by').subscribe(printBy => {
      this.printBy = printBy;
    });
  }
    loadTargetData() {
    if (this.visibleTarget) {
      if (this.data[0]) {
        this.dataSource = this.data[0].map( a => {
          return {
            x: a.x,
            y: this.target
          };
        });
      }
    }
  }
  loadTempDataTable() {
    this.headerDataTemp = [];
    this.bodyDataTemp = [];
    this.headerDataTemp = this.dataTemp[0].map(x=> x.x);
    this.headerDataTemp.unshift("");
    for (let index = 0; index < this.chartDataTemp.length; index++) {
        let datasets = this.dataTemp[index].map(x=> x.y) as any[];
        datasets.unshift(this.chartDataTemp[index].legend);
        this.bodyDataTemp.push(datasets);
    }
  }
  loadDataTable() {
    this.headerData = [];
    this.bodyData = [];
    this.headerData = this.data[0].map(x=> x.x);
    this.headerData.unshift("");
    for (let index = 0; index < this.chartData.length; index++) {
        let datasets = this.data[index].map(x=> x.y);
        datasets.unshift(this.chartData[index].legend);
        this.bodyData.push(datasets);
    }
  }
  getReportChartSetting() {
    const lang = localStorage.getItem('lang');
    const menuLink = `/report/${this.kind}`;
    this.service.getReportChartSetting(menuLink, lang).subscribe(data => {
      this.title = data.chartName;
      this.xAxisName = data.xAxisName;
      this.yAxisName = data.yAxisName;
      this.primaryXAxis = {
        valueType: 'Category',
        title: this.xAxisName,
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
        };
      this.primaryYAxis = {
        majorGridLines: { width: 1 },
        minimum: 0,
        maximum: 80,
        interval: 20,
        title: this.yAxisName,
        minorGridLines: { width: 1 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 }
      };
    })
  }

  async excelExport() {
    const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    this.service.exportExcel({
      printBy: accountName,
      functionName: functionName.trim(),
      imageBase64: await this.getchartImg()
    }).subscribe((data: any) => {
      const downloadURL = window.URL.createObjectURL(data.body);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      link.click();
    }, () => {});
  }

  public getchartImg() {
    return new Promise(function(res, rej) {
      var imagedata;
      var svg = document.querySelector("#chartcontainer_svg");
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
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
        var imagedata = canvas.toDataURL("image/png");
        canvas.remove();
        res(imagedata.replace('data:image/png;base64,',''))
      };
    })

  }
  pdfExport() {
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}`
    this.chart.export('PDF', fileName);
  }
  print() {
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
    this.chart.print();
  }
  async odsExport() {
    const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
    const functionName = JSON.parse(localStorage.getItem('menuItem'))?.name || 'Report Chart';
    const fileName = `${functionName.trim()}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`;
    this.service.exportExcel({
      printBy: accountName,
      functionName: functionName.trim(),
      imageBase64: await this.getchartImg()
    }).subscribe((data: any) => {
      const model = {
        functionName: fileName,
        file: data.body
      }
      this.service.downloadODSFile(model).subscribe((res: any) => {
        this.service.downloadBlob(res.body, fileName + '.ods', 'application/vnd.oasis.opendocument.spreadsheet')
      })
    }, () => {});
  }
}
