import { RecordEarTagService } from './../../../_core/_service/records/record-ear-tag.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';

import { ApplyOrdersRoutingModule } from './apply-orders.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Record2MarketComponent, Record2PiginComponent, Record2TreatmentComponent, RecordBuriedComponent, RecordChemicalComponent, RecordCullingComponent, RecordCullingSaleComponent, RecordDeathComponent, RecordDiagnosisComponent, RecordDisinfectionComponent, RecordDonateComponent, RecordEarTagComponent, RecordFeedingComponent, RecordGeneralComponent, RecordImmunizationComponent, RecordInOutComponent, RecordInventoryCheckComponent, RecordKillComponent, RecordMarketComponent, RecordMarketModalComponent, RecordMoveComponent, RecordPatrolComponent, RecordPiginComponent, RecordPigoutComponent, RecordRepairComponent, RecordSaleComponent, RecordSiloComponent, RecordStolenComponent, RecordTowerComponent, RecordVectorControlComponent, RecordWeighingComponent } from '.';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CommandColumnService, EditService, ExcelExportService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RecordDiagnosisTreatmentComponent } from './record-diagnosis/record-diagnosis-treatment/record-diagnosis-treatment.component';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
import { RecordAccidentFeeComponent } from './record-accident-fee/record-accident-fee.component';
import { RecordAccidentFeeModalComponent } from './record-sale/record-accident-fee-modal/record-accident-fee-modal.component';
import { RecordAccountCheckComponent } from './record-accountCheck/record-accountCheck.component';
import { Record2AccountComponent } from './record-accountCheck/record2-account/record2-account.component';
import { RecordAbattoirComponent } from './record-abattoir/record-abattoir.component';
import { RecordCullingSaleMarketModalComponent } from './record-culling-sale/record-culling-sale-market-modal/record-culling-sale-market-modal.component';

declare var require: any
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week
  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/zh/ca-gregorian.json'),
    require('cldr-data/main/zh/numbers.json'),
    require('cldr-data/main/zh/timeZoneNames.json'),
    require('cldr-data/supplemental/weekdata.json')); 
    loadCldr(
      require('cldr-data/supplemental/numberingSystems.json'),
      require('cldr-data/main/vi/ca-gregorian.json'),
      require('cldr-data/main/vi/numbers.json'),
      require('cldr-data/main/vi/timeZoneNames.json'),
      require('cldr-data/supplemental/weekdata.json'));
    
  const ROUTING_MODULE = [
  ApplyOrdersRoutingModule
];
const APPLY_ORDER_COMPONENT = [
RecordGeneralComponent,
RecordTowerComponent,
RecordInventoryCheckComponent,
RecordDiagnosisComponent,
RecordRepairComponent,
RecordPatrolComponent,

RecordCullingComponent,
RecordDeathComponent,
RecordDisinfectionComponent,
RecordDonateComponent,
RecordEarTagComponent,
RecordFeedingComponent,
RecordImmunizationComponent,
RecordMoveComponent,
RecordSaleComponent,
RecordVectorControlComponent,
RecordWeighingComponent,
RecordInOutComponent,
RecordPiginComponent,
Record2PiginComponent,
RecordPigoutComponent,
RecordKillComponent,
RecordStolenComponent,
RecordChemicalComponent,
RecordSiloComponent,
RecordBuriedComponent,
RecordCullingSaleComponent,
Record2TreatmentComponent,
RecordDiagnosisTreatmentComponent,
RecordMarketComponent,
Record2MarketComponent,
RecordMarketModalComponent,
RecordAccidentFeeComponent,
RecordAccidentFeeModalComponent,
RecordAccountCheckComponent,
Record2AccountComponent,
RecordAbattoirComponent,
RecordCullingSaleMarketModalComponent
]
@NgModule({
  providers: [
    DatePipe,
    ToolbarService,
    RecordEarTagService,
    CommandColumnService,
    EditService,
    ExcelExportService,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule,
    CoreDirectivesModule,
    MultiSelectAllModule,
    TranslateModule,
    UploaderModule,
    ButtonModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE,
  ],
  exports: [RecordDiagnosisTreatmentComponent],
  declarations: [...APPLY_ORDER_COMPONENT]
})
export class ApplyOrdersModule{
  constructor() {
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
        "multi-select": languages["multiselect"],
        "drop-down-list": languages["multiselect"]
      }
     
    };
    L10n.load(load);
  }
 }
