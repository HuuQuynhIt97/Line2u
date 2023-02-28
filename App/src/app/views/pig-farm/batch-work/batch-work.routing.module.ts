import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import {
  RecordCullingComponent,
  RecordDeathComponent,
  RecordDisinfectionComponent,
  RecordFeedingComponent,
  RecordImmunizationComponent,
  RecordMoveComponent,
  RecordPigEarComponent,
  RecordTreatmentComponent,
  RecordVectorControlComponent,
  RecordWeighingComponent,
} from ".";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "record-culling",
        component: RecordCullingComponent,
        data: {
          title: "Record Culling",
          module: "Record Culling",
          breadcrumb: "Record Culling",
          //functionCode: "Record Culling",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-death",
        component: RecordDeathComponent,
        data: {
          title: "Record Death",
          module: "bacth-work",
          breadcrumb: "Record Death",
          //functionCode: "Record Death",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-disinfection",
        component: RecordDisinfectionComponent,
        data: {
          title: "Record Disinfection",
          module: "batch-work",
          breadcrumb: "Record Disinfection",
          //functionCode: "Record Disinfection",
          functionCode: "BatchWork",
        },
        canActivate: [AuthGuard],
      },
      {
        path: "record-feeding",
        component: RecordFeedingComponent,
        data: {
          title: "Record Feeding",
          module: "batch-work",
          breadcrumb: "Record Feeding",
          //functionCode: "Record Feeding",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-immunization",
        component: RecordImmunizationComponent,
        data: {
          title: "Record Immunization",
          module: "batch-work",
          breadcrumb: "Record Immunization",
          //functionCode: "Record Immunization",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-move",
        component: RecordMoveComponent,
        data: {
          title: "Record Move",
          module: "batch-work",
          breadcrumb: "Record Move",
          //functionCode: "Record Move",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-pig-ear",
        component: RecordPigEarComponent,
        data: {
          title: "Record Pig Ear",
          module: "batch-work",
          breadcrumb: "Record Pig Ear",
          //functionCode: "Record Pig Ear",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-treatment",
        component: RecordTreatmentComponent,
        data: {
          title: "Record Treatment",
          module: "batch-work",
          breadcrumb: "Record Treatment",
          //functionCode: "Record Treatment",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-vector-control",
        component: RecordVectorControlComponent,
        data: {
          title: "Record Vector Control",
          module: "batch-work",
          breadcrumb: "Record Vector Control",
          //functionCode: "Record Vector Control",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
      {
        path: "record-weighing",
        component: RecordWeighingComponent,
        data: {
          title: "Record Weighing",
          module: "batch-work",
          breadcrumb: "Record Weighing",
          //functionCode: "Record Weighing",
          functionCode: "BatchWork",
        },
        // canActivate: [AuthGuard]
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchWorkRoutingModule {}
