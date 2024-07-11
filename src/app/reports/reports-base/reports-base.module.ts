import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsBaseRoutingModule } from './reports-base-routing.module';
import { ReportsBaseComponent } from './components/reports-base/reports-base.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptabReportComponent } from '../captab-reports/captab-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShipCapacityByPortAndTradeRouteComponent } from '../ship-capacity-by-port-and-trade-route/ship-capacity-by-port-and-trade-route.component';
import { VesselRangeDeploymentComponent } from '../vessel-range-deployment/vessel-range-deployment.component';
import { RouteCapacityTimeseriesComponent } from '../route-capacity-timeseries/route-capacity-timeseries.component';
import { VesselHistoryReportComponent } from '../vessel-history-report/vessel-history-report.component';
import { PortReportComponent } from '../port-report/port-report.component';
import { VesselDeploymentReportsComponent } from '../vessel-deployment-reports/vessel-deployment-reports.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { CurrentVesselReportComponent } from '../current-vessel-report/current-vessel-report.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'

@NgModule({
  declarations: [
    ReportsBaseComponent,
    CaptabReportComponent,
    ShipCapacityByPortAndTradeRouteComponent,
    VesselRangeDeploymentComponent,
    RouteCapacityTimeseriesComponent,
    VesselHistoryReportComponent,
    VesselDeploymentReportsComponent,
    PortReportComponent,
    CurrentVesselReportComponent
    
  ],
  imports: [
    CommonModule,
    ReportsBaseRoutingModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgMultiSelectDropDownModule.forRoot(),
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class ReportsBaseModule { }
