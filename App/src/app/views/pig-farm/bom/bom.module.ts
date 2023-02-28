import { BomDetailComponent } from './bom-detail/bom-detail.component';

// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { BOMRoutingModule } from './bom.routing.module';

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
import { BomComponent } from './bom/bom.component';
import { BomLeftComponent } from './bom-left/bom-left.component';
import { BomRightComponent } from './bom-right/bom-right.component';
import { DisinfectionComponent } from './disinfection/disinfection.component';
import { FeedingComponent } from './feeding/feeding.component';
import { ImmunizationComponent } from './immunization/immunization.component';
import { MoveComponent } from './move/move.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { VectorControlComponent } from './vector-control/vector-control.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';

import { WeighingComponent } from './weighing/weighing.component';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';

const ROUTING_MODULE = [
  BOMRoutingModule
];

const BOM_COMPONENT = [
  BomComponent,
  BomLeftComponent,
  BomRightComponent,
  MoveComponent,
  FeedingComponent,
  ImmunizationComponent,
  DisinfectionComponent,
  VectorControlComponent,
  TreatmentComponent,
  BomDetailComponent,
  WeighingComponent
]
@NgModule({
  providers: [
    DatePipe,
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
    ...ROUTING_MODULE
  ],
  declarations: [
    ...BOM_COMPONENT
  ]
})
export class BOMModule {
}
