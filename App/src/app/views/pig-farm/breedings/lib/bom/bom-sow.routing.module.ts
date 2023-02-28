import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { BomSowComponent } from "./bom-sow/bom-sow.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BomSowComponent,
        data: {
          title: '',
          module: 'bom-sow',
          breadcrumb: 'Bom Sow',
          functionCode: 'Bom Sow'
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
export class BomSowRoutingModule { }
