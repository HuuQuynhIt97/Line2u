import { XAccountService } from './../../../../_core/_service/xaccount.service';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Requisition } from 'src/app/_core/_model/requisitions';
import { RequisitionService } from 'src/app/_core/_service/requisitions';

@Component({
  selector: 'app-requisition-detail',
  templateUrl: './requisition-detail.component.html',
  styleUrls: ['./requisition-detail.component.scss']
})
export class RequisitionDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  @Input() model: Requisition = {} as  Requisition;
  @Input() bottomDetailHeight: any;
  fields: object = { text: 'name', value: 'guid' };
  requisitionData: any;
  subscription = new Subscription();
  rejectData: any = [];
  constructor(
    private service: RequisitionService,
    private serviceAccount: XAccountService,
    ) { }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomDetailHeight != changes.bottomDetailHeight.currentValue) {
      this.bottomDetailHeight = changes.bottomDetailHeight.currentValue;
    }
    if (this.model != changes.model?.currentValue) {
      this.model = changes.model?.currentValue;
    }
  }
  ngOnInit() {
    this.subscription = this.service.currentRequisition.subscribe(acceptance => {
      this.model = acceptance as Requisition || {} as  Requisition;
    });
    this.getRejectsData();
  }
  getRejectsData() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceAccount.getRejectsByAcceptance(farmGuid).subscribe(data => {
      this.rejectData = data;
    })
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
