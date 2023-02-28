import { InventoryScrapComponent } from './inventory-scrap/inventory-scrap.component';
import { InventoryChangeComponent } from './inventory-change/inventory-change.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { InventoryChangeMaterialComponent } from './inventory-change-material/inventory-change-material.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';


const ROUTING_MODULE = [
  InventoryRoutingModule
];
const INVENTORY_COMPONENT = [
  InventoryComponent,
  InventoryDetailComponent,
  InventoryChangeComponent,
  InventoryChangeMaterialComponent,
  InventoryScrapComponent

]
@NgModule({
  providers: [
    DatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule,
    CoreDirectivesModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE,
  ],
  declarations: [...INVENTORY_COMPONENT]
})
export class InventoryModule { }
