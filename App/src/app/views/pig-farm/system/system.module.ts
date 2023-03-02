import { CodeTypeComponent } from './code-type/code-type.component';
import { CodePermissionComponent } from './code-permission/code-permission.component';
import { SystemMenuReportConfigComponent } from './report-config/system-menu-report-config/system-menu-report-config.component';
import { ReportColumnConfigComponent } from './report-config/report-column-config/report-column-config.component';
import { ReportConfigComponent } from './report-config/report-config.component';
import { SystemLanguageComponent } from './system-language/system-language.component';
import { EmployeeComponent } from './employee/employee.component';
import { AccountComponent } from './account/account.component';
// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
// Components Routing

import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgbModule, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
// Import ngx-barcode module
import { SwitchModule, RadioButtonModule, CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';

import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { DatePipe } from '@angular/common';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

import { ToolbarModule, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid/';
import { TreeGrid, Page, Toolbar, Filter } from '@syncfusion/ej2-treegrid';
import { CountdownModule } from 'ngx-countdown';
import { CustomLoader } from 'src/app/_core/_helper/custom-loader';
import { CoreDirectivesModule } from 'src/app/_core/_directive/core.directives.module';
import { SystemRoutingModule } from './system.routing.module';
import { ImagesPipe } from 'src/app/_core/pipes/images.pipe';
import { SystemMenuComponent } from './system-menu/system-menu.component';
import { XAccountGroupComponent } from './xaccount-group/xaccount-group.component';
import { SystemComponent } from './system.component';
import { PrivilegeComponent } from './xaccount-group/privilege/privilege.component';
import { SharedModule } from 'src/app/_core/commons/shared.module';
import { ReportChartConfigComponent } from './report-chart-config/report-chart-config.component';
import { StoredProcedureConfigComponent } from './report-chart-config/stored-procedure-config/stored-procedure-config.component';
import { SystemMenuReportChartConfigComponent } from './report-chart-config/system-menu-report-chart-config/system-menu-report-chart-config.component';

import { SettingDashboardComponent } from './setting-dashboard/setting-dashboard.component';
import { SettingDashboardNormalComponent } from './setting-dashboard/setting-dashboard-normal/setting-dashboard-normal.component';
import { SettingDashboardChartComponent } from './setting-dashboard/setting-dashboard-chart/setting-dashboard-chart.component';
import { SettingDashboardTableComponent } from './setting-dashboard/setting-dashboard-table/setting-dashboard-table.component';
import { CreateDashboardComponent } from './setting-dashboard/create-dashboard/create-dashboard.component';
import { CreateAreaComponent } from './setting-dashboard/create-area/create-area.component';
import { ApplyOrderConfigComponent, ColumnConfigComponent } from './apply-order-config';
import { PigfarmCoreModule } from 'herr-core';
import { environment } from 'src/environments/environment';
declare var require: any;
import { L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/en/ca-gregorian.json'),
  require('cldr-data/main/en/numbers.json'),
  require('cldr-data/main/en/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json')); // To load the culture based first day of week
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
    
TreeGrid.Inject(Page, Toolbar, Filter);
const REPORT_COMPONENT = [
  ReportConfigComponent,
  ReportChartConfigComponent,
  StoredProcedureConfigComponent,
  ReportColumnConfigComponent,
  SystemMenuReportConfigComponent,
  SystemMenuReportChartConfigComponent

]
const APPLY_ORDER_COMPONENT = [
  ColumnConfigComponent,
  ApplyOrderConfigComponent

]
const IMG_PIPE = [
  ImagesPipe,
]
@NgModule({
  providers: [
    DatePipe,
    NgbTooltipConfig
  ],
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    NgbModule,
    CountdownModule,
    CoreDirectivesModule,
    SystemRoutingModule,
    ColorPickerModule,
    SharedModule.forRoot(),
    PigfarmCoreModule.forRoot(environment.apiUrl),
  ],
  declarations: [
    ...IMG_PIPE,
    AccountComponent,
    PrivilegeComponent,
    SystemComponent,
    XAccountGroupComponent,
    EmployeeComponent,
    SystemLanguageComponent,
    SystemMenuComponent,
    CodePermissionComponent,
    ...REPORT_COMPONENT,
    ...APPLY_ORDER_COMPONENT,
    CodeTypeComponent,
    SettingDashboardComponent,
    SettingDashboardChartComponent,
    SettingDashboardTableComponent,
    SettingDashboardNormalComponent,
    CreateDashboardComponent,
    CreateAreaComponent,
  ]
})
export class SystemModule {
  constructor() {
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
        "multi-select": languages["multiselect"],
        "drop-down-list": languages["multiselect"]
      }
     
    };
    L10n.load(load);
  }
 }