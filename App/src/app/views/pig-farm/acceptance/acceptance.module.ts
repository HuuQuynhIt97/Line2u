import { AcceptanceInspectionComponent } from './acceptance-inspection/acceptance-inspection.component';
import { AcceptanceCheckinComponent } from './acceptance-checkin/acceptance-checkin.component';
import { AcceptanceCheckComponent } from './acceptance-check/acceptance-check.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AcceptanceComponent } from './acceptance.component';
import { AcceptanceRoutingModule } from './acceptance.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { AcceptanceDetailComponent } from './acceptance-detail/acceptance-detail.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';


const ROUTING_MODULE = [
  AcceptanceRoutingModule
];
const ACCEPTANCE_COMPONENT = [
  AcceptanceComponent,
  AcceptanceCheckComponent,
  AcceptanceCheckinComponent,
  AcceptanceInspectionComponent,
  AcceptanceDetailComponent
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
  declarations: [...ACCEPTANCE_COMPONENT]
})
export class AcceptanceModule { }
