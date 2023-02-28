import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';

import { ExecuteOrdersRoutingModule } from './execute-orders.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExeRecord2TreatmentComponent, ExeRecordCullingComponent, ExeRecordDeathComponent, ExeRecordDiagnosisComponent, ExeRecordDisinfectionComponent, ExeRecordDonateComponent, ExeRecordEarTagComponent, ExeRecordFeedingComponent, ExeRecordGeneralComponent, ExeRecordImmunizationComponent, ExeRecordInOutComponent, ExeRecordInventoryCheckComponent, ExeRecordMoveComponent, ExeRecordPatrolComponent, ExeRecordRepairComponent, ExeRecordSaleComponent, ExeRecordTowerComponent, ExeRecordVectorControlComponent, ExeRecordWeighingComponent } from '.';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ApplyOrdersModule } from '../apply-orders/apply-orders.module';
import { ExeRecordDiagnosisTreatmentComponent } from './exe-record-diagnosis/exe-record-diagnosis-treatment/exe-record-diagnosis-treatment.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

const ROUTING_MODULE = [
  ExecuteOrdersRoutingModule
];
const EXECUTE_ORDER_COMPONENT = [
ExeRecordGeneralComponent,
ExeRecordTowerComponent,
ExeRecordInventoryCheckComponent,
ExeRecordDiagnosisComponent,
ExeRecordRepairComponent,
ExeRecordPatrolComponent,

ExeRecordCullingComponent,
ExeRecordDeathComponent,
ExeRecordDisinfectionComponent,
ExeRecordDonateComponent,
ExeRecordEarTagComponent,
ExeRecordFeedingComponent,
ExeRecordImmunizationComponent,
ExeRecordMoveComponent,
ExeRecordSaleComponent,
ExeRecordVectorControlComponent,
ExeRecordWeighingComponent,
ExeRecordInOutComponent,
ExeRecord2TreatmentComponent,
ExeRecordDiagnosisTreatmentComponent
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
    MultiSelectAllModule,
    TranslateModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE,
  ],
  declarations: [...EXECUTE_ORDER_COMPONENT]
})
export class ExecuteOrdersModule { }
