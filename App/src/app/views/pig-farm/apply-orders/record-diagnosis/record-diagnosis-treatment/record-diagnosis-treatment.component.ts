import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'herr-core';
import { Record2Treatment } from 'src/app/_core/_model/apply-orders';
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { DatePipe } from '@angular/common';
import { Record2PigService, Record2TreatmentService } from 'src/app/_core/_service/apply-orders';
import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-record-diagnosis-treatment',
  templateUrl: './record-diagnosis-treatment.component.html',
  styleUrls: ['./record-diagnosis-treatment.component.scss']
})
export class RecordDiagnosisTreatmentComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  sortOptions = { columns: [{ field: 'treatmentDate', direction: 'Ascending' }] }
  public query: Query ;
  @Input() recordGuid: any;
  @Input() pigGuid: any;
  @Input() record2PigGuid: any;
  @Input() treatmentData: Record2Treatment[] = [] as Record2Treatment[] ;
  @Input() selectedPigData: any[];
  @Input() treatmentDataChange = new EventEmitter();
  @ViewChild(GridComponent) public grid: GridComponent;
  treatmentItem: Record2Treatment = {} as Record2Treatment;
  editSettingsTreatment = {
    showDeleteConfirmDialog: false,
    allowEditing: true,
    allowAdding: false,
    allowDeleting: true,
    mode: "Normal",
  };
  numbericEdit = { params: { decimals: 0, min: 0 }};
  commands = [
        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat delete-grid' } }];
  @ViewChild("treatmentTemplate", { static: true }) public treatmentTemplate: any;
  @Input() treatmentGuid: any;
  treatmentNo: any;
  constructor( public translate: TranslateService,
    public service: Record2TreatmentService,
    public serviceRecord2Pig: Record2PigService,
    public alertify: AlertifyService,
    public datePipe: DatePipe,
    private cd: ChangeDetectorRef
    ) {
      super(translate,environment.apiUrl);
    }
  ngOnDestroy(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
   
  }
  ngOnInit(): void {
    this.treatmentItem.treatmentDate = this.convertDateToString(new Date())
  
    this.toolbarOptions = [
      { template: this.treatmentTemplate },
      "Add",
      "Search",
    ];
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
      this.loadData()
    }
  }
  private loadData() {
    let query = new Query()
    .skip(this.skip)
    .take(this.take);
    let predicate: Predicate = Predicate.and();
    predicate.predicates = [
      new Predicate("recordGuid", 'equal', this.recordGuid || ''), 
      new Predicate("record2PigGuid", 'equal', this.record2PigGuid || '')
    ];
    query.where(predicate);
    
    new DataManager({
      url: `${this.baseUrl}Record2Treatment/LoadDataByLang?lang=${localStorage.getItem('lang')}`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    })
    .executeQuery(query)
    .then((data: any)=> {
      this.initialSelectedPigData(data.result );
    });
  }
  private initialSelectedPigData(existedData) {
    const index =  this.selectedPigData.findIndex(x=> x.pigGuid == this.pigGuid);
    if (index !== -1) { 
      this.treatmentData = this.selectedPigData[index]['record2Treatment'] || [] as Record2Treatment[]
      if (this.treatmentData.length > 0) {
        this.treatmentGuid = this.treatmentData[0].treatmentGuid;
      }
      this.treatmentData.push(...(existedData || [] as Record2Treatment[])) ;
    } else {
      this.treatmentData = existedData;
    }
    if (this.treatmentData.length > 0) {
      for (const x of this.treatmentData) {
        x.treatmentDate =  this.convertDateToString(x.treatmentDate)
      }
      this.treatmentGuid = this.treatmentData[0].treatmentGuid;
      this.editSettingsTreatment = {
        showDeleteConfirmDialog: false,
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Normal",
      };
    } 
    this.treatmentData = this.treatmentData.distinctBy('id')
    this.treatmentDataChange.emit(this.treatmentData);
    this.updateSelectedPigData();
    this.serviceRecord2Pig.changeRecord2Pig(this.selectedPigData)
    this.service.changeRecord2Treatment(this.treatmentData)
  }
  private updateSelectedPigData() {
    const index =  this.selectedPigData.findIndex(x=> x.pigGuid == this.pigGuid);
    if (index !== -1) { 
      this.selectedPigData[index]['record2Treatment'] = this.treatmentData
    }
  }
  loadTreatmentDetail(treatmnetGuid) {
    this.query = new Query()
    .skip(this.skip)
    .take(this.take)
    .where('treatmentGuid', 'equal', treatmnetGuid);
    const request =  new DataManager({
      url: `${this.baseUrl}TreatmentDetail/GetDataDropdownlist`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    });
    request.executeQuery( this.query).then((data: any) => {
      if (this.treatmentData.length === 0) {
        this.treatmentData = data.result as []
        for (const x of this.treatmentData) {
          x.treatmentDate =  this.convertDateToString(this.addDays(x.treatmentTimes))
          x.type =  "Diagnosis"
          x.treatmentNo = this.treatmentNo
        }
      } else {
        const newData = data.result as any[]
        for (const x of newData) {
          x.treatmentDate =  this.convertDateToString(this.addDays(x.treatmentTimes))
          x.type =  "Diagnosis"
          x.treatmentNo = this.treatmentNo
        }
        this.treatmentData.push(...newData)
      }
     
      if (this.treatmentData.length > 0) {
        this.editSettingsTreatment = {
          showDeleteConfirmDialog: false,
          allowEditing: true,
          allowAdding: true,
          allowDeleting: true,
          mode: "Normal",
        };
      } else {
        this.editSettingsTreatment = {
          showDeleteConfirmDialog: false,
          allowEditing: false,
          allowAdding: false,
          allowDeleting: true,
          mode: "Normal",
        };
      }
      this.grid.refresh();
    })

  }
   onChange(e) {
    this.treatmentNo = e.itemData?.treatmentNo;
    this.treatmentGuid = e.value;
    this.editSettingsTreatment = {
      showDeleteConfirmDialog: false,
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal",
    };
  }
  selectedValueName(e) {
    this.treatmentItem['medicineName'] = e;
  }
  onChangeDate(e) {
    this.treatmentItem.treatmentDate = e;
    this.cd.detectChanges();
  }
  actionBeginTreatment(e) {
    if (e.requestType === 'beginEdit' || e.requestType === 'add') {
      if (e.requestType === 'add') {
        this.loadTreatmentDetail(this.treatmentGuid)
        e.cancel = true;
      }
      this.treatmentItem = Object.assign({}, e.rowData);
    this.treatmentItem.treatmentDate = this.treatmentItem.treatmentDate ? this.treatmentItem.treatmentDate : this.convertDateToString(new Date())

    }
    
    if (e.requestType === 'save') {
      e.data['medicineGuid'] = this.treatmentItem.medicineGuid;
      e.data['treatmentDate'] =this.convertDateToString(this.treatmentItem.treatmentDate);
      e.data['medicineName'] = this.treatmentItem['medicineName'] 
      e.data['type'] =  "Diagnosis"
      e.data['id'] =  e.data['id'] || Math.random() * - 1
      e.data['recordGuid'] =  this.recordGuid || null;
      const index =  this.treatmentData.findIndex(x=> x.id == e.data.id);
      if (index !== -1) {
        this.treatmentData[index].medicineGuid = this.treatmentItem.medicineGuid;
        this.treatmentData[index].treatmentNo = e.data.treatmentNo;
        this.treatmentData[index].treatmentDose = e.data.treatmentDose;
        this.treatmentData[index].treatmentPercentage = e.data.treatmentPercentage;
        this.treatmentData[index]['medicineName'] = this.treatmentItem['medicineName'] 
        this.treatmentData[index].treatmentTimes = e.data.treatmentTimes;
        this.treatmentData[index].treatmentDate = this.convertDateToString(this.treatmentItem.treatmentDate);
        this.service.changeRecord2Treatment(this.treatmentData)
        this.updateSelectedPigData();
        this.serviceRecord2Pig.changeRecord2Pig(this.selectedPigData)
      }
    }
  }
  actionComplete(e) {
    this.service.changeRecord2Treatment(this.treatmentData)
    this.updateSelectedPigData();
    this.serviceRecord2Pig.changeRecord2Pig(this.selectedPigData)
  }
  delete(data) {
    
  }
  convertDateToString(date) {
    if (date === undefined || date === null || date === '')
    return this.datePipe.transform(new Date(), "yyyy-MM-dd");
    if (date instanceof Date) {
      return this.datePipe.transform(date, "yyyy-MM-dd");
    }
    return date;
  }
  addDays(days) {
    let date = new Date();
    date.setDate(date.getDate() + (days - 1));
    return date;
  }
}
