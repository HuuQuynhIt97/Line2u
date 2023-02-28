
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing

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
import { BomLeftComponent } from './bom-left/bom-left.component';
import { BomRightComponent } from './bom-right/bom-right.component';
import { ImmunizationComponent } from './immunization/immunization.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';

import { BomSowComponent } from './bom-sow/bom-sow.component';
import { BomSowRoutingModule } from './bom-sow.routing.module';
import { BomSowDetailComponent } from './bom-sow-detail/bom-sow-detail.component';
import { BomMoveComponent } from './bom-move/bom-move.component';
import { BomFeedingComponent } from './bom-feeding/bom-feeding.component';
import { BomWeighingComponent } from './bom-weighing/bom-weighing.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
const ROUTING_MODULE = [
  BomSowRoutingModule
];

const BOM_COMPONENT = [
  BomSowComponent,
  BomLeftComponent,
  BomRightComponent,
  ImmunizationComponent,
  BomSowDetailComponent,
  BomMoveComponent,
  BomFeedingComponent,
  BomWeighingComponent
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
export class BomSowModule {
}
