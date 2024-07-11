import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveBaseRoutingModule } from './archive-base-routing.module';
import { ArchiveBaseComponent } from './components/archive-base/archive-base.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MonthlyArchiveComponent } from '../monthly-archive/monthly-archive.component';
import { ViewArchivedServicesComponent } from '../view-archived-services/view-archived-services.component';
import { ManageRelayComponent } from '../manage-relay/manage-relay.component';
import { ManageTradeRouteComponent } from '../manage-trade-route/manage-trade-route.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ArchiveBaseComponent,
    MonthlyArchiveComponent,
    ManageRelayComponent,
    ManageTradeRouteComponent,
    ViewArchivedServicesComponent
  ],
  imports: [
    CommonModule,
    ArchiveBaseRoutingModule,
    SharedModule,
    NgbModule,
  ]
})
export class ArchiveBaseModule { }
