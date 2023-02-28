import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Inventory } from 'src/app/_core/_model/inventories';
import { InventoryService } from 'src/app/_core/_service/inventories';
import { RequisitionService } from 'src/app/_core/_service/requisitions';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  @Input() model: Inventory = {} as Inventory;
  @Input() bottomDetailHeight: any;
  fields: object = { text: 'name', value: 'guid' };
  requisitionData: any;
  subscription = new Subscription();
  rejectData: any = [];
  constructor(
    private service: InventoryService,
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
    this.subscription = this.service.currentInventory.subscribe(inventory => {
      this.model = inventory as Inventory || {} as Inventory;
    });
    this.getRejectsData();
  }
  getRejectsData() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceAccount.getRejectsBySalesOrder(farmGuid).subscribe(data => {
      this.rejectData = data;
    })
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
