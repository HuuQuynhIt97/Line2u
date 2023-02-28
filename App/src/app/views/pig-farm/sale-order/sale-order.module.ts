import { SaleOrderComponent, SaleOrderCheckOutComponent,SaleOrderDetailComponent } from '.';

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { SaleOrderRoutingModule } from './sale-order.routing.module';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';

const ROUTING_MODULE = [
  SaleOrderRoutingModule
];
const ACCEPTANCE_COMPONENT = [
SaleOrderComponent,
SaleOrderCheckOutComponent,
SaleOrderDetailComponent
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
export class SaleOrderModule { }
