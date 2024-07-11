import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsBaseComponent } from './components/reports-base/reports-base.component';
import { CaptabReportComponent } from '../captab-reports/captab-report.component';
import { accessPermissionGuard } from 'src/app/shared-auth/access-permission.guard';
import { VesselDeploymentReportsComponent } from '../vessel-deployment-reports/vessel-deployment-reports.component';
import { ShipCapacityByPortAndTradeRouteComponent } from '../ship-capacity-by-port-and-trade-route/ship-capacity-by-port-and-trade-route.component';
import { VesselRangeDeploymentComponent } from '../vessel-range-deployment/vessel-range-deployment.component';
import { RouteCapacityTimeseriesComponent } from '../route-capacity-timeseries/route-capacity-timeseries.component';
import { VesselHistoryReportComponent } from '../vessel-history-report/vessel-history-report.component';
import { PortReportComponent } from '../port-report/port-report.component';
import { CurrentVesselReportComponent } from '../current-vessel-report/current-vessel-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsBaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'captab-reports',
        pathMatch: 'full',
        data: { level: 'Level 2' },
      },
      {
        path: 'captab-reports',
        component: CaptabReportComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'vessel-deployment-reports',
        component: VesselDeploymentReportsComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'ship-capacity-by-port-and-trade-route',
        component: ShipCapacityByPortAndTradeRouteComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'vessel-range-deployment',
        component: VesselRangeDeploymentComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'route-capacity-timeseries',
        component: RouteCapacityTimeseriesComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'vessel-history-report',
        component: VesselHistoryReportComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'port-report',
        component: PortReportComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'current-vessel-report',
        component: CurrentVesselReportComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsBaseRoutingModule {}
