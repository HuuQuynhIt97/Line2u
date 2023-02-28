import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { BomComponent } from "./bom/bom.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'producer',
        component: BomComponent,
        data: {
          title: 'Producer BOM',
          module: 'bom',
          breadcrumb: 'Producer BOM',
          functionCode: 'Producer BOM'
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
export class BOMRoutingModule { }
