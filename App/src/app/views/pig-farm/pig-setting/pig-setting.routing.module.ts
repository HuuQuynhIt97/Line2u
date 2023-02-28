import { PigPedigreeComponent } from './pig-pedigree/pig-pedigree.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PigComponent } from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'pig',
        component: PigComponent,
        data: {
          title: 'Pig',
          module: 'pig',
          breadcrumb: 'Pig',
          functionCode: 'Pig'
        },
       //canActivate: [AuthGuard]
      },
       {
        path: 'pig-pedigree',
        component: PigPedigreeComponent,
        data: {
          title: 'Pig Pedigree',
          module: 'pig-pedigree',
          breadcrumb: 'Pig Pedigree',
          functionCode: 'Pig Pedigree'
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
export class PigSettingRoutingModule { }
