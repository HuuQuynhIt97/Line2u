import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { BomBoarComponent } from "./bom-boar/bom-boar.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BomBoarComponent,
        data: {
          title: '',
          module: 'bom-boar',
          breadcrumb: 'Bom Boar',
          functionCode: 'Bom Boar'
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
export class BomBoarRoutingModule { }
