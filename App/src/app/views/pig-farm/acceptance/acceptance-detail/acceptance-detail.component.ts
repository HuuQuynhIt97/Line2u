import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Acceptance } from 'src/app/_core/_model/acceptances';
import { AcceptanceService } from 'src/app/_core/_service/acceptances';
import { RequisitionService } from 'src/app/_core/_service/requisitions';

@Component({
  selector: 'app-acceptance-detail',
  templateUrl: './acceptance-detail.component.html',
  styleUrls: ['./acceptance-detail.component.scss']
})
export class AcceptanceDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  @Input() model: Acceptance = {} as  Acceptance;
  @Input() bottomDetailHeight: any;
  fields: object = { text: 'name', value: 'guid' };
  requisitionData: any;
  subscription = new Subscription();
  constructor(
    private service: AcceptanceService,
    private serviceRequisition: RequisitionService,
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
    this.subscription = this.service.currentAcceptance.subscribe(acceptance => {
      this.model = acceptance as Acceptance || {} as  Acceptance;
    });
    this.getRequisitions();
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  getRequisitions() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceRequisition.getRequisitions(farmGuid).subscribe(data => {
      this.requisitionData = data;
    })
  }
}
