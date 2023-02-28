
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PigHouseCleaningRoutingModule } from './pig-house-cleaning.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import {
  PigHouseCleaningComponent,
  PigHouseCleaningDetailComponent,
  PigHouseCleaningPlanComponent,
  PigHouseCleaningRecordComponent,
  PigHouseCleaningScheduleComponent,
  PigHouseDisinfectionComponent,

} from '.';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

const ROUTING_MODULE = [
  PigHouseCleaningRoutingModule
];
const PIG_DISEASE_COMPONENT = [
  PigHouseCleaningComponent,
  PigHouseCleaningDetailComponent,
  PigHouseCleaningPlanComponent,
  PigHouseCleaningRecordComponent,
  PigHouseCleaningScheduleComponent,
  PigHouseDisinfectionComponent,
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
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE,
  ],
  declarations: [...PIG_DISEASE_COMPONENT]
})
export class PigHouseCleaningModule { }
