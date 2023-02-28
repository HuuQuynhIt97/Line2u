import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { EditRecordDeathComponent } from "./edit-record-death/edit-record-death.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'record-death/edit/:guid',
        component: EditRecordDeathComponent,
        data: {
          title: 'Record Death Edit',
          module: 'edit-page-dashboard',
          breadcrumb: 'Record Death Edit',
        },
       //canActivate: [AuthGuard]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPageDashboardRoutingModule { }
