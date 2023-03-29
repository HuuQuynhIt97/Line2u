import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RadioButtonModule, CheckBoxAllModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DatePickerAllModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { TreeViewAllModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { TreeGridAllModule } from '@syncfusion/ej2-angular-treegrid';




const EJ2_MODULE = [
  DropDownListModule,
  DatePickerAllModule,
  TreeGridAllModule,
  GridAllModule,
  RadioButtonModule,
  TooltipModule,
  CheckBoxAllModule,
  MultiSelectModule,
  TreeViewAllModule,
  ToolbarModule,
  SwitchModule
];

@NgModule({
 imports:      [

  ],
 declarations: [

  ],
 exports:      [
  ...EJ2_MODULE,
  TranslateModule
 ]
})
export class SharedModule {
  // 1 cach import khac cua module
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    }
  }
}
