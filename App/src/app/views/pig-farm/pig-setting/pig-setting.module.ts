import { SharedModule } from 'src/app/_core/commons/shared.module';
import { PigModalComponent } from './pig/pig-modal/pig-modal.component';
import { PigTestingComponent ,
  PigPedigreeComponent,
  PigPedigreeDetailComponent,
PigGeneticComponent ,
PigCodeComponent } from '.';
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
import { PigSettingRoutingModule } from './pig-setting.routing.module';
import { PigComponent } from '.';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
// import { NgxOrgChartModule } from 'ngx-org-chart';
// import { PigOrganizationModalComponent } from './pig/pig-organization-modal/pig-organization-modal.component';

const PIG_SETTING_COMPONENT = [
  PigComponent,
  PigModalComponent,
  PigCodeComponent,
  PigGeneticComponent,
  PigPedigreeComponent,
  PigTestingComponent,
  PigPedigreeDetailComponent,
  // PigOrganizationModalComponent
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
    PigSettingRoutingModule,
    // NgxOrgChartModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),

  ],
  declarations: [
    ...PIG_SETTING_COMPONENT
  ]
})
export class PigSettingModule {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';

  constructor(config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }
}
