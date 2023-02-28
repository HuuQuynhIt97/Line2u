import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { ExeRecordCullingComponent, ExeRecordDeathComponent, ExeRecordDiagnosisComponent, ExeRecordDisinfectionComponent, ExeRecordDonateComponent, ExeRecordEarTagComponent, ExeRecordFeedingComponent, ExeRecordGeneralComponent, ExeRecordImmunizationComponent, ExeRecordInOutComponent, ExeRecordInventoryCheckComponent, ExeRecordMoveComponent, ExeRecordPatrolComponent, ExeRecordRepairComponent, ExeRecordSaleComponent, ExeRecordTowerComponent, ExeRecordVectorControlComponent, ExeRecordWeighingComponent } from '.';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'record-general',
       component: ExeRecordGeneralComponent,
        data: {
          title: 'Record General',
          module: 'apply-orders',
          breadcrumb: 'Record General',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-tower',
       component: ExeRecordTowerComponent,
        data: {
          title: 'Record Tower',
          module: 'apply-orders',
          breadcrumb: 'Record Tower',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-diagnosis',
       component: ExeRecordDiagnosisComponent,
        data: {
          title: 'Record Diagnosis',
          module: 'apply-orders',
          breadcrumb: 'Record Diagnosis',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-inventoryCheck',
       component: ExeRecordInventoryCheckComponent,
        data: {
          title: 'Record Inventory Check',
          module: 'apply-orders',
          breadcrumb: 'Record Inventory Check',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-repair',
       component: ExeRecordRepairComponent,
        data: {
          title: 'Record Repair',
          module: 'apply-orders',
          breadcrumb: 'Record Repair',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-patrol',
       component: ExeRecordPatrolComponent,
        data: {
          title: 'Record Patrol',
          module: 'apply-orders',
          breadcrumb: 'Record Patrol',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-culling',
       component: ExeRecordCullingComponent,
        data: {
          title: 'Record Culling',
          module: 'apply-orders',
          breadcrumb: 'Record Culling',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-death',
       component: ExeRecordDeathComponent,
        data: {
          title: 'Record Death',
          module: 'apply-orders',
          breadcrumb: 'Record Death',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-disinfection',
       component: ExeRecordDisinfectionComponent,
        data: {
          title: 'Record Disinfection',
          module: 'apply-orders',
          breadcrumb: 'Record Disinfection',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-donate',
       component: ExeRecordDonateComponent,
        data: {
          title: 'Record Donate',
          module: 'apply-orders',
          breadcrumb: 'Record Donate',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-eartag',
       component: ExeRecordEarTagComponent,
        data: {
          title: 'Record Ear Tag',
          module: 'apply-orders',
          breadcrumb: 'Record Ear Tag',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-feeding',
       component: ExeRecordFeedingComponent,
        data: {
          title: 'Record Feeding',
          module: 'apply-orders',
          breadcrumb: 'Record Feeding',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-immunization',
       component: ExeRecordImmunizationComponent,
        data: {
          title: 'Record Immunization',
          module: 'apply-orders',
          breadcrumb: 'Record Immunization',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-move',
       component: ExeRecordMoveComponent,
        data: {
          title: 'Record Move',
          module: 'apply-orders',
          breadcrumb: 'Record Move',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-sale',
       component: ExeRecordSaleComponent,
        data: {
          title: 'Record Sale',
          module: 'apply-orders',
          breadcrumb: 'Record Sale',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-vectorcontrol',
       component: ExeRecordVectorControlComponent,
        data: {
          title: 'Record Vector Control',
          module: 'apply-orders',
          breadcrumb: 'Record Vector Control',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-weighing',
       component: ExeRecordWeighingComponent,
        data: {
          title: 'Record Weighing',
          module: 'apply-orders',
          breadcrumb: 'Record Weighing',
          functionCode: 'ExecuteOrder'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-inout',
       component: ExeRecordInOutComponent,
        data: {
          title: 'Record In Out',
          module: 'apply-orders',
          breadcrumb: 'Record In Out',
          functionCode: 'ExecuteOrder'
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
export class ExecuteOrdersRoutingModule { }
