import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { BomGiltComponent } from "./bom-gilt/bom-gilt.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BomGiltComponent,
        data: {
          title: '',
          module: 'bom-gilt',
          breadcrumb: 'Bom Gilt',
          functionCode: 'Bom Gilt'
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
export class BomGiltRoutingModule { }
