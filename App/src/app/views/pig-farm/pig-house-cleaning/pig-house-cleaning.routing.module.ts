import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { PigHouseCleaningComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: PigHouseCleaningComponent,
        data: {
          title: 'Pig House Cleaning',
          module: 'pig-house-cleaning',
          breadcrumb: 'Pig House Cleaning',
          functionCode: 'Pig House Cleaning'
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
export class PigHouseCleaningRoutingModule { }
