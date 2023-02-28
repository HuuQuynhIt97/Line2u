import { FarmParentComponent } from './farm-parent/farm-parent.component';
import { CullingTankComponent } from './culling-tank/culling-tank.component';
import { PenComponent } from './pen/pen.component';
import { RoomComponent } from './room/room.component';
import { BarnComponent } from './barn/barn.component';
import { AreaComponent } from './area/area.component';

// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing
import { FarmRoutingModule } from './farm.routing.module';

import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
// Import ngx-barcode module

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';


import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { DatePipe } from '@angular/common';

import { InfiniteScrollService } from '@syncfusion/ej2-angular-grids';


import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { FarmComponent } from './farm/farm.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { environment } from 'src/environments/environment';
import { PigfarmCoreModule } from 'herr-core';


const ROUTING_MODULE = [
  FarmRoutingModule
];

const FARM_COMPONENT = [
FarmComponent,
AreaComponent,
BarnComponent,
RoomComponent,
PenComponent,
CullingTankComponent,
FarmParentComponent
]
@NgModule({
  providers: [
    DatePipe,
    InfiniteScrollService,
    NgbTooltipConfig
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule,
    CoreDirectivesModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
    ...ROUTING_MODULE
  ],
  declarations: [
    ...FARM_COMPONENT
  ]
})
export class FarmModule {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';

  constructor(config: NgbTooltipConfig
    ) {
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }
}
