import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorBaseRoutingModule } from './administrator-base-routing.module';
import { AdministratorBaseComponent } from './components/administrator-base/administrator-base.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DrewryUserComponent } from '../drewry-user/drewry-user.component';
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
import { ServiceComponent } from '../service/service.component';
import { ServiceEditComponent } from '../service-edit/service-edit.component';
import { VesselComponent } from '../vessel/vessel.component';
import { RelayComponent } from '../relay/relay.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ContentComponent } from '../content/content.component'
import { NgxEditorModule } from 'ngx-editor';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DocumentRepositoryComponent } from '../document-repository/document-repository.component';
import { ServiceLogListComponent } from '../service-log-list/service-log-list.component';
import { AddServiceToArchiveComponent } from '../add-service-to-archive/add-service-to-archive.component';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    AdministratorBaseComponent,
    DashboardComponent,
    DrewryUserComponent,
    RoutingComponent,
    CountryComponent,
    RegionComponent,
    OperatorComponent,
    AllianceComponent,
    SourceComponent,
    SubTradeComponent,
    TradeRouteComponent,
    PortRangeComponent,
    PortCallStatusComponent,
    PortComponent,
    CapacityRangeComponent,
    ServiceTypeComponent,
    VesselComponent,
    ServiceComponent,
    RelayComponent,
    ContentComponent,
    ConfirmationDialogComponent,
    ServiceEditComponent,
    DocumentRepositoryComponent,
    ServiceLogListComponent,
    AddServiceToArchiveComponent
  ],

  imports: [
    CommonModule,
    AdministratorBaseRoutingModule,
    SharedModule,
    MatDialogModule,
    NgxEditorModule,
    MatSortModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class AdministratorBaseModule { }
