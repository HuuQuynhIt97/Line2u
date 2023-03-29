import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  BoarScreenComponent,
  FinisherScreenComponent,
  GiltScreenComponent,
  GrowerScreenComponent,
  NewboarScreenComponent,
  NurseryScreenComponent,
  SowScreenComponent,
  SucklingScreenComponent,
  PiglistScreenComponent,
  PiglistDetailScreenComponent,
} from ".";


const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'sow',
        component: SowScreenComponent,
        data: {
          title: 'Sow',
          breadcrumb: 'Sow',
          functionCode: 'Sow Mobile'

        }
        //canActivate: [AuthGuard]
      },
      {
        path: 'gilt',
        component: GiltScreenComponent,
        data: {
          title: 'Gilt',
          breadcrumb: 'Gilt',
          functionCode: 'Gilt Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'boar',
        component: BoarScreenComponent,
        data: {
          title: 'Boar',
          breadcrumb: 'Boar',
          functionCode: 'Boar Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'newboar',
        component: NewboarScreenComponent,
        data: {
          title: 'New Boar',
          breadcrumb: 'New Boar',
          functionCode: 'New Boar Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'suckling',
        component: SucklingScreenComponent,
        data: {
          title: 'Suckling',
          breadcrumb: 'Suckling',
          functionCode: 'Suckling Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'nursery',
        component: NurseryScreenComponent,
        data: {
          title: 'Nursery',
          breadcrumb: 'Nursery',
          functionCode: 'Nursery Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'grower',
        component: GrowerScreenComponent,
        data: {
          title: 'Grower',
          breadcrumb: 'Grower',
          functionCode: 'Grower Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'finisher',
        component: FinisherScreenComponent,
        data: {
          title: 'Finisher',
          breadcrumb: 'Finisher',
          functionCode: 'Finisher Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'piglist',
        component: PiglistScreenComponent,
        data: {
          title: 'Pig List',
          breadcrumb: 'Pig List',
          functionCode: 'Pig List Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'piglist/:type/:orderId',
        component: PiglistScreenComponent,
        data: {
          title: 'Pig List',
          breadcrumb: 'Pig List',
          functionCode: 'Pig List Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'piglist-detail/:type/:orderId/:id',
        component: PiglistDetailScreenComponent,
        data: {
          title: 'Pig Detail',
          breadcrumb: 'Pig Detail',
          functionCode: 'Pig Detail Mobile'

        },
        //canActivate: [AuthGuard]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PigDataRoutingModule { }
