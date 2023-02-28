import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BoarSiloComponent } from './boar-silo/boar-silo.component';
import { BoarFeedingComponent } from './boar-feeding/boar-feeding.component';
import { BoarHeatingComponent } from './boar-heating/boar-heating.component';
import { BoarRideComponent } from './boar-ride/boar-ride.component';
import { BoarRotationComponent } from './boar-rotation/boar-rotation.component';
import { BoarSemenMixComponent } from './boar-semen-mix/boar-semen-mix.component';
import { BoarTestingComponent } from './boar-testing/boar-testing.component';
import { BoarSemenTestingComponent } from './boar-semen-testing/boar-semen-testing.component';
import { BoarQuarantineComponent } from "./boar-quarantine/boar-quarantine.component";
import { NewBoarInComponent } from "./new-boar-in/new-boar-in.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "boar-silo",
        component: BoarSiloComponent,
        data: {
          title: "Boar Silo",
          module: "breeding",
          breadcrumb: "Boar Silo",
          functionCode: "Boar Silo",
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-feeding",
        component: BoarFeedingComponent,
        data: {
          title: "Boar Feeding",
          module: "breeding",
          breadcrumb: "Boar Feeding",
          functionCode: "Boar Feeding"
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-heating",
        component: BoarHeatingComponent,
        data: {
          title: "Boar Heating",
          module: "breeding",
          breadcrumb: "Boar Heating",
          functionCode: "Boar Heating"
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-ride",
        component: BoarRideComponent,
        data: {
          title: "Boar Ride",
          module: "breeding",
          breadcrumb: "Boar Ride",
          functionCode: "Boar Ride",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-rotation",
        component: BoarRotationComponent,
        data: {
          title: "Boar Rotation",
          module: "breeding",
          breadcrumb: "Boar Rotation",
          functionCode: "Boar Rotation",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-semen-mix",
        component: BoarSemenMixComponent,
        data: {
          title: "Boar Semen Mix",
          module: "breeding",
          breadcrumb: "Boar Semen Mix",
          functionCode: "Boar Semen Mix",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-testing",
        component: BoarTestingComponent,
        data: {
          title: "Boar Testing",
          module: "breeding",
          breadcrumb: "Boar Testing",
          functionCode: "Boar Testing",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-semen-testing",
        component: BoarSemenTestingComponent,
        data: {
          title: "Boar Semen Testing",
          module: "breeding",
          breadcrumb: "Boar Semen Testing",
          functionCode: "Boar Semen Testing",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "boar-quarantine",
        component: BoarQuarantineComponent,
        data: {
          title: "Boar Quarantine",
          module: "breeding",
          breadcrumb: "Boar Quarantine",
          functionCode: "Boar Quarantine",
          
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "new-boar-in",
        component: NewBoarInComponent,
        data: {
          title: "New BoarIn",
          module: "breeding",
          breadcrumb: "New BoarIn",
          functionCode: "New BoarIn",
          
        },
        //canActivate: [AuthGuard],
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoarRoutingModule {}
