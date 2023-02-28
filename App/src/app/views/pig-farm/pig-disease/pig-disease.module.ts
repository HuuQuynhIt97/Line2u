
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PigDiseaseRoutingModule } from './pig-disease.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import {
  PigDiseaseComponent,
  PigCullingComponent,
  PigDiagnosisComponent,
  PigDiseaseDetailComponent,
  PigIsolationComponent,
  PigPrescriptionComponent,
  PigTreatmentComponent,

} from '.';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';


const ROUTING_MODULE = [
  PigDiseaseRoutingModule
];
const PIG_DISEASE_COMPONENT = [
  PigDiseaseComponent,
  PigCullingComponent,
  PigDiagnosisComponent,
  PigDiseaseDetailComponent,
  PigIsolationComponent,
  PigPrescriptionComponent,
  PigTreatmentComponent,
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
export class PigDiseaseModule { }
