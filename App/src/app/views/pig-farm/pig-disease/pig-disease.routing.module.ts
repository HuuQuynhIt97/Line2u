import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { PigDiseaseComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: PigDiseaseComponent,
        data: {
          title: 'Pig Disease',
          module: 'pig-disease',
          breadcrumb: 'Pig Disease',
          functionCode: 'Pig Disease'
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
export class PigDiseaseRoutingModule { }
