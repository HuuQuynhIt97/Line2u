import { VectorControl2Component } from './vector-control/vector-control.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ThingComponent } from './thing/thing.component';
import { MaterialComponent } from './material/material.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { NutritionComponent } from './nutrition/nutrition.component';
import { FeedMaterialComponent } from './feed-material/feed-material.component';
import { MedicineComponent } from './medicine/medicine.component';
import { DiseaseComponent } from './disease/disease.component';
import { CustomerComponent } from './customer/customer.component';

import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
// Angular
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { PigFarmRoutingModule } from './pig-farm-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Disinfection2Component } from './disinfection/disinfection.component';
import { FeedComponent } from './feed/feed.component';
import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { VendorComponent } from './vendor/vendor.component';

import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { Container1Component } from './dashboard/container1/container1.component';
import { Container2Component } from './dashboard/container2/container2.component';
import { Container3Component } from './dashboard/container3/container3.component';
import { DashboardContainerComponent } from './dashboard/dashboard-container/dashboard-container.component';
import { RecordInOutComponent } from './record-in-out/record-in-out.component';
import { SystemConfigComponent } from './system/system-config/system-config.component';
import { environment } from '../../../environments/environment'
import { BreedingModule } from './breedings/lib/breeding.module';
import { PigfarmCoreModule } from 'herr-core';
import { TransferFeeComponent } from './transfer-fee/transfer-fee.component';
import { AbattoirLevelComponent } from './abattoir-level/abattoir-level.component';
interface Environment {
  production: boolean;
  apiUrl: string;
  versionCheckURL: string;
  domain: string;
}

const PHASE4_COMPONENT = [
  CustomerComponent,
  DiseaseComponent,
  Disinfection2Component,
  MedicineComponent,
  FeedComponent,
  FeedMaterialComponent,
  NutritionComponent,
  VectorControl2Component,
  RecordInOutComponent,
  SystemConfigComponent,
  TransferFeeComponent,
  AbattoirLevelComponent
]

const PHASE5_COMPONENT = [
  MaterialComponent,
  VendorComponent,
  ThingComponent,
  PurchaseComponent
]
@NgModule({
  providers: [
    DatePipe,
    NgbTooltipConfig
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    PigFarmRoutingModule,
    NgbModule,
    DatePickerAllModule,
    CoreDirectivesModule,
    ChartModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    BreedingModule
  ],
  declarations: [
    DashboardComponent,
    Container1Component,
    Container2Component,
    Container3Component,
    DashboardContainerComponent,
    ...PHASE4_COMPONENT,
    ...PHASE5_COMPONENT
  ]
})
export class PigFarmModule {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';

  constructor(config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }
 }
