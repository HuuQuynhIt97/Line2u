import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { RfidComponent, SemenComponent, SemenMixComponent, TreatmentMasterComponent } from '.';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'semen',
        component: SemenComponent,
        data: {
          title: 'Semen',
          module: 'inventory2',
          breadcrumb: 'Semen',
          functionCode: 'Semen'
        },
       //canActivate: [AuthGuard]
      },
      {
        path: 'semen-mix',
        component: SemenMixComponent,
        data: {
          title: 'Semen Mix',
          module: 'inventory2',
          breadcrumb: 'Semen Mix',
          functionCode: 'Semen Mix'
        },
      // canActivate: [AuthGuard]
      },
      {
        path: 'rfid',
        component: RfidComponent,
        data: {
          title: 'RFID',
          module: 'inventory2',
          breadcrumb: 'RFID',
          functionCode: 'RFID'
        },
       //canActivate: [AuthGuard]
      },
      {
        path: 'treatment',
        component: TreatmentMasterComponent,
        data: {
          title: 'Treatment',
          module: 'inventory2',
          breadcrumb: 'Treatment',
          functionCode: 'Treatment'
        },
       //canActivate: [AuthGuard]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Inventory2RoutingModule { }
