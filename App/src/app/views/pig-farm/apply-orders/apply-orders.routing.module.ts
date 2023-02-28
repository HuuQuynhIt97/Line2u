import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import {
  RecordBuriedComponent,
  RecordChemicalComponent,
  RecordCullingComponent,
  RecordDeathComponent,
  RecordDiagnosisComponent,
  RecordDisinfectionComponent,
  RecordDonateComponent,
  RecordEarTagComponent,
  RecordFeedingComponent,
  RecordGeneralComponent,
  RecordImmunizationComponent,
  RecordInOutComponent,
  RecordInventoryCheckComponent,
  RecordKillComponent,
  RecordMoveComponent,
  RecordPatrolComponent,
  RecordPiginComponent,
  RecordPigoutComponent,
  RecordRepairComponent,
  RecordSaleComponent,
  RecordSiloComponent,
  RecordStolenComponent,
  RecordTowerComponent,
  RecordVectorControlComponent,
  RecordWeighingComponent,
  RecordCullingSaleComponent,
  RecordMarketComponent
} from ".";
import { RecordAbattoirComponent } from "./record-abattoir/record-abattoir.component";
import { RecordAccidentFeeComponent } from "./record-accident-fee/record-accident-fee.component";
import { RecordAccountCheckComponent } from './record-accountCheck/record-accountCheck.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "record-abattoir",
        component: RecordAbattoirComponent,
        data: {
          title: "Record Abattoir",
          module: "apply-orders",
          breadcrumb: "Record Abattoir",
          functionCode: "Record Abattoir",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-general",
        component: RecordGeneralComponent,
        data: {
          title: "Record General",
          module: "apply-orders",
          breadcrumb: "Record General",
          functionCode: "Record General",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-general/:guid",
        component: RecordGeneralComponent,
        data: {
          title: "Record General",
          module: "apply-orders",
          breadcrumb: "Record General",
          functionCode: "Record General",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-tower",
        component: RecordTowerComponent,
        data: {
          title: "Record Tower",
          module: "apply-orders",
          breadcrumb: "Record Tower",
          functionCode: "Record Tower",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-tower/:guid",
        component: RecordTowerComponent,
        data: {
          title: "Record Tower",
          module: "apply-orders",
          breadcrumb: "Record Tower",
          functionCode: "Record Tower",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-diagnosis",
        component: RecordDiagnosisComponent,
        data: {
          title: "Record Diagnosis",
          module: "apply-orders",
          breadcrumb: "Record Diagnosis",
          functionCode: "Record Diagnosis",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-diagnosis/:guid",
        component: RecordDiagnosisComponent,
        data: {
          title: "Record Diagnosis",
          module: "apply-orders",
          breadcrumb: "Record Diagnosis",
          functionCode: "Record Diagnosis",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-inventory",
        component: RecordInventoryCheckComponent,
        data: {
          title: "Record Inventory Check",
          module: "apply-orders",
          breadcrumb: "Record Inventory Check",
          functionCode: "Record Inventory",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-inventory/:guid",
        component: RecordInventoryCheckComponent,
        data: {
          title: "Record Inventory Check",
          module: "apply-orders",
          breadcrumb: "Record Inventory Check",
          functionCode: "Record Inventory",
        },
        canActivate: [AuthGuard],
      },
  
  {
    path: "record-accident-fee",
    component: RecordAccidentFeeComponent,
    data: {
      title: "Record Accident Fee",
      module: "apply-orders",
      breadcrumb: "Record Accident Fee",
      functionCode: "Record Accident Fee",
    },
    canActivate: [AuthGuard],
  },
      {
        path: "record-repair",
        component: RecordRepairComponent,
        data: {
          title: "Record Repair",
          module: "apply-orders",
          breadcrumb: "Record Repair",
          functionCode: "Record Repair",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-repair/:guid",
        component: RecordRepairComponent,
        data: {
          title: "Record Repair",
          module: "apply-orders",
          breadcrumb: "Record Repair",
          functionCode: "Record Repair",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-patrol",
        component: RecordPatrolComponent,
        data: {
          title: "Record Patrol",
          module: "apply-orders",
          breadcrumb: "Record Patrol",
          functionCode: "Record Patrol",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-patrol/:guid",
        component: RecordPatrolComponent,
        data: {
          title: "Record Patrol",
          module: "apply-orders",
          breadcrumb: "Record Patrol",
          functionCode: "Record Patrol",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-culling",
        component: RecordCullingComponent,
        data: {
          title: "Record Culling",
          module: "apply-orders",
          breadcrumb: "Record Culling",
          functionCode: "Record Culling",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-culling/:guid",
        component: RecordCullingComponent,
        data: {
          title: "Record Culling",
          module: "apply-orders",
          breadcrumb: "Record Culling",
          functionCode: "Record Culling",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-death",
        component: RecordDeathComponent,
        data: {
          title: "Record Death",
          module: "apply-orders",
          breadcrumb: "Record Death",
          functionCode: "Record Death",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-death/:guid",
        component: RecordDeathComponent,
        data: {
          title: "Record Death",
          module: "apply-orders",
          breadcrumb: "Record Death",
          functionCode: "Record Death",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-disinfection",
        component: RecordDisinfectionComponent,
        data: {
          title: "Record Disinfection",
          module: "apply-orders",
          breadcrumb: "Record Disinfection",
          functionCode: "Record Disinfection",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-disinfection/:guid",
        component: RecordDisinfectionComponent,
        data: {
          title: "Record Disinfection",
          module: "apply-orders",
          breadcrumb: "Record Disinfection",
          functionCode: "Record Disinfection",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-donate",
        component: RecordDonateComponent,
        data: {
          title: "Record Donate",
          module: "apply-orders",
          breadcrumb: "Record Donate",
          functionCode: "Record Donate",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-donate/:guid",
        component: RecordDonateComponent,
        data: {
          title: "Record Donate",
          module: "apply-orders",
          breadcrumb: "Record Donate",
          functionCode: "Record Donate",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-ear-tag",
        component: RecordEarTagComponent,
        data: {
          title: "Record Ear Tag",
          module: "apply-orders",
          breadcrumb: "Record Ear Tag",
          functionCode: "Record Ear Tag",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-ear-tag/:guid",
        component: RecordEarTagComponent,
        data: {
          title: "Record Ear Tag",
          module: "apply-orders",
          breadcrumb: "Record Ear Tag",
          functionCode: "Record Ear Tag",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-feeding",
        component: RecordFeedingComponent,
        data: {
          title: "Record Feeding",
          module: "apply-orders",
          breadcrumb: "Record Feeding",
          functionCode: "Record Feeding",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-feeding/:guid",
        component: RecordFeedingComponent,
        data: {
          title: "Record Feeding",
          module: "apply-orders",
          breadcrumb: "Record Feeding",
          functionCode: "Record Feeding",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-immunization",
        component: RecordImmunizationComponent,
        data: {
          title: "Record Immunization",
          module: "apply-orders",
          breadcrumb: "Record Immunization",
          functionCode: "Record Immunization",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-immunization/:guid",
        component: RecordImmunizationComponent,
        data: {
          title: "Record Immunization",
          module: "apply-orders",
          breadcrumb: "Record Immunization",
          functionCode: "Record Immunization",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-move",
        component: RecordMoveComponent,
        data: {
          title: "Record Move",
          module: "apply-orders",
          breadcrumb: "Record Move",
          functionCode: "Record Move",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-move/:guid",
        component: RecordMoveComponent,
        data: {
          title: "Record Move",
          module: "apply-orders",
          breadcrumb: "Record Move",
          functionCode: "Record Move",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-sale",
        component: RecordSaleComponent,
        data: {
          title: "Record Sale",
          module: "apply-orders",
          breadcrumb: "Record Sale",
          functionCode: "Record Sale",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-sale/:guid",
        component: RecordSaleComponent,
        data: {
          title: "Record Sale",
          module: "apply-orders",
          breadcrumb: "Record Sale",
          functionCode: "Record Sale",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-culling-sale",
        component: RecordCullingSaleComponent,
        data: {
          title: "Record Culling Sale",
          module: "apply-orders",
          breadcrumb: "Record Culling Sale",
          functionCode: "Record Culling Sale",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-culling-sale/:guid",
        component: RecordCullingSaleComponent,
        data: {
          title: "Record Culling Sale",
          module: "apply-orders",
          breadcrumb: "Record Culling Sale",
          functionCode: "Record Culling Sale",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-vector-control",
        component: RecordVectorControlComponent,
        data: {
          title: "Record Vector Control",
          module: "apply-orders",
          breadcrumb: "Record VectorControl",
          functionCode: "Record VectorControl",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-vector-control/:guid",
        component: RecordVectorControlComponent,
        data: {
          title: "Record Vector Control",
          module: "apply-orders",
          breadcrumb: "Record VectorControl",
          functionCode: "Record VectorControl",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-weighing",
        component: RecordWeighingComponent,
        data: {
          title: "Record Weighing",
          module: "apply-orders",
          breadcrumb: "Record Weighing",
          functionCode: "Record Weighing",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-weighing/:guid",
        component: RecordWeighingComponent,
        data: {
          title: "Record Weighing",
          module: "apply-orders",
          breadcrumb: "Record Weighing",
          functionCode: "Record Weighing",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-in-out",
        component: RecordInOutComponent,
        data: {
          title: "Record In Out",
          module: "apply-orders",
          breadcrumb: "Record In Out",
          functionCode: "Record In Out",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-in-out/:guid",
        component: RecordInOutComponent,
        data: {
          title: "Record In Out",
          module: "apply-orders",
          breadcrumb: "Record In Out",
          functionCode: "Record In Out",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-silo",
        component: RecordSiloComponent,
        data: {
          title: "Record Silo",
          module: "apply-orders",
          breadcrumb: "Record Silo",
          functionCode: "Record Silo",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-silo/:guid",
        component: RecordSiloComponent,
        data: {
          title: "Record Silo",
          module: "apply-orders",
          breadcrumb: "Record Silo",
          functionCode: "Record Silo",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-silo/:guid",
        component: RecordSiloComponent,
        data: {
          title: "Record Silo",
          module: "apply-orders",
          breadcrumb: "Record Silo",
          functionCode: "Record Silo",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-kill",
        component: RecordKillComponent,
        data: {
          title: "Record Kill",
          module: "apply-orders",
          breadcrumb: "Record Kill",
          functionCode: "Record Kill",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-kill/:guid",
        component: RecordKillComponent,
        data: {
          title: "Record Kill",
          module: "apply-orders",
          breadcrumb: "Record Kill",
          functionCode: "Record Kill",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-chemical",
        component: RecordChemicalComponent,
        data: {
          title: "Record Chemical",
          module: "apply-orders",
          breadcrumb: "Record Chemical",
          functionCode: "Record Chemical",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-chemical/:guid",
        component: RecordChemicalComponent,
        data: {
          title: "Record Chemical",
          module: "apply-orders",
          breadcrumb: "Record Chemical",
          functionCode: "Record Chemical",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-stolen",
        component: RecordStolenComponent,
        data: {
          title: "Record Stolen",
          module: "apply-orders",
          breadcrumb: "Record Stolen",
          functionCode: "Record Stolen",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-stolen/:guid",
        component: RecordStolenComponent,
        data: {
          title: "Record Stolen",
          module: "apply-orders",
          breadcrumb: "Record Stolen",
          functionCode: "Record Stolen",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-buried",
        component: RecordBuriedComponent,
        data: {
          title: "Record Buried",
          module: "apply-orders",
          breadcrumb: "Record Buried",
          functionCode: "Record Buried",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-buried/:guid",
        component: RecordBuriedComponent,
        data: {
          title: "Record Buried",
          module: "apply-orders",
          breadcrumb: "Record Buried",
          functionCode: "Record Buried",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-pigIn",
        component: RecordPiginComponent,
        data: {
          title: "Record Pig In",
          module: "apply-orders",
          breadcrumb: "Record Pig In",
          functionCode: "Record Pig In",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-pigIn/:guid",
        component: RecordPiginComponent,
        data: {
          title: "Record Pig In",
          module: "apply-orders",
          breadcrumb: "Record Pig In",
          functionCode: "Record Pig In",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-pigOut",
        component: RecordPigoutComponent,
        data: {
          title: "Record Pig Out",
          module: "apply-orders",
          breadcrumb: "Record Pig Out",
          functionCode: "Record Pig Out",
        },

        canActivate: [AuthGuard],
      },
      {
        path: "record-pigOut/:guid",
        component: RecordPigoutComponent,
        data: {
          title: "Record Pig Out",
          module: "apply-orders",
          breadcrumb: "Record Pig Out",
          functionCode: "Record Pig Out",
        },

        canActivate: [AuthGuard],
      },
      // guid
      {
        path: "record-general/:recordguid/:upperguid",
        component: RecordGeneralComponent,
        data: {
          title: "Record General",
          module: "apply-orders",
          breadcrumb: "Record General",
          functionCode: "Record General",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-tower/:recordguid/:upperguid",
        component: RecordTowerComponent,
        data: {
          title: "Record Tower",
          module: "apply-orders",
          breadcrumb: "Record Tower",
          functionCode: "Record Tower",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-diagnosis/:recordguid/:upperguid",
        component: RecordDiagnosisComponent,
        data: {
          title: "Record Diagnosis",
          module: "apply-orders",
          breadcrumb: "Record Diagnosis",
          functionCode: "Record Diagnosis",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-inventory/:recordguid/:upperguid",
        component: RecordInventoryCheckComponent,
        data: {
          title: "Record Inventory Check",
          module: "apply-orders",
          breadcrumb: "Record Inventory Check",
          functionCode: "Record Inventory",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-repair/:recordguid/:upperguid",
        component: RecordRepairComponent,
        data: {
          title: "Record Repair",
          module: "apply-orders",
          breadcrumb: "Record Repair",
          functionCode: "Record Repair",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-patrol/:recordguid/:upperguid",
        component: RecordPatrolComponent,
        data: {
          title: "Record Patrol",
          module: "apply-orders",
          breadcrumb: "Record Patrol",
          functionCode: "Record Patrol",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-culling/:recordguid/:upperguid",
        component: RecordCullingComponent,
        data: {
          title: "Record Culling",
          module: "apply-orders",
          breadcrumb: "Record Culling",
          functionCode: "Record Culling",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-death/:guid/:guid",
        component: RecordDeathComponent,
        data: {
          title: "Record Death",
          module: "apply-orders",
          breadcrumb: "Record Death",
          functionCode: "Record Death",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-death/:recordguid/:upperguid",
        component: RecordDeathComponent,
        data: {
          title: "Record Death",
          module: "apply-orders",
          breadcrumb: "Record Death",
          functionCode: "Record Death",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-disinfection/:recordguid/:upperguid",
        component: RecordDisinfectionComponent,
        data: {
          title: "Record Disinfection",
          module: "apply-orders",
          breadcrumb: "Record Disinfection",
          functionCode: "Record Disinfection",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-donate/:recordguid/:upperguid",
        component: RecordDonateComponent,
        data: {
          title: "Record Donate",
          module: "apply-orders",
          breadcrumb: "Record Donate",
          functionCode: "Record Donate",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-ear-tag/:recordguid/:upperguid",
        component: RecordEarTagComponent,
        data: {
          title: "Record Ear Tag",
          module: "apply-orders",
          breadcrumb: "Record Ear Tag",
          functionCode: "Record Ear Tag",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-feeding/:recordguid/:upperguid",
        component: RecordFeedingComponent,
        data: {
          title: "Record Feeding",
          module: "apply-orders",
          breadcrumb: "Record Feeding",
          functionCode: "Record Feeding",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-immunization/:recordguid/:upperguid",
        component: RecordImmunizationComponent,
        data: {
          title: "Record Immunization",
          module: "apply-orders",
          breadcrumb: "Record Immunization",
          functionCode: "Record Immunization",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-move/:recordguid/:upperguid",
        component: RecordMoveComponent,
        data: {
          title: "Record Move",
          module: "apply-orders",
          breadcrumb: "Record Move",
          functionCode: "Record Move",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-sale/:recordguid/:upperguid",
        component: RecordSaleComponent,
        data: {
          title: "Record Sale",
          module: "apply-orders",
          breadcrumb: "Record Sale",
          functionCode: "Record Sale",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-vector-control/:recordguid/:upperguid",
        component: RecordVectorControlComponent,
        data: {
          title: "Record Vector Control",
          module: "apply-orders",
          breadcrumb: "Record VectorControl",
          functionCode: "Record VectorControl",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-weighing/:recordguid/:upperguid",
        component: RecordWeighingComponent,
        data: {
          title: "Record Weighing",
          module: "apply-orders",
          breadcrumb: "Record Weighing",
          functionCode: "Record Weighing",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-in-out/:recordguid/:upperguid",
        component: RecordInOutComponent,
        data: {
          title: "Record In Out",
          module: "apply-orders",
          breadcrumb: "Record In Out",
          functionCode: "Record In Out",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-silo/:recordguid/:upperguid",
        component: RecordSiloComponent,
        data: {
          title: "Record Silo",
          module: "apply-orders",
          breadcrumb: "Record Silo",
          functionCode: "Record Silo",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-kill/:recordguid/:upperguid",
        component: RecordKillComponent,
        data: {
          title: "Record Kill",
          module: "apply-orders",
          breadcrumb: "Record Kill",
          functionCode: "Record Kill",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-chemical/:recordguid/:upperguid",
        component: RecordChemicalComponent,
        data: {
          title: "Record Chemical",
          module: "apply-orders",
          breadcrumb: "Record Chemical",
          functionCode: "Record Chemical",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-stolen/:recordguid/:upperguid",
        component: RecordStolenComponent,
        data: {
          title: "Record Stolen",
          module: "apply-orders",
          breadcrumb: "Record Stolen",
          functionCode: "Record Stolen",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-buried/:recordguid/:upperguid",
        component: RecordBuriedComponent,
        data: {
          title: "Record Buried",
          module: "apply-orders",
          breadcrumb: "Record Buried",
          functionCode: "Record Buried",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-pigIn/:recordguid/:upperguid",
        component: RecordPiginComponent,
        data: {
          title: "Record Pig In",
          module: "apply-orders",
          breadcrumb: "Record Pig In",
          functionCode: "Record Pig In",
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'record-pigOut/:recordguid/:upperguid',
       component: RecordPigoutComponent,
        data: {
          title: 'Record Pig Out',
          module: 'apply-orders',
          breadcrumb: 'Record Pig Out',
          functionCode: 'Record Pig Out'
        },
       canActivate: [AuthGuard]
      },
      {
        path: 'record-market',
       component: RecordMarketComponent,
        data: {
          title: 'Record market',
          module: 'apply-orders',
          breadcrumb: 'Record Market',
          functionCode: 'Record Market'
        },
       //canActivate: [AuthGuard]
      },
      {
        path: 'record-market/:recordguid',
       component: RecordMarketComponent,
       data: {
        title: 'Record market',
        module: 'apply-orders',
        breadcrumb: 'Record Market',
        functionCode: 'Record Market'
      },
       //canActivate: [AuthGuard]
      },
      {
        path: 'record-account-check',
       component: RecordAccountCheckComponent,
        data: {
          title: 'Record Account Check',
          module: 'apply-orders',
          breadcrumb: 'Record Account Check',
          functionCode: 'Record Account Check'
        },
       //canActivate: [AuthGuard]
      },
    ],
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplyOrdersRoutingModule {}
