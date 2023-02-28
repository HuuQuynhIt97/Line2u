
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RepairRoutingModule } from './repair.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { RepairComponent, RepairDetailComponent, RepairRecordComponent } from '.';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';


const ROUTING_MODULE = [
  RepairRoutingModule
];
const ACCEPTANCE_COMPONENT = [
  RepairComponent,
  RepairDetailComponent,
  RepairRecordComponent
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
export class RepairModule { }
