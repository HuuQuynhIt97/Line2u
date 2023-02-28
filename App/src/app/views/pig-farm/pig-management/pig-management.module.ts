import { Pig2ModalComponent } from './pig2/pig2-modal/pig2-modal.component';
import { Pig2Component } from './pig2/pig2.component';

import { MakeOrderService } from '../../../_core/_service/records/make-order.service';

// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { RecordRoutingModule } from './pig-management.routing.module';

import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
// Import ngx-barcode module

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';


import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { DatePipe } from '@angular/common';



import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { CullingComponent,
  DeathComponent,
  EarTagComponent,
  RecordFeedingComponent,
  MakeOrderComponent,
  RecordParentComponent,
  WeighingComponent,
  RecordMoveComponent,
  MakeOrderDetailComponent,
  BoarComponent,
  NewBoarComponent,
  FinisherComponent,
  GrowerComponent,
  SowComponent,
  NurseryComponent,
  GiltComponent,
  SucklingComponent,
  ImmunizationComponent
 } from '.';
import { SharedModule } from 'src/app/_core/commons/shared.module';

import { MakeOrderPenComponent } from './make-order-pen/make-order-pen.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

const ROUTING_MODULE = [
  RecordRoutingModule
];

const Record_COMPONENT = [
  RecordParentComponent,
  CullingComponent,
  DeathComponent,
  EarTagComponent,
  RecordMoveComponent,
  WeighingComponent,
  RecordFeedingComponent,
  MakeOrderComponent,
  MakeOrderDetailComponent,
  FinisherComponent,
  GiltComponent,
  GrowerComponent,
  SowComponent,
  BoarComponent,
  NewBoarComponent,
  SucklingComponent,
  NurseryComponent,
  Pig2Component,
  Pig2ModalComponent,
  MakeOrderPenComponent,
  ImmunizationComponent
]
@NgModule({
  providers: [
    DatePipe,
    MakeOrderService,
    NgbTooltipConfig
  ],
  imports: [
    ButtonModule,
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
  declarations: [
    ...Record_COMPONENT
  ]
})
export class PigMangementModule {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';

  constructor(config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }
}
