import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { BioSecurityComponent} from ".";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'sow',
       component: BioSecurityComponent,
        data: {
          pigType: 'Sow',
          title: 'Sow',
          module: 'bio-security',
          breadcrumb: 'Sow',
          functionCode: 'BioS-Sow'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'boar',
       component: BioSecurityComponent,
        data: {
          title: 'Boar',
          pigType: 'Boar',
          module: 'bio-security',
          breadcrumb: 'Boar',
          functionCode: 'BioS-Boar'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'new-boar',
       component: BioSecurityComponent,
        data: {
          title: 'New Boar',
          pigType: 'New Boar',
          module: 'bio-security',
          breadcrumb: 'New Boar',
          functionCode: 'BioS-NewBoar'
        },
       canActivate: [AuthGuard]
      },
        {
        path: 'gilt',
       component: BioSecurityComponent,
        data: {
          title: 'Gilt',
          pigType: 'Gilt',
          module: 'bio-security',
          breadcrumb: 'Gilt',
          functionCode: 'BioS-Gilt'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'suckling',
       component: BioSecurityComponent,
        data: {
          title: 'Suckling',
          pigType: 'Suckling',
          module: 'bio-security',
          breadcrumb: 'Suckling',
          functionCode: 'BioS-Suckling'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'pig',
       component: BioSecurityComponent,
        data: {
          title: 'Pig',
          pigType: 'Pig',
          module: 'bio-security',
          breadcrumb: 'Pig',
          functionCode: 'BioS-Pig'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'nursery',
       component: BioSecurityComponent,
        data: {
          title: 'Nursery',
          pigType: 'Nursery',
          module: 'bio-security',
          breadcrumb: 'Nursery',
          functionCode: 'BioS-Nursery'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'finisher',
       component: BioSecurityComponent,
        data: {
          title: 'Finisher',
          pigType: 'Finisher',
          module: 'bio-security',
          breadcrumb: 'Finisher',
          functionCode: 'BioS-Finisher'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'grower',
       component: BioSecurityComponent,
        data: {
          title: 'Grower',
          pigType: 'Grower',
          module: 'bio-security',
          breadcrumb: 'Grower',
          functionCode: 'BioS-Grower'
        },
       canActivate: [AuthGuard]
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BioSecurityRoutingModule { }
