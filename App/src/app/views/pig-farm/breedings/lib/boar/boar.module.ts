import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BoarSiloComponent } from './boar-silo/boar-silo.component';
import { BoarFeedingComponent } from './boar-feeding/boar-feeding.component';
import { BoarHeatingComponent } from './boar-heating/boar-heating.component';
import { BoarRideComponent } from './boar-ride/boar-ride.component';
import { BoarRotationComponent } from './boar-rotation/boar-rotation.component';
import { BoarSemenMixComponent } from './boar-semen-mix/boar-semen-mix.component';
import { BoarTestingComponent } from './boar-testing/boar-testing.component';
import { BoarRoutingModule } from './boar.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ToolbarService, CommandColumnService, EditService, ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { NgxSpinnerModule } from 'ngx-spinner';

import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { BoarSemenTestingComponent } from './boar-semen-testing/boar-semen-testing.component';
import { BoarQuarantineComponent } from './boar-quarantine/boar-quarantine.component';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';
import { Boar2SemenMixComponent } from '../common/boar2-semen-mix/boar2-semen-mix.component';
import { NewBoarInComponent } from './new-boar-in/new-boar-in.component';
import { Breeding2BoarInComponent } from './new-boar-in/breeding2-gilt-in/breeding2-gilt-in.component';

@NgModule({
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
    BoarRoutingModule
  ],
  declarations: [
    BoarFeedingComponent, 
    BoarHeatingComponent,
    BoarRideComponent,
     BoarSiloComponent, 
     BoarRotationComponent,
     BoarSemenMixComponent,
     BoarTestingComponent,
     BoarSemenTestingComponent,
     BoarQuarantineComponent,
     Boar2SemenMixComponent,
     NewBoarInComponent,
     Breeding2BoarInComponent
    ],
    providers: [
      NgbActiveModal,
      DatePipe,
      ToolbarService,
      CommandColumnService,
      EditService,
      ExcelExportService,
    ]
})
export class BoarModule { }
