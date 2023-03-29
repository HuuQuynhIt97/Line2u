
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_core/_guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomerComponent } from './customer/customer.component';
import { SystemConfigComponent } from './system/system-config/system-config.component';
import { environment } from 'src/environments/environment';
const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      title: 'Customer',
      breadcrumb: 'Customer',
      functionCode: 'Customer'
    },
    canActivate: [AuthGuard]
  },
   {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
   // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/:guid',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile',
      breadcrumb: 'Profile',
      functionCode: 'Profile'

    },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    children: [
      {
        path: 'system-config',
        component: SystemConfigComponent,
        data: {
          title: 'System Config',
          breadcrumb: 'System Config',
          functionCode: 'System Config'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'system',
        data: {
          title: 'system',
          module: 'system',
          breadcrumb: 'System',
          root: true
        },
        loadChildren: () => import('./system/system.module').then(m => m.SystemModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'farm',
        data: {
          title: 'Farm',
          module: 'Farm',
          breadcrumb: 'Farm',
          root: true
        },
        loadChildren: () => import('./farm/farm.module').then(m => m.FarmModule)
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PigFarmRoutingModule { }
