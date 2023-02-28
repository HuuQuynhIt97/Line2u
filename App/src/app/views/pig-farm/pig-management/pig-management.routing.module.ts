import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import {
  BoarComponent,
  NewBoarComponent,
  FinisherComponent,
  GrowerComponent,
  GiltComponent,
  SowComponent,
  NurseryComponent,
  SucklingComponent } from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'nursery',
        component: NurseryComponent,
        data: {
          title: 'Nursery',
          module: 'pig-management',
          breadcrumb: 'Nursery',
          functionCode: 'Nursery'
        },
       //canActivate: [AuthGuard]
      },
      {
        path: 'finisher',
        component: FinisherComponent,
        data: {
          title: 'Finisher',
          module: 'pig-management',
          breadcrumb: 'Finisher',
          functionCode: 'Finisher'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'grower',
        component: GrowerComponent,
        data: {
          title: 'Grower',
          module: 'pig-management',
          breadcrumb: 'Grower',
          functionCode: 'Grower'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'sow',
        component: SowComponent,
        data: {
          title: 'Sow',
          module: 'pig-management',
          breadcrumb: 'Sow',
          functionCode: 'Sow'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'gilt',
        component: GiltComponent,
        data: {
          title: 'Gilt',
          module: 'pig-management',
          breadcrumb: 'Gilt',
          functionCode: 'Gilt'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'boar',
        component: BoarComponent,
        data: {
          title: 'Boar',
          module: 'pig-management',
          breadcrumb: 'Boar',
          functionCode: 'Boar'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'new-boar',
        component: NewBoarComponent,
        data: {
          title: 'New Boar',
          module: 'pig-management',
          breadcrumb: 'New Boar',
          functionCode: 'New Boar'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'suckling',
        component: SucklingComponent,
        data: {
          title: 'Suckling',
          module: 'pig-management',
          breadcrumb: 'Suckling',
          functionCode: 'Suckling'
        },
       canActivate: [AuthGuard]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordRoutingModule { }
