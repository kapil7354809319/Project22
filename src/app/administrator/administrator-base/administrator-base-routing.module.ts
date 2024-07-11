import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RoutingComponent } from '../routing/routing.component';
import { CountryComponent } from '../country/country.component';
import { RegionComponent } from '../region/region.component';
import { OperatorComponent } from '../operator/operator.component';
import { AllianceComponent } from '../alliance/alliance.component';
import { SourceComponent } from '../source/source.component';
import { SubTradeComponent } from '../sub-trade/sub-trade.component';
import { TradeRouteComponent } from '../trade-route/trade-route.component';
import { PortRangeComponent } from '../port-range/port-range.component';
import { PortCallStatusComponent } from '../port-call-status/port-call-status.component';
import { PortComponent } from '../port/port.component';
import { CapacityRangeComponent } from '../capacity-range/capacity-range.component';
import { ServiceTypeComponent } from '../service-type/service-type.component';
import { VesselComponent } from '../vessel/vessel.component';
import { ServiceComponent } from '../service/service.component';
import { accessPermissionGuard } from '../../shared-auth/access-permission.guard';
import { AdministratorBaseComponent } from './components/administrator-base/administrator-base.component';
import { RelayComponent } from '../../administrator/relay/relay.component'; // Import your interceptor
import { ContentComponent } from '../content/content.component';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { DocumentRepositoryComponent } from '../document-repository/document-repository.component';
import { ServiceLogListComponent } from '../service-log-list/service-log-list.component';
import { AddServiceToArchiveComponent } from '../add-service-to-archive/add-service-to-archive.component';

const routes: Routes = [
  {
    path: '',
    component: AdministratorBaseComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'routing',
        component: RoutingComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'country',
        component: CountryComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'region',
        component: RegionComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'operator',
        component: OperatorComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'alliance',
        component: AllianceComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'source',
        component: SourceComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'sub-trade',
        component: SubTradeComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'trade-route',
        component: TradeRouteComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'port-range',
        component: PortRangeComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'port-call-status',
        component: PortCallStatusComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'port',
        component: PortComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'capacity-range',
        component: CapacityRangeComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'service-type',
        component: ServiceTypeComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'vessel',
        component: VesselComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'news',
        canActivate: [accessPermissionGuard],
        loadChildren: () =>
          import('../news/news.module').then((m) => m.NewsModule),
      },
      {
        path: 'service',
        component: ServiceComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'content',
        component: ContentComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'relay',
        component: RelayComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'content',
        component: ContentComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'edit-service/:id',
        component: ServiceEditComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'document-repository',
        component: DocumentRepositoryComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'service-log-list/:id',
        component: ServiceLogListComponent,
        canActivate: [accessPermissionGuard],
      },
      {
        path: 'add-service-to-archive',
        component: AddServiceToArchiveComponent,
        canActivate: [accessPermissionGuard],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministratorBaseRoutingModule {}
