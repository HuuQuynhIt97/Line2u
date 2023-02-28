import { RequisitionThingComponent } from './requisition-thing/requisition-thing.component';
import { RequisitionMaterialComponent } from './requisition-material/requisition-material.component';
import { RequisitionMedicineComponent } from './requisition-medicine/requisition-medicine.component';
import { RequisitionFeedComponent } from './requisition-feed/requisition-feed.component';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RequisitionComponent } from './requisition.component';
import { RequisitionRoutingModule } from './requisition.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { RequisitionDetailComponent } from './requisition-detail/requisition-detail.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

const ROUTING_MODULE = [
  RequisitionRoutingModule
];
const REQUISITION_COMPONENT = [
  RequisitionComponent,
  RequisitionDetailComponent,
  RequisitionFeedComponent,
  RequisitionMedicineComponent,
  RequisitionMaterialComponent,
  RequisitionThingComponent
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
  declarations: [...REQUISITION_COMPONENT]
})
export class RequisitionModule { }
