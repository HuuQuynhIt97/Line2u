import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { AcceptanceComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: AcceptanceComponent,
        data: {
          title: 'Acceptance',
          module: 'acceptance',
          breadcrumb: 'Acceptance',
          functionCode: 'Acceptance'
        },
       // canActivate: [AuthGuard]
      }

    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcceptanceRoutingModule { }
