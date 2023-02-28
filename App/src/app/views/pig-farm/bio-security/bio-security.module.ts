import { BioSMasterService } from './../../../_core/_service/bios/bios-master.service';
import { BiosMasterComponent,
 BiosRecordComponent,
 BioSecurityComponent,
 Bios2pigComponent,
 Bios2penComponent,
 BiosMasterBoarComponent,
 BiosMasterGiltComponent,
 BiosMasterNewBoarComponent,
 BiosMasterPigComponent,
 BiosMasterSowComponent,
 BiosMasterSucklingComponent,
 Bios2pigModalComponent,
 RecordImmunizationComponent,
 BiosMasterGrowerComponent,
 BiosMasterFinisherComponent,
 BiosMasterNurseryComponent,
 } from '.';

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

import { InfiniteScrollService } from '@syncfusion/ej2-angular-grids';


import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { BioSecurityRoutingModule } from './bio-security.routing.module';
import { BioSecurityDetailComponent } from './bio-security-detail/bio-security-detail.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';


const ROUTING_MODULE = [
  BioSecurityRoutingModule
];
const BIO_SECURITY_COMPONENT = [
  Bios2penComponent,
  Bios2pigComponent,
  Bios2pigModalComponent,
  BioSecurityComponent,
  BioSecurityDetailComponent,
  BiosRecordComponent,
  BiosMasterComponent,
  BiosMasterSowComponent,
  BiosMasterBoarComponent,
  BiosMasterNewBoarComponent,
  BiosMasterSucklingComponent,
  BiosMasterGiltComponent,
  BiosMasterPigComponent,
  RecordImmunizationComponent,
  BiosMasterFinisherComponent,
  BiosMasterGrowerComponent,
  BiosMasterNurseryComponent
]
@NgModule({
  providers: [
    DatePipe,
    BioSMasterService,
    InfiniteScrollService,
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
    ...BIO_SECURITY_COMPONENT
  ]
})
export class BioSecurityModule {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';

  constructor(config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }
}
