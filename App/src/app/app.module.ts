export interface BomSowDto {
  id: number;
  bomNo: string;
  bomName: string;
  bomVersion: string;
  bomBreed: string;
  bomType: string;
  sowHeatingStartDate: number | null;
  sowHeatingEndDate: number | null;
  sowMatingStartDate: number | null;
  sowMatingEndDate: number | null;
  sowPregnancyTest1StartDate: number | null;
  sowPregnancyTest1EndDate: number | null;
  sowMoveStartDate: number | null;
  sowMoveEndDate: number | null;
  sowPregnancyTest2StartDate: number | null;
  sowPregnancyTest2EndDate: number | null;
  sowBodyConditionStartDate: number | null;
  sowBodyConditionEndDate: number | null;
  sowPreFarrowStartDate: number | null;
  sowPreFarrowEndDate: number | null;
  sowFarrowStartDate: number | null;
  sowFarrowEndDate: number | null;
  sowMilkingStartDate: number | null;
  sowMilkingEndDate: number | null;
  sowWeaningStartDate: number | null;
  sowWeaningEndDate: number | null;
  pregnancyFeed1StartDate: number | null;
  pregnancyFeed1EndDate: number | null;
  pregnancyFeed1Amount: number | null;
  pregnancyFeed2StartDate: number | null;
  pregnancyFeed2EndDate: number | null;
  pregnancyFeed2Amount: number | null;
  pregnancyFeed3StartDate: number | null;
  pregnancyFeed3EndDate: number | null;
  pregnancyFeed3Amount: number | null;
  sucklingTeachingSlotStartDate: number | null;
  sucklingTeachingSlotEndDate: number | null;
  sucklingTeachingSlotAmount: number | null;
  comment: string;
  cancelFlag: string;
  createDate: string | null;
  createBy: number | null;
  updateDate: string | null;
  updateBy: number | null;
  status: number | null;
  guid: string;
  typeName: string;
}import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { ForgotUsernameComponent } from './views/forgot-username/forgot-username.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { HomeComponent } from './views/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './views/layout/layout/layout.component';
import { HeaderComponent } from './views/layout/header/header.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { BreadcrumbComponent } from './views/layout/breadcrumb/breadcrumb.component';
import { LoginComponent } from './views/login/login.component';

import { P404Component } from './views/p404/p404.component';
import { P500Component } from './views/p500/p500.component';

// service
import { AlertifyService } from './_core/_service/alertify.service';
import { AuthService } from './_core/_service/auth.service';
import { AuthGuard } from './_core/_guards/auth.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
// handle err
import { ErrorInterceptorProvider } from './_core/_helper/error.interceptor';
import { L10n, setCulture } from "@syncfusion/ej2-base";

export function tokenGetter() {
  const token = localStorage.getItem('token');
  let pattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  let result = pattern.test(token);
  if (result) {
    return token;
  }
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refresh-token');
  localStorage.removeItem('login-event');
  localStorage.removeItem('functions');
  localStorage.removeItem('menuItem');
  localStorage.removeItem('farmGuid');
  localStorage.removeItem('menus');
  return '';
}
// resolvers


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SafePipeModule } from 'safe-pipe';


// module
import { MomentModule } from 'ngx-moment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BasicAuthInterceptor } from './_core/_helper/basic-auth.interceptor';

import { CoreModule } from './_core/core.module';
import { VersionCheckService } from './_core/_service/version-check.service';
import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoader } from './_core/_helper/custom-loader';
import { AccumulationChartAllModule, CategoryService, ChartAllModule, ChartModule, ColumnSeriesService, LegendService } from '@syncfusion/ej2-angular-charts';
import { DashboardService } from './_core/_service/dashboard.service';
import { MyCheckboxComponent, PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from './_core/_service/apply-orders/auto-log-off.service';
import { NavbarComponent } from './views/layout/navbar/navbar.component';
import { NewsComponent } from './views/home/news/news.component';
import { NewRoleComponent } from './views/home/new-role/new-role.component';
import { SwiperModule } from 'swiper/angular';
import { NewsDetailComponent } from './views/home/news/news-detail/news-detail.component';
import { CoreDirectivesModule } from './_core/_directive/core.directives.module';
import { HomeUserAnonymousComponent } from './views/home/home-user-anonymous/home-user-anonymous.component';
import { BannerComponent } from './views/home/home-user-anonymous/banner/banner.component';
import { UserNewsComponent } from './views/home/home-user-anonymous/user-news/user-news.component';
import { PrivacyComponent } from './views/home/home-user-anonymous/privacy/privacy.component';
import { HelpGuidComponent } from './views/home/home-user-anonymous/help-guid/help-guid.component';
import { HomeStoreListComponent } from './views/home/home-store-list/home-store-list.component';
import { HomeStoreComponent } from './views/home/home-store/home-store.component';
import { Common2Module } from './_core/commons/common2.module';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ShopCartComponent } from './views/home/home-store/shop-cart/shop-cart.component';
import { CheckOutComponent } from './views/home/home-store/check-out/check-out.component';
import { OrderTrackingComponent } from './views/home/home-store/order-tracking/order-tracking.component';
import { HomeHeaderComponent } from './views/home/home-header/home-header.component';
import { AdvertisementbannerComponent } from './views/layout/advertisementbanner/advertisementbanner.component';
import { Advertisementbanner1Component } from './views/layout/advertisementbanner1/advertisementbanner1.component';
import { Advertisementbanner2Component } from './views/layout/advertisementbanner2/advertisementbanner2.component';
import { Footer1Component } from './views/layout/footer1/footer1.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { Footer2Component } from './views/layout/footer2/footer2.component';
import { RestaurantrightsidebarComponent } from './views/layout/restaurantrightsidebar/restaurantrightsidebar.component';
import { RestaurantleftsidebarComponent } from './views/layout/restaurantleftsidebar/restaurantleftsidebar.component';
import { ToastrModule } from 'ngx-toastr';
import { NavbarAdminComponent } from './views/layout/navbarAdmin/navbarAdmin.component';
import { DateAgoPipe } from './_core/pipes/date-ago.pipe';
let lang = localStorage.getItem('lang');
if (!lang) {
  localStorage.setItem('lang', 'tw');
  lang = localStorage.getItem('lang');
}
@NgModule({
  declarations: [
    DateAgoPipe,
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    LoginComponent,
    P404Component,
    P500Component,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ForgotUsernameComponent,
    NavbarComponent,
    NewsComponent,
    NewRoleComponent,
    NewsDetailComponent,
    HomeUserAnonymousComponent,
    BannerComponent,
    UserNewsComponent,
    PrivacyComponent,
    HelpGuidComponent,
    HomeStoreListComponent,
    HomeStoreComponent,
    ShopCartComponent,
    CheckOutComponent,
    OrderTrackingComponent,
    HomeHeaderComponent,
    AdvertisementbannerComponent,
    Advertisementbanner1Component,
    Advertisementbanner2Component,
    Footer1Component,
    Footer2Component,
    RestaurantrightsidebarComponent,
    RestaurantleftsidebarComponent,
    NavbarAdminComponent

  ],
  imports: [
    BrowserModule,
    Common2Module,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    // ToastrModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    CommonModule,
    HttpClientModule,
    SafePipeModule,
    MomentModule,
    InfiniteScrollModule,
    CoreModule,
    NgxSpinnerModule,
    NgbModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ChartAllModule,
    GridAllModule,
    CheckBoxAllModule,
    // CoreDirectivesModule,
    AccumulationChartAllModule,
    SwiperModule,
    PigfarmCoreModule.forRoot(environment.apiUrl),
    JwtModule.forRoot({
      config: {
        tokenGetter
      }
    }),
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useClass: CustomLoader},
      defaultLanguage: lang
    }),
    SharedModule.forRoot()
  ],
  providers: [
    CategoryService, LegendService, ColumnSeriesService,
    AutoLogoutService,
    NgbTooltipConfig,
    AuthGuard,
    AlertifyService,
    VersionCheckService,
    ErrorInterceptorProvider,
    AuthService,
    DatePipe,
    Location, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    DashboardService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    let lang = localStorage.getItem("lang");
    setCulture(lang);
  }
}

