import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/_core/_guards/auth.guard";
import { Breeding2Component, BreedingComponent, SowBodyConditionComponent, SowFarrowComponent, SowFosterComponent, SowHeatingComponent, SowInComponent, SowMatingComponent, SowPreFarrowComponent, SowPregnancyTestComponent, SowWeaningComponent } from ".";
import { SucklingIronInjectionService } from "../services";
import { SowAbortionComponent } from "./sow-abortion/sow-abortion.component";

import { SucklingCastrationComponent } from './suckling-castration/suckling-castration.component';
import { SucklingCutEarComponent } from './suckling-cut-ear/suckling-cut-ear.component';
import { SucklingCutTeethTailComponent } from './suckling-cut-teeth-tail/suckling-cut-teeth-tail.component';
import { SucklingIronInjectionComponent } from './suckling-iron-injection/suckling-iron-injection.component';
import { SucklingMoveComponent } from './suckling-move/suckling-move.component';
import { SucklingTeachingComponent } from './suckling-teaching/suckling-teaching.component';
import { SucklingWeaningComponent } from './suckling-weaning/suckling-weaning.component';
import { SucklingWeighingComponent } from './suckling-weighing/suckling-weighing.component';
import { GiltInComponent } from './gilt-in/gilt-in.component';

import { GiltTestingComponent } from './gilt-testing/gilt-testing.component';
import { SowBackFatComponent } from './sow-back-fat/sow-back-fat.component';
import { SowFeedingComponent } from './sow-feeding/sow-feeding.component';
import { SowQuarantineComponent } from './sow-quarantine/sow-quarantine.component';
import { SowRotationComponent } from './sow-rotation/sow-rotation.component';
import { SowSiloComponent } from './sow-silo/sow-silo.component';

const newFuntions = [
  {
    path: "gilt-testing",
    component: GiltTestingComponent,
    data: {
      title: "Gilt Testing",
      module: "breeding",
      breadcrumb: "Gilt Testing",
      functionCode: "Gilt Testing"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-back-fat",
    component: SowBackFatComponent,
    data: {
      title: "Sow Back Fat",
      module: "breeding",
      breadcrumb: "Sow Back Fat",
      functionCode:"Sow Back Fat",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-feeding",
    component: SowFeedingComponent,
    data: {
      title: "Sow Feeding",
      module: "breeding",
      breadcrumb: "Sow Feeding",
      functionCode:"Sow Feeding",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-quarantine",
    component: SowQuarantineComponent,
    data: {
      title: "Sow Quarantine",
      module: "breeding",
      breadcrumb: "Sow Quarantine",
      functionCode:"Sow Quarantine",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-rotation",
    component: SowRotationComponent,
    data: {
      title: "Sow Rotation",
      module: "breeding",
      breadcrumb: "Sow Rotation",
      functionCode:"Sow Rotation",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-silo",
    component: SowSiloComponent,
    data: {
      title: "Sow Silo",
      module: "breeding",
      breadcrumb: "Sow Silo",
      functionCode:"Sow Silo",
    },
    //canActivate: [AuthGuard],
  },
]


const breeding2 = [
  {
    path: "sow",
    component: Breeding2Component,
    data: {
      title: "Breeding",
      module: "breeding",
      breadcrumb: "Breeding",
      functionCode: "Breeding",
      type: 'Sow'
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-in",
    component: SowInComponent,
    data: {
      title: "Sow In",
      module: "breeding",
      breadcrumb: "Sow In",
      functionCode:"Sow In",
    },
    //canActivate: [AuthGuard],
  },
]
const breedingSow = [
  {
    path: "sow-body-condition",
    component: SowBodyConditionComponent,
    data: {
      title: "Sow Body Condition",
      module: "breeding",
      breadcrumb: "Sow Body Condition",
      functionCode:"Sow Body Condition",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-farrow",
    component: SowFarrowComponent,
    data: {
      title: "Sow Farrow",
      module: "breeding",
      breadcrumb: "Sow Farrow",
      functionCode:"Sow Farrow",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-heating",
    component: SowHeatingComponent,
    data: {
      title: "Sow Heating",
      module: "breeding",
      breadcrumb: "Sow Heating",
      functionCode:"Sow Heating",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-mating",
    component: SowMatingComponent,
    data: {
      title: "Sow Mating",
      module: "breeding",
      breadcrumb: "Sow Mating",
      functionCode: "Sow Mating",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-foster",
    component: SowFosterComponent,
    data: {
      title: "Sow Foster",
      module: "breeding",
      breadcrumb: "Sow Foster",
      functionCode: "Sow Foster",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-pregnancy-test",
    component: SowPregnancyTestComponent,
    data: {
      title: "Sow Pregnancy Test",
      module: "breeding",
      breadcrumb: "Sow Pregnancy Test",
      functionCode: "Sow Pregnancy Test"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-pre-farrow",
    component: SowPreFarrowComponent,
    data: {
      title: "Sow Pre Farrow",
      module: "breeding",
      breadcrumb: "Sow Pre Farrow",
      functionCode: "Sow Pre Farrow"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-weaning",
    component: SowWeaningComponent,
    data: {
      title: "SowWeaning",
      module: "breeding",
      breadcrumb: "Sow Weaning",
      functionCode: "Sow Weaning"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "sow-abortion",
    component: SowAbortionComponent,
    data: {
      title: "Sow Abortion",
      module: "breeding",
      breadcrumb: "Sow Abortion",
      functionCode:"Sow Abortion",
    },
    //canActivate: [AuthGuard],
  },
]
const giltin = [
  {
    path: "gilt-in",
    component: GiltInComponent,
    data: {
      title: "Gilt In",
      module: "breeding",
      breadcrumb: "Gilt In",
      functionCode:"Gilt In",
    },
    //canActivate: [AuthGuard],
  },
  
]
const sucklings = [
  {
    path: "suckling-castration",
    component: SucklingCastrationComponent,
    data: {
      title: "Suckling Castration",
      module: "breeding",
      breadcrumb: "Suckling Castration",
      functionCode:"Suckling Castration",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-cut-ear",
    component: SucklingCutEarComponent,
    data: {
      title: "Suckling Cut Ear",
      module: "breeding",
      breadcrumb: "Suckling Cut Ear",
      functionCode:"Suckling Cut Ear",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-cut-teeth-tail",
    component: SucklingCutTeethTailComponent,
    data: {
      title: "Suckling Cut Teeth Tail",
      module: "breeding",
      breadcrumb: "Suckling Cut Teeth Tail",
      functionCode:"Suckling Cut Teeth Tail",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-iron-injection",
    component: SucklingIronInjectionComponent,
    data: {
      title: "Suckling Iron Injection",
      module: "breeding",
      breadcrumb: "Suckling Iron Injection",
      functionCode: "Suckling Iron Injection",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-move",
    component: SucklingMoveComponent,
    data: {
      title: "Suckling Move",
      module: "breeding",
      breadcrumb: "Suckling Move",
      functionCode: "Suckling Move",
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-teaching-slot",
    component: SucklingTeachingComponent,
    data: {
      title: "Suckling Teaching Slot",
      module: "breeding",
      breadcrumb: "Suckling Teaching Slot",
      functionCode: "Suckling Teaching Slot"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-weaning",
    component: SucklingWeaningComponent,
    data: {
      title: "Suckling Weaning",
      module: "breeding",
      breadcrumb: "Suckling Weaning",
      functionCode: "Suckling Weaning"
    },
    //canActivate: [AuthGuard],
  },
  {
    path: "suckling-weighing",
    component: SucklingWeighingComponent,
    data: {
      title: "Suckling Weighing",
      module: "breeding",
      breadcrumb: "Suckling Weighing",
      functionCode: "Suckling Weighing"
    },
    //canActivate: [AuthGuard],
  }
]

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "mating",
        component: BreedingComponent,
        data: {
          title: "Breeding Mating",
          module: "breeding",
          breadcrumb: "Breeding Mating",
          functionCode: "Breeding Mating",
          active: 0,
          addbtn: 'Add Mating',
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "pregnancy",
        component: BreedingComponent,
        data: {
          title: "Breeding Pregnancy",
          module: "breeding",
          breadcrumb: "Breeding Pregnancy",
          functionCode: "Breeding Pregnancy",
          active: 1,
          addbtn: 'Add Pregnancy',
        },
        //canActivate: [AuthGuard],
      },
      {
        path: "farrow",
        component: BreedingComponent,
        data: {
          title: "Breeding Farrow",
          module: "breeding",
          breadcrumb: "Breeding Farrow",
          functionCode: "Breeding Farrow",
          active: 2,
          addbtn: 'Add Farrow',
        },
        //canActivate: [AuthGuard],
      },


      {
        path: "suckling",
        component: BreedingComponent,
        data: {
          title: "Breeding Suckling",
          module: "breeding",
          breadcrumb: "Breeding Suckling",
          functionCode: "Breeding Suckling",
          active: 3,
          addbtn: 'Add Suckling',
        },
        //canActivate: [AuthGuard],
      },
      ...breedingSow,
      ...breeding2,
      ...sucklings,
      ...giltin,
      ...newFuntions,
      {
        path: '',
        loadChildren: () =>
          import('./boar/boar.module').then(m => m.BoarModule)
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedingRoutingModule {}
