
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

import { SharedModule } from 'src/app/_core/commons/shared.module';

import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';
import { EditPageDashboardRoutingModule } from './edit-page-dashboard.routing.module';
import { EditRecordDeathComponent } from './edit-record-death/edit-record-death.component';

const ROUTING_MODULE = [
  EditPageDashboardRoutingModule
];

const COMPONENT = [
  EditRecordDeathComponent
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
    ...COMPONENT
  ]
})
export class EditPageDashboardModule {
}
