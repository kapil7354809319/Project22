import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentReportsBaseRoutingModule } from './current-reports-base-routing.module';

import { CurrentReportsBaseComponent } from './components/current-reports-base/current-reports-base.component';
import { SearchByFiltersComponent } from '../search-by-filters/search-by-filters.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchByServiceComponent } from '../search-by-service/search-by-service.component';
import { PortToPortSearchComponent } from '../port-to-port-search/port-to-port-search.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    CurrentReportsBaseComponent,
    SearchByFiltersComponent,
    SearchByServiceComponent,
    PortToPortSearchComponent,
  ],
  imports: [
    CommonModule,
    CurrentReportsBaseRoutingModule,
    SharedModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
})
export class CurrentReportsBaseModule {}
