import { Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'herr-core';
import { Record2Treatment } from 'src/app/_core/_model/apply-orders';
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { DatePipe } from '@angular/common';
import { Record2TreatmentService } from 'src/app/_core/_service/apply-orders';
import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";
import { GridComponent } from '@syncfusion/ej2-angular-grids';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-record2-treatment',
  templateUrl: './record2-treatment.component.html',
  styleUrls: ['./record2-treatment.component.css']
})
export class Record2TreatmentComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() recordGuid: any;
  @Input() treatmentData: Record2Treatment[] = [] as Record2Treatment[] ;
  @Input() treatmentDataChange = new EventEmitter();
  @ViewChild(GridComponent) public grid: GridComponent;
  treatmentItem: Record2Treatment = {} as Record2Treatment;
  editSettingsTreatment = {
    showDeleteConfirmDialog: false,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };
  numbericEdit = { params: { decimals: 0, min: 0 }};
  commands = [
        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat delete-grid' } }];

  constructor( public translate: TranslateService,
    public service: Record2TreatmentService,
    public datePipe: DatePipe
    ) {
      super(translate,environment.apiUrl);
    }
  ngOnChanges(changes: SimpleChanges): void {
  
  }
  ngOnInit(): void {
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
          "multi-select": languages["multiselect"]
      },
    };
    L10n.load(load);

    if (this.recordGuid) {
      new DataManager({
        url: `${this.baseUrl}Record2Treatment/LoadData`,
        adaptor: new UrlAdaptor,
        crossDomain: true,
      })
      .executeQuery(new Query()
      .skip(this.skip)
      .take(this.take)
      .where("recordGuid", 'equal', this.recordGuid || ''))
      .then((data: any)=> {
        this.treatmentData = data.result || [] as Record2Treatment[] ;
        this.treatmentDataChange.emit(this.treatmentData);
        this.service.changeRecord2Treatment(this.treatmentData)
      });
    }
  }
  selectedValueName(e) {
    this.treatmentItem['treatmentMedicineName'] = e;;
  }
  actionBeginTreatment(e) {
    if (e.requestType === 'beginEdit' || e.requestType === 'add') {
      this.treatmentItem = Object.assign({}, e.rowData);
    }
    
    if (e.requestType === 'save') {
      e.data['treatmentMedicine'] = this.treatmentItem['treatmentMedicine'];
      e.data['treatmentDate'] = this.convertDateToString(e.data['treatmentDate'])
      e.data['treatmentMedicineName'] = this.treatmentItem['treatmentMedicineName'] 
      e.data['type'] =  "Diagnosis"
      e.data['id'] =  e.data['id'] || Math.random() * - 1
      e.data['recordGuid'] =  this.recordGuid || null;
      // e.data.treatmentNo = e.data['treatmentNo'];
      // e.data.treatmentDose = e.data['treatmentDose'];
      // e.data.treatmentTimes = e.data['treatmentTimes'];
      //(this.grid.dataSource as any[]).unshift(e.data);
      //this.grid.refresh();
    }
   
  }
  actionComplete(e) {
    this.service.changeRecord2Treatment(this.treatmentData)
  }
  delete(data) {
    
  }
  convertDateToString(date) {
    if (date === undefined || date === null || date === '')
    return null;
    if (date instanceof Date) {
      return this.datePipe.transform(date, "MM-dd-yyyy");
    }
    return date;
  }
}
