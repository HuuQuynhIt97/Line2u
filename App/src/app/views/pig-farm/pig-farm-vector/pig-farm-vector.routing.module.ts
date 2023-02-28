import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { PigFarmVectorComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: PigFarmVectorComponent,
        data: {
          title: 'Pig Farm Vector',
          module: 'pig-farm-vector',
          breadcrumb: 'Pig Farm Vector',
          functionCode: 'Pig Farm Vector'
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
export class PigFarmVectorRoutingModule { }
