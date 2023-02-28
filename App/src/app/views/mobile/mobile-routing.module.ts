import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';

import { LandlordRegisterComponent } from './landlord-register/landlord-register.component';
import { LandlordProfileComponent } from './landlord-profile/landlord-profile.component';

import { RepairScreenComponent } from './repair-screen/repair-screen.component';
import { ReportScreenComponent } from './report-screen/report-screen.component';
import { AccountScreenComponent } from './account-screen/account-screen.component';
import { LandlordLoginComponent } from './landlord-login/landlord-login.component';
import { LandlordDemoComponent } from './landlord-demo/landlord-demo.component';
import { FieldComponent } from './field/field.component';
import { FieldScreenDetailComponent } from './field/field-screen-detail/field-screen-detail.component';
import { BankAccountScreenComponent } from './account-screen/bank-account-screen/bank-account-screen.component';
import { BankAccountFinishScreenComponent } from './account-screen/bank-account-finish-screen/bank-account-finish-screen.component';
import { AlertScreenComponent } from './alert-screen/alert-screen.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    runGuardsAndResolvers: 'always',
    // canActivate: [AuthGuard],
    children: [
    
      {
        path: 'landlord-profile',
        component: LandlordProfileComponent,
        data: {
          title: 'Landlord Profile'
        }
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'home',
          breadcrumb: 'Home',
          functionCode: 'Home Mobile'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'repair',
        component: RepairScreenComponent,
        data: {
          title: 'Repair',
          breadcrumb: 'Repair',
          functionCode: 'Repair'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'field',
        component: FieldComponent,
        data: {
          title: 'Field',
          breadcrumb: 'Field',
          functionCode: 'Field'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'field/detail',
        component: FieldScreenDetailComponent,
        data: {
          title: 'Field Detail',
          breadcrumb: 'Field Detail',
          functionCode: 'Field Detail'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'field/detail/:guid',
        component: FieldScreenDetailComponent,
        data: {
          title: 'Field Detail',
          breadcrumb: 'Field Detail',
          functionCode: 'Field Detail'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'report',
        component: ReportScreenComponent,
        data: {
          title: 'Report',
          breadcrumb: 'Report',
          functionCode: 'Report'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'account',
        component: AccountScreenComponent,
        data: {
          title: 'Account',
          breadcrumb: 'Account',
          functionCode: 'Account'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'account/bank',
        component: BankAccountScreenComponent,
        data: {
          title: 'Bank Account',
          breadcrumb: 'Bank Account',
          functionCode: 'Bank Account'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'account/bank/finish',
        component: BankAccountFinishScreenComponent,
        data: {
          title: 'Bank Account',
          breadcrumb: 'Bank Account',
          functionCode: 'Bank Account'

        },
        //canActivate: [AuthGuard]
      },
      {
        path: 'alert',
        component: AlertScreenComponent,
        data: {
          title: 'Bank Account',
          breadcrumb: 'Bank Account',
          functionCode: 'Bank Account'

        },
        //canActivate: [AuthGuard]
      },
    ],

  },
  {
    path: 'landlord-login',
    component: LandlordLoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'login',
    component: LandlordLoginComponent,
    data: {
      title: 'Login',
      skip: 0
    }
  },
  {
    path: 'landlord-register',
    component: LandlordRegisterComponent,
    data: {
      title: 'Landlord Register'
    }
  },
  {
    path: 'landlord-demo',
    component: LandlordDemoComponent,
    data: {
      title: 'Landlord Demo'
    }
  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class MobileRoutingModule {}
