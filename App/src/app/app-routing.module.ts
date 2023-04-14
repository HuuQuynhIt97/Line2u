import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ForgotUsernameComponent } from './views/forgot-username/forgot-username.component';
import { CheckOutComponent } from './views/home/home-store/check-out/check-out.component';
import { HomeStoreComponent } from './views/home/home-store/home-store.component';
import { OrderTrackingComponent } from './views/home/home-store/order-tracking/order-tracking.component';
import { ShopCartComponent } from './views/home/home-store/shop-cart/shop-cart.component';
import { BannerComponent } from './views/home/home-user-anonymous/banner/banner.component';
import { HelpGuidComponent } from './views/home/home-user-anonymous/help-guid/help-guid.component';
import { PrivacyComponent } from './views/home/home-user-anonymous/privacy/privacy.component';
import { UserNewsComponent } from './views/home/home-user-anonymous/user-news/user-news.component';
import { HomeComponent } from './views/home/home.component';
import { NewRoleDetailComponent } from './views/home/new-role/new-role-detail/new-role-detail.component';
import { NewsDetailComponent } from './views/home/news/news-detail/news-detail.component';
import { LayoutComponent } from './views/layout/layout/layout.component';
import { LoginComponent } from './views/login/login.component';
import { LineUserLoginComponent } from './views/mobile/lineUser-login/lineUser-login.component';
import { LineUserLoginFailComponent } from './views/mobile/lineUser-login/lineUserLoginFail/lineUserLoginFail.component';

import { P404Component } from './views/p404/p404.component';
import { P500Component } from './views/p500/p500.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { AuthGuard } from './_core/_guards/auth.guard';
import { SelectivePreloadingStrategyService } from './_core/_preloading/selective-preloading-strategy.service';
import { ListAllStoreComponent } from './views/home/list-all-store/list-all-store.component';

const routes: Routes = [
  // App routes goes here here
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'mobile',
    loadChildren: () =>
      import('./views/mobile/mobile.module').then(m => m.MobileModule)
  },
  {
    path: '',
    component: LayoutComponent,
    runGuardsAndResolvers: 'always',
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/evse/evse.module').then(m => m.EvseModule)
      },
      
      {
        path: '',
        loadChildren: () =>
          import('./views/pig-farm/pig-farm.module').then(m => m.PigFarmModule)
      }
      // {
      //   path: 'change-password',
      //   component: ChangePasswordComponent,
      //   data: {
      //     title: 'Change Password',
      //     module: 'Account',
      //     breadcrumb: 'Change Password',
      //     functionCode: 'Change Password'
      //   },
      //  canActivate: [AuthGuard]
      // },
    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password'
    }
  },
  {
    path: 'forgot-username',
    component: ForgotUsernameComponent,
    data: {
      title: 'Forgot Username'
    }
  },
  {
    path: 'reset-password',
    children: [
      {
        path: '',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password'
        }
      },
      {
        path: ':token',
        component: ResetPasswordComponent,
        data: {
          title: 'Reset Password'
        }
      },
    ]
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'admin/login',
    component: LoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'user-login',
    component: LineUserLoginComponent,
    data: {
      title: 'Login'
    }
  },
  {
    path: 'help-guid',
    component: HelpGuidComponent,
    data: {
      title: 'Help Guid'
    }
  },
  {
    path: 'banner',
    component: BannerComponent,
    data: {
      title: 'Banner'
    }
  },
  {
    path: 'user-new',
    component: UserNewsComponent,
    data: {
      title: 'User New'
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'Privacy'
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'home/news-detail/:id',
    component: NewsDetailComponent,
    data: {
      title: 'New Detail'
    }
  },
  {
    path: 'home/store/:storeName/:id',
    component: HomeStoreComponent,
    data: {
      title: 'Home Store'
    }
  },
  {
    path: 'home/store/:storeName/:id/:tableId/device',
    component: HomeStoreComponent,
    data: {
      title: 'Home Store'
    }
  },
  {
    path: 'home/store/shop-cart',
    component: ShopCartComponent,
    data: {
      title: 'Shop Cart'
    }
  },
  {
    path: 'home/list-all-store',
    component: ListAllStoreComponent,
    data: {
      title: 'List all store'
    }
  },
  {
    path: 'home/store/shop-cart/check-out/payment',
    component: CheckOutComponent,
    data: {
      title: 'Check out'
    }
  },
  {
    path: 'home/store/shop-cart/check-out/payment/:transactionId/:orderId',
    component: CheckOutComponent,
    data: {
      title: 'Check out'
    }
  },
  {
    path: 'home/store/order-tracking',
    component: OrderTrackingComponent,
    data: {
      title: 'Order Tracking'
    }
  },
  {
    path: 'home/news-role-detail/:id',
    component: NewRoleDetailComponent,
    data: {
      title: 'New Role Detail'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Not Found'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Server Error'
    }
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: false, // <-- debugging purposes only
    preloadingStrategy: SelectivePreloadingStrategyService,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
