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
import { LineUserLoginComponent } from './lineUser-login/lineUser-login.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserBannerComponent } from './user-banner/user-banner.component';
import { MobileUserNewsComponent } from './mobile-user-news/mobile-user-news.component';
import { StoreProfileComponent } from './store-profile/store-profile.component';
import { MenuCategoryComponent } from './menu-category/menu-category.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { UserHelpComponent } from './user-help/user-help.component';
import { UserContactComponent } from './user-contact/user-contact.component';
import { MobileCartOrderComponent } from './mobile-cart-order/mobile-cart-order.component';
import { CartOrderDetailComponent } from './mobile-cart-order/cart-order-detail/cart-order-detail.component';
import { HomeBossUpdateRestaurantComponent } from './home/home-boss-update-restaurant/home-boss-update-restaurant.component';
import { HomeBossCartComponent } from './home/home-boss-cart/home-boss-cart.component';

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
        path: 'store-profile',
        component: StoreProfileComponent,
        data: {
          title: 'Store Profile'
        }
      },
      {
        path: 'menu-category',
        component: MenuCategoryComponent,
        data: {
          title: 'Menu Category'
        }
      },

      {
        path: 'products-list',
        component: MenuListComponent,
        data: {
          title: 'Products List'
        }
      },
      {
        path: 'home-boss-update/:id',
        component: HomeBossUpdateRestaurantComponent,
        data: {
          title: 'Home Boss restaurant'
        }
      },
      {
        path: 'cart-order',
        component: MobileCartOrderComponent,
        data: {
          title: 'Cart Order'
        }
      },
      {
        path: 'home-boss/cart-order',
        component: HomeBossCartComponent,
        data: {
          title: 'Home Boss Cart Order'
        }
      },

      {
        path: 'home-boss/cart-order/:id',
        component: MobileCartOrderComponent,
        data: {
          title: 'Cart Order'
        }
      },
      {
        path: 'cart-order-detail/:id',
        component: CartOrderDetailComponent,
        data: {
          title: 'Cart Order Detail'
        }
      },
      {
        path: 'user-help',
        component: UserHelpComponent,
        data: {
          title: 'User Help'
        }
      },
      {
        path: 'user-contact',
        component: UserContactComponent,
        data: {
          title: 'User Contact'
        }
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        data: {
          title: 'User Profile'
        }
      },
      {
        path: 'banner',
        component: UserBannerComponent,
        data: {
          title: 'Mobile Banner'
        }
      },
      {
        path: 'news',
        component: MobileUserNewsComponent,
        data: {
          title: 'Mobile News'
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
        path: 'send-message',
        component: SendMessageComponent,
        data: {
          title: 'Send Message'
        }
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
    path: 'userLine-login',
    component: LineUserLoginComponent,
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
