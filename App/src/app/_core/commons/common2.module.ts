import { ModuleWithProviders, NgModule } from '@angular/core';
import { DropDownListModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaskedTextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';

import { MyCheckboxComponent } from '../_component/my-checkbox/my-checkbox.component';
import { CheckBoxAllModule } from '@syncfusion/ej2-angular-buttons';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { MyCodeTypeDropdownlistComponent } from '../_component/my-checkbox/my-code-type-dropdownlist/my-code-type-dropdownlist.component';


@NgModule({
  imports: [
    DropDownListModule,
    FormsModule,
    ReactiveFormsModule,
    MaskedTextBoxModule,
    CheckBoxAllModule,
    TranslateModule,
    GridAllModule,
    MultiSelectAllModule
  ],
  declarations: [
    MyCheckboxComponent,
    MyCodeTypeDropdownlistComponent

  ],
  exports: [
    MyCodeTypeDropdownlistComponent,
    MyCheckboxComponent,

  ]
})
export class Common2Module {
  // 1 cach import khac cua module
  static forRoot(): ModuleWithProviders<Common2Module> {
    return {
      ngModule: Common2Module
    }
  }
}
