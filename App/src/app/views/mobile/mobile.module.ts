import { SharedModule } from 'src/app/_core/commons/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaService, DayService, MonthAgendaService, MonthService, ScheduleModule, WeekService, WorkWeekService } from '@syncfusion/ej2-angular-schedule';


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




// module
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { MobileComponent } from './mobile.component';
import { MobileRoutingModule } from './mobile-routing.module';
import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { MenuAllModule, SidebarModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';

import { SigninScreenComponent } from './signin-screen/signin-screen.component';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
import { AccountScreenComponent } from './account-screen/account-screen.component';
import { LandlordProfileComponent } from './landlord-profile/landlord-profile.component';
import { LandlordDemoComponent } from './landlord-demo/landlord-demo.component';
import { LandlordLoginComponent } from './landlord-login/landlord-login.component';
import { LandlordRegisterComponent } from './landlord-register/landlord-register.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoader } from 'src/app/_core/_helper/custom-loader';
import { FieldComponent } from './field/field.component';
import { FieldScreenDetailComponent } from './field/field-screen-detail/field-screen-detail.component';
import { BankAccountScreenComponent } from './account-screen/bank-account-screen/bank-account-screen.component';
import { BankAccountFinishScreenComponent } from './account-screen/bank-account-finish-screen/bank-account-finish-screen.component';
import { AlertScreenComponent } from './alert-screen/alert-screen.component';
import { ReportScreenComponent } from './report-screen/report-screen.component';
import { loadCldr, setCulture, L10n } from '@syncfusion/ej2-base';
let lang = localStorage.getItem('lang');
if (!lang) {
  localStorage.setItem('lang', 'tw');
  lang = localStorage.getItem('lang');
}
declare var require: any;
setCulture(lang == 'tw' || lang == 'cn' ? 'zh' : lang);
let languages = JSON.parse(localStorage.getItem('languages'));

let load = {
  [lang]: {
    grid: languages['grid'],
    pager: languages['pager'],
    dropdowns: languages['dropdownlist'],
    schedule: languages['schedule']
  }
};
L10n.load(load);
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); 

loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/zh/ca-gregorian.json'),
  require('cldr-data/main/zh/numbers.json'),
  require('cldr-data/main/zh/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); 

  loadCldr(
    require('cldr-data/supplemental/numberingSystems.json'),
    require('cldr-data/main/vi/ca-gregorian.json'),
    require('cldr-data/main/vi/numbers.json'),
    require('cldr-data/main/vi/timeZoneNames.json'),
    require('cldr-data/supplemental/weekdata.json'));

    
@NgModule({
  declarations: [
    MobileComponent,
    LayoutComponent,
    HomeComponent,
    SigninScreenComponent,
    AccountScreenComponent,
    LandlordProfileComponent,
    LandlordDemoComponent,
    LandlordLoginComponent,
    LandlordRegisterComponent,
    FieldComponent,
    FieldScreenDetailComponent,
    BankAccountScreenComponent,
    BankAccountFinishScreenComponent,
    AlertScreenComponent,
    ReportScreenComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    MobileRoutingModule,
    NgbModule,
    DatePickerAllModule,
    CoreDirectivesModule,
    SidebarModule,
    MenuAllModule,
    ScheduleModule,
    SharedModule.forRoot(),
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useClass: CustomLoader},
      defaultLanguage: lang
    }),
    PigfarmCoreModule.forRoot(environment.apiUrl),
  ],
  providers: [
    DatePipe,
    DayService, 
    WeekService, 
    WorkWeekService, 
    MonthService,
    AgendaService,
    MonthAgendaService
  ]
})
export class MobileModule {
}
