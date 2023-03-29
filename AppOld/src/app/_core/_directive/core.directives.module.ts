import { NgModule } from '@angular/core';
import { PermissionDirective } from './permission.directive';
import { ChatBoxDirective } from './chatBox.directive';
@NgModule({
  imports: [],
  declarations: [	PermissionDirective,
      ChatBoxDirective
   ],
  exports: [
    PermissionDirective,
    ChatBoxDirective
  ]
})
export class CoreDirectivesModule {}

