import { VectorControl2Component } from './vector-control/vector-control.component';
import { MaterialComponent } from './material/material.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/_core/_guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedMaterialComponent } from './feed-material/feed-material.component';
import { FeedComponent } from './feed/feed.component';
import { ProfileComponent } from './profile/profile.component';
import { CustomerComponent } from './customer/customer.component';
import { DiseaseComponent } from './disease/disease.component';
import { Disinfection2Component } from './disinfection/disinfection.component';
import { MedicineComponent } from './medicine/medicine.component';
import { VendorComponent } from './vendor/vendor.component';
import { ThingComponent } from './thing/thing.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { RecordInOutComponent } from './record-in-out/record-in-out.component';
import { SystemConfigComponent } from './system/system-config/system-config.component';
import { environment } from 'src/environments/environment';
import { TransferFeeComponent } from './transfer-fee/transfer-fee.component';
import { AbattoirLevelComponent } from './abattoir-level/abattoir-level.component';
const routes: Routes = [
   {
    path: 'feed',
    component: FeedComponent,
    data: {
      title: 'Feed',
      breadcrumb: 'Feed',
      functionCode: 'Feed'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'feed-material',
    component: FeedMaterialComponent,
    data: {
      title: 'Feed Material',
      breadcrumb: 'Feed Material',
      functionCode: 'Feed Material'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      title: 'Customer',
      breadcrumb: 'Customer',
      functionCode: 'Customer'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'nutrition',
    component: NutritionComponent,
    data: {
      title: 'Nutrition',
      breadcrumb: 'Nutrition',
      functionCode: 'Nutrition'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'vector_control',
    component: VectorControl2Component,
    data: {
      title: 'Vector Control',
      breadcrumb: 'Vector Control',
      functionCode: 'Vector Control'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'disease',
    component: DiseaseComponent,
    data: {
      title: 'Disease',
      breadcrumb: 'Disease',
      functionCode: 'Disease'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'disinfection',
    component: Disinfection2Component,
    data: {
      title: 'Disinfection',
      breadcrumb: 'Disinfection',
      functionCode: 'Disinfection'
    },
    canActivate: [AuthGuard]
  },
   {
    path: 'medicine',
    component: MedicineComponent,
    data: {
      title: 'Medicine',
      breadcrumb: 'Medicine',
      functionCode: 'Medicine'
    },
    canActivate: [AuthGuard]
  },
   {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
   // canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/:guid',
    component: DashboardComponent,
    data: {
      title: 'Dashboard',
      breadcrumb: 'Dashboard',
      functionCode: 'dashboard'
    },
    canActivate: [AuthGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile',
      breadcrumb: 'Profile',
      functionCode: 'Profile'

    },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    children: [
      {
        path: 'system-config',
        component: SystemConfigComponent,
        data: {
          title: 'System Config',
          breadcrumb: 'System Config',
          functionCode: 'System Config'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'record-in-out',
        component: RecordInOutComponent,
        data: {
          title: 'Record In Out',
          breadcrumb: 'Record In Out',
          functionCode: 'Record In Out'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'purchase',
        component: PurchaseComponent,
        data: {
          title: 'Purchase',
          breadcrumb: 'Purchase',
          functionCode: 'Purchase'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'vendor',
        component: VendorComponent,
        data: {
          title: 'Vendor',
          breadcrumb: 'Vendor',
          functionCode: 'Vendor'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'transfer-fee',
        component: TransferFeeComponent,
        data: {
          title: 'Transfer Fee',
          breadcrumb: 'Transfer Fee',
          functionCode: 'Transfer Fee'

        },
       // canActivate: [AuthGuard]
      },
      {
        path: 'abattoir-level',
        component: AbattoirLevelComponent,
        data: {
          title: 'Abattoir Level',
          breadcrumb: 'Abattoir Level',
          functionCode: 'Abattoir Level'

        },
       canActivate: [AuthGuard]
      },
      {
        path: 'thing',
        component: ThingComponent,
        data: {
          title: 'Thing',
          breadcrumb: 'Thing',
          functionCode: 'Thing'

        },
        canActivate: [AuthGuard]
      },
      {
        path: 'material',
        component: MaterialComponent,
        data: {
          title: 'Material',
          breadcrumb: 'Material',
          functionCode: 'Material'

        },
       //canActivate: [AuthGuard]
      },
      {
        path: 'batch-work',
        data: {
          title: '',
          module: 'batch-work',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./batch-work/batch-work.module').then(m => m.BatchWorkModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'pig-house-cleaning',
        data: {
          title: '',
          module: 'pig-house-cleaning',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./pig-house-cleaning/pig-house-cleaning.module').then(m => m.PigHouseCleaningModule),
        //canActivate: [AuthGuard]
      },
       {
        path: 'pig-farm-vector',
        data: {
          title: '',
          module: 'pig-farm-vector',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./pig-farm-vector/pig-farm-vector.module').then(m => m.PigFarmVectorModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'pig-disease',
        data: {
          title: '',
          module: 'pig-disease',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./pig-disease/pig-disease.module').then(m => m.PigDiseaseModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'repair',
        data: {
          title: '',
          module: 'repair',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./repair/repair.module').then(m => m.RepairModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'sale-order',
        data: {
          title: '',
          module: 'sale-order',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./sale-order/sale-order.module').then(m => m.SaleOrderModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'inventory',
        data: {
          title: '',
          module: 'inventory',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'apply-orders',
        data: {
          title: '',
          module: 'apply-orders',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./apply-orders/apply-orders.module').then(m => m.ApplyOrdersModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'execute-orders',
        data: {
          title: '',
          module: 'execute-orders',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./execute-orders/execute-orders.module').then(m => m.ExecuteOrdersModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'requisition',
        data: {
          title: '',
          module: 'requisition',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./requisition/requisition.module').then(m => m.RequisitionModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'acceptance',
        data: {
          title: '',
          module: 'acceptance',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./acceptance/acceptance.module').then(m => m.AcceptanceModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'pig-setting',
        data: {
          title: 'Pig Setting',
          module: 'pig-setting',
          breadcrumb: 'Pig Setting',
          root: true
        },
        loadChildren: () => import('./pig-setting/pig-setting.module').then(m => m.PigSettingModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'system',
        data: {
          title: 'system',
          module: 'system',
          breadcrumb: 'System',
          root: true
        },
        loadChildren: () => import('./system/system.module').then(m => m.SystemModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'bom',
        data: {
          title: 'BOM',
          module: 'bom',
          breadcrumb: 'Production BOM',
          root: true
        },
        loadChildren: () => import('./bom/bom.module').then(m => m.BOMModule)
      },
      {
        path: 'farm',
        data: {
          title: 'Farm',
          module: 'Farm',
          breadcrumb: 'Farm',
          root: true
        },
        loadChildren: () => import('./farm/farm.module').then(m => m.FarmModule)
      },
      {
        path: 'pig-management',
        data: {
          title: 'Pig Management',
          module: 'pig-management',
          breadcrumb: 'Pig Management',
          functionCode: 'Pig Management',
          root: true
        },
        loadChildren: () => import('./pig-management/pig-management.module').then(m => m.PigMangementModule)
      },
      {
        path: 'bio-security',
        data: {
          title: 'Bio Security',
          module: 'bio-security',
          breadcrumb: 'Bio Security',
          functionCode: 'Bio Security',
          root: true
        },
        loadChildren: () => import('./bio-security/bio-security.module').then(m => m.BioSecurityModule)
      },
      {
        path: 'inventory2',
        data: {
          title: '',
          module: 'inventory2',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./inventory-module/inventory2.module').then(m => m.Inventory2Module),
        //canActivate: [AuthGuard]
      },
      {
        path: 'breeding',
        data: {
          title: '',
          module: 'breeding',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./breedings/lib/breeding.module').then(m => m.BreedingModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'bom-sow',
        data: {
          title: '',
          module: 'bom-sow',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./breedings/lib/bom/bom-sow.module').then(m => m.BomSowModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'bom-boar',
        data: {
          title: '',
          module: 'bom-boar',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./breedings/lib/bom-boar/bom-boar.module').then(m => m.BomBoarModule),
        //canActivate: [AuthGuard]
      },
      {
        path: 'bom-gilt',
        data: {
          title: '',
          module: 'bom-gilt',
          breadcrumb: '',
          root: true
        },
        loadChildren: () => import('./breedings/lib/bom-gilt/bom-gilt.module').then(m => m.BomGiltModule),
        //canActivate: [AuthGuard]
      },
      {
        path: '',
        data: {
          root: true
        },
        loadChildren: () => import('./edit-page-dashboard/edit-page-dashboard.module').then(m => m.EditPageDashboardModule),
        //canActivate: [AuthGuard]
      },
      
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PigFarmRoutingModule { }
