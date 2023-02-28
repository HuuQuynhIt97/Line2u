import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { SaleOrderComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
       component: SaleOrderComponent,
        data: {
          title: 'Sale Order',
          module: 'sale-order',
          breadcrumb: 'Sale Order',
          functionCode: 'Sale Order'
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
export class SaleOrderRoutingModule { }
