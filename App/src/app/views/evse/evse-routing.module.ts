
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_core/_guards/auth.guard';
import { EngineerComponent } from './engineer/engineer.component';
import { HomeComponent } from './home/home.component';
import { LandlordComponent } from './landlord/landlord.component';
import { MemberComponent } from './member/member.component';
import { StationComponent } from './station/station.component';
import { BankComponent } from './bank/bank.component';
import { ContractComponent } from './contract/contract.component';
import { WebBannerComponent } from './web-banner/web-banner.component';
import { WebNewsComponent } from './web-news/web-news.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { AdminRestaurantComponent } from '../mobile/admin-restaurant/admin-restaurant.component';
import { AdminAddRestaurantComponent } from '../mobile/admin-add-restaurant/admin-add-restaurant.component';
import { AdminUpdateRestaurantComponent } from '../mobile/admin-add-restaurant/admin-update-restaurant/admin-update-restaurant.component';


const routes: Routes = [
  {
    path: 'line2u/google-map',
    component: GoogleMapComponent,
    data: {
      title: 'Google Map',
      breadcrumb: 'Google Map',
      functionCode: 'Google Map'
    },
  //  canActivate: [AuthGuard]
  },
  {
    path: 'line2u/restaurant',
    component: AdminRestaurantComponent,
    data: {
      title: 'Restaurant',
    },
  },
  {
    path: 'line2u/add-restaurant',
    component: AdminAddRestaurantComponent,
    data: {
      title: 'Add restaurant',
    },
  },
  {
    path: 'line2u/update-restaurant/:id',
    component: AdminUpdateRestaurantComponent,
    data: {
      title: 'Add update restaurant',
    },
  },
  {
  path: 'line2u/home',
  component: HomeComponent,
    data: {
      title: 'Home',
      breadcrumb: 'Home',
      functionCode: 'Home'
    },
  },
  {
    path: 'line2u/home/:token',
    component: HomeComponent,
      data: {
        title: 'Home',
        breadcrumb: 'Home',
        functionCode: 'Home'
      },
    },
  {
    path: 'line2u/site',
    component: StationComponent,
    data: {
      title: 'Site',
      breadcrumb: 'Site',
      functionCode: 'Site'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/landlord',
    component: LandlordComponent,
    data: {
      title: 'Landlord',
      breadcrumb: 'Landlord',
      functionCode: 'Landlord'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/member',
    component: MemberComponent,
    data: {
      title: 'Member',
      breadcrumb: 'Member',
      functionCode: 'Member'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/engineer',
    component: EngineerComponent,
    data: {
      title: 'Engineer',
      breadcrumb: 'Engineer',
      functionCode: 'Engineer'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/web-banner',
    component: WebBannerComponent,
    data: {
      title: 'Web Banner',
      breadcrumb: 'Web Banner',
      functionCode: 'WebBanner'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/bank',
    component: BankComponent,
    data: {
      title: 'Bank',
      breadcrumb: 'Bank',
      functionCode: 'Bank'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/contract',
    component: ContractComponent,
    data: {
      title: 'Contract',
      breadcrumb: 'Contract',
      functionCode: 'Contract'
    },
   canActivate: [AuthGuard]
  },
  {
    path: 'line2u/web-news',
    component: WebNewsComponent,
    data: {
      title: 'Web News',
      breadcrumb: 'Web News',
      functionCode: 'WebNews'
    },
   canActivate: [AuthGuard]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvseRoutingModule { }
