import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EventRenderedArgs, EventSettingsModel, MonthService, PopupOpenEventArgs, ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule';
import { L10n,setCulture } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-report-screen',
  templateUrl: './report-screen.component.html',
  styleUrls: ['./report-screen.component.scss']
})
export class ReportScreenComponent implements OnInit {
  selectedDate: Date = new Date(new Date().getFullYear(), new Date().getUTCMonth(),new Date().getDate());
  eventSettings: EventSettingsModel = { dataSource: [
    {
      Subject: "0 / 5",
      Fontsize: "15px",
      PaddingTop: "30px",
      TextAlign: "center",
      BackgoundColor: "#1aaa55",
      CategoryColor: "#AAAAAA",
      StartTime: "2023/02/01",
      EndTime: "2023/02/01",
      S1: "0",
      S2: "5",
      TDATE: "2023-02-01T00:00:00"
    },
    {
      Subject: "0 / 5",
      Fontsize: "15px",
      PaddingTop: "30px",
      TextAlign: "center",
      BackgoundColor: "#1aaa55",
      CategoryColor: "#AAAAAA",
      StartTime: "2023/02/02",
      EndTime: "2023/02/02",
      S1: "0",
      S2: "5",
      TDATE: "2023-02-02T00:00:00"
    },
    
  ] };
  fiterRequest: any;
  localeSchedule: string = 'zh'
  currentView: View = 'Month';
  eventAdded: boolean = false;
  @ViewChild("schedule") public scheduleObj: ScheduleComponent;
  deviceGuid
  constructor(
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,

  ) { }

  ngOnInit(): void {
    let lang = localStorage.getItem('lang');
    let languages = JSON.parse(localStorage.getItem('languages'));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages['grid'],
        pager: languages['pager'],
        dropdowns: languages['dropdownlist'],
        schedule: languages['schedule']
      }
    };
    L10n.load(load);
    this.localeSchedule = lang == 'tw' || lang == 'cn' ? 'zh' : lang;
   
  }
  selectedDateChange(args) {
    
  }
  public onPopupOpen(args: PopupOpenEventArgs): void {
    args.cancel = true

  }
  public onEventRendered(args: EventRenderedArgs): void {
    const categoryColor: string = args.data.CategoryColor as string;
    if (!args.element || !categoryColor) {
      return;
    }
    if (this.currentView === 'Agenda') {
      (args.element.firstChild as HTMLElement).style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  }
  cellClick(args) {
    var schedule = document.querySelector(".e-schedule") as any; 
    if (schedule) { 
      var scheduleObj = schedule.ej2_instances[0]; 
      args.cancel = scheduleObj.isAdaptive; 
      if (scheduleObj.isAdaptive) { 
          // Open editor window mannually 
          scheduleObj.openEditor(args, "Add"); 
      } 
    } 
 
  }
  public onClick(args) {
    if (!this.eventAdded) {
      let popupInstance = (document.querySelector(".e-quick-popup-wrapper") as any).ej2_instances[0];
      popupInstance.open = () => {
        popupInstance.refreshPosition();
      };
      this.eventAdded = true;
    }
  }
  templateData(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
