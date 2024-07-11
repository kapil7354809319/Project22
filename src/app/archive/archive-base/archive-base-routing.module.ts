import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveBaseComponent } from './components/archive-base/archive-base.component';
import { MonthlyArchiveComponent } from '../monthly-archive/monthly-archive.component';
import { ViewArchivedServicesComponent } from '../view-archived-services/view-archived-services.component';
import { accessPermissionGuard } from 'src/app/shared-auth/access-permission.guard';
import { ManageRelayComponent } from '../manage-relay/manage-relay.component';
import { ManageTradeRouteComponent } from '../manage-trade-route/manage-trade-route.component';

const routes: Routes = [
  {
    path: '',
    component: ArchiveBaseComponent,
    children: [
      {
        path: '', redirectTo: "monthly-archive", pathMatch: 'full',
      },
      {
        path: 'monthly-archive', component: MonthlyArchiveComponent, canActivate: [accessPermissionGuard], data: { level: 'Level 2' }
      },
      {
        path: 'view-archived-services', component: ViewArchivedServicesComponent, canActivate: [accessPermissionGuard], data: { level: 'Level 2' }
      },
      {
        path: 'manage-relay', component: ManageRelayComponent, canActivate: [accessPermissionGuard], data: { level: 'Level 2' }
      },
      {
        path: 'manage-trade-route', component: ManageTradeRouteComponent, canActivate: [accessPermissionGuard], data: { level: 'Level 2' }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveBaseRoutingModule { }

