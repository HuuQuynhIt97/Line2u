import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { RepairComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: RepairComponent,
        data: {
          title: 'Repair',
          module: 'repair',
          breadcrumb: 'Repair',
          functionCode: 'Repair'
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
export class RepairRoutingModule { }
