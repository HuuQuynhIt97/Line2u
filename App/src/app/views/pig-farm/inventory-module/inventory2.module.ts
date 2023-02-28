import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  RfidComponent, SemenComponent, SemenMixComponent, TreatmentDetailComponent, TreatmentMasterComponent } from '.';
import { Inventory2RoutingModule } from './inventory2.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgxSpinnerModule } from 'ngx-spinner';

import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    Inventory2RoutingModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule,
    CoreDirectivesModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
  ],
  declarations: [
    RfidComponent,
    SemenComponent,
    SemenMixComponent,
    TreatmentMasterComponent,
    TreatmentDetailComponent
  ]
})
export class Inventory2Module { }
