import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { RequisitionComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: RequisitionComponent,
        data: {
          title: 'Requisition',
          module: 'requisition',
          breadcrumb: 'Requisition',
          functionCode: 'Requisition'
        },
       canActivate: [AuthGuard]
      }

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequisitionRoutingModule { }
