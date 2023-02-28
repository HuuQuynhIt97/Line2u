import { CommonModule, DatePipe } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BreedingRoutingModule } from './breeding.routing.module';

import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Breeding2Component, Breeding2SowComponent, Breeding2SowIn2Component, Breeding2SowInComponent, BreedingBottomComponent, BreedingComponent, BreedingDetailComponent, BreedingDetailModalComponent, BreedingModalComponent, BreedingSowComponent, BreedingSowHeatingComponent, BreedingSowInComponent, BreedingSowInDetailComponent, BreedingSowMatingComponent, BreedingSowPickComponent, BreedingSowPregnancyTestComponent, BreedingTakeCareModalComponent, FarrowingRoomComponent, GeneralRecordComponent, MatingRoomComponent, PregnancyRoomComponent, SowBodyConditionComponent, SowFarrowComponent, SowFosterComponent, SowHeatingComponent, SowInComponent, SowMatingComponent, SowPreFarrowComponent, SowPregnancyTestComponent, SowWeaningComponent } from '.';
import { BreedingDataService } from '../services/breeding-data.service';
import { CommandColumnService, EditService, ExcelExportService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { RecordEarTagService } from 'src/app/_core/_service/apply-orders';
import { SowAbortionComponent } from './sow-abortion/sow-abortion.component';
import { SucklingCastrationComponent } from './suckling-castration/suckling-castration.component';
import { SucklingCutEarComponent } from './suckling-cut-ear/suckling-cut-ear.component';
import { SucklingCutTeethTailComponent } from './suckling-cut-teeth-tail/suckling-cut-teeth-tail.component';
import { SucklingIronInjectionComponent } from './suckling-iron-injection/suckling-iron-injection.component';
import { SucklingMoveComponent } from './suckling-move/suckling-move.component';
import { SucklingTeachingComponent } from './suckling-teaching/suckling-teaching.component';
import { SucklingWeaningComponent } from './suckling-weaning/suckling-weaning.component';
import { SucklingWeighingComponent } from './suckling-weighing/suckling-weighing.component';
import { Breeding2SucklingComponent } from './common/breeding2-suckling/breeding2-suckling.component';
import { GiltInComponent } from './gilt-in/gilt-in.component';
import { Breeding2GiltInComponent } from './gilt-in/breeding2-gilt-in/breeding2-gilt-in.component';
import { BoarModule } from './boar/boar.module';
import { GiltTestingComponent } from './gilt-testing/gilt-testing.component';
import { SowBackFatComponent } from './sow-back-fat/sow-back-fat.component';
import { SowFeedingComponent } from './sow-feeding/sow-feeding.component';
import { SowQuarantineComponent } from './sow-quarantine/sow-quarantine.component';
import { SowRotationComponent } from './sow-rotation/sow-rotation.component';
import { SowSiloComponent } from './sow-silo/sow-silo.component';
import { Environment } from '../config';
import {  PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
import { Breeding2GiltInModalComponent } from './common/breeding2-gilt-in-modal/breeding2-gilt-in-modal.component';
import { Breeding2GiltInV2Component } from './gilt-in/breeding2-gilt-in-v2/breeding2-gilt-in-v2.component';
import { Breeding2SowinHeatingComponent } from './sow-heating/breeding2-sowin-heating/breeding2-sowin-heating.component';
import { NewBoarInComponent } from './boar/new-boar-in/new-boar-in.component';
import { SowPregnancyTestBreeding2SowinComponent } from './sow-pregnancy-test/sow-pregnancy-test-breeding2-sowin/sow-pregnancy-test-breeding2-sowin.component';

const ROUTING_MODULE = [
  BreedingRoutingModule
];
const SOW_COMPONENT = [
  SowBodyConditionComponent,
  SowFarrowComponent,
  SowFosterComponent,
  SowHeatingComponent,
  SowMatingComponent,
  SowPreFarrowComponent,
  SowPregnancyTestComponent,
  SowWeaningComponent,
  SowAbortionComponent,
  SowInComponent,
  Breeding2GiltInV2Component
  
 ]
const BREEDING_COMPONENT = [
  BreedingComponent,
  BreedingBottomComponent,
  MatingRoomComponent,
  PregnancyRoomComponent,
  FarrowingRoomComponent,
  GeneralRecordComponent,
  BreedingModalComponent,
  BreedingDetailModalComponent,
  BreedingTakeCareModalComponent,
  Breeding2Component,
  BreedingSowInDetailComponent,
  BreedingSowInComponent,
  BreedingSowComponent,
  Breeding2SowInComponent,
  BreedingDetailComponent,
  Breeding2GiltInModalComponent
]
const BREEDING_SOW_COMPONENT = [
  BreedingSowHeatingComponent,
  BreedingSowMatingComponent,
  BreedingSowPickComponent,
  BreedingSowPregnancyTestComponent
]
const COMMON_COMPONENT = [
  Breeding2SowComponent,
  Breeding2SowIn2Component,
]
const GILT_COMPONENT = [
  GiltInComponent,
  Breeding2GiltInComponent
]
const SUCKLING_COMPONENT = [
  SucklingCastrationComponent,
  SucklingCutEarComponent,
  SucklingCutTeethTailComponent,
  SucklingIronInjectionComponent,
  SucklingMoveComponent,
  SucklingTeachingComponent,
  SucklingWeaningComponent,
  SucklingWeighingComponent
]

const NEW_COMPONENT = [
  GiltTestingComponent,
  SowBackFatComponent,
  SowFeedingComponent,
  SowQuarantineComponent,
  SowRotationComponent,
  SowSiloComponent,
  Breeding2SowinHeatingComponent,
  SowPregnancyTestBreeding2SowinComponent
]
@NgModule({
  declarations: [
    ...NEW_COMPONENT,
    ...COMMON_COMPONENT,
    ...BREEDING_COMPONENT,
    ...BREEDING_SOW_COMPONENT,
    ...SOW_COMPONENT,
   ...SUCKLING_COMPONENT,
   ...GILT_COMPONENT,
   Breeding2SucklingComponent
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
    BoarModule,
    SharedModule,
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE
  ],
  exports: [
    BreedingComponent
  ],
  providers: [
    NgbActiveModal,
    DatePipe,
    ToolbarService,
    RecordEarTagService,
    CommandColumnService ,
    EditService,
    ExcelExportService,
    
  ]
})
export class BreedingModule {
  static forChild(): ModuleWithProviders<BreedingModule> {
    return {
      ngModule: BreedingModule,
      providers: [AlertifyService],
    };
  }
  public static forRoot(environment: Environment): ModuleWithProviders<BreedingModule> {
    return {
      ngModule: BreedingModule,
      providers: [
        BreedingDataService,
        {
          provide: 'Env',
          useValue: environment
        }
      ]
    };
  }
}
