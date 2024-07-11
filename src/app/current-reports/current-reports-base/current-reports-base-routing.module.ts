import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CurrentReportsBaseComponent } from './components/current-reports-base/current-reports-base.component';
import { SearchByFiltersComponent } from '../search-by-filters/search-by-filters.component';
import { accessPermissionGuard } from 'src/app/shared-auth/access-permission.guard';
import { SearchByServiceComponent } from '../search-by-service/search-by-service.component';
import { PortToPortSearchComponent } from '../port-to-port-search/port-to-port-search.component';

const routes: Routes = [
  {
    path: '',
    component: CurrentReportsBaseComponent,
    children: [
      {
        path: '',
        redirectTo: 'search-by-filters',
        pathMatch: 'full',
        data: { level: 'Level 2' },
      },
      {
        path: 'search-by-filters',
        component: SearchByFiltersComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'search-by-service',
        component: SearchByServiceComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
      {
        path: 'port-to-port-search',
        component: PortToPortSearchComponent,
        canActivate: [accessPermissionGuard],
        data: { level: 'Level 2' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CurrentReportsBaseRoutingModule {}
