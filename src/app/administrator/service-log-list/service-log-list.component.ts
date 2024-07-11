import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-service-log-list',
  templateUrl: './service-log-list.component.html',
  styleUrls: ['./service-log-list.component.scss'],
})
export class ServiceLogListComponent {
  pagination: any;
  serviceLogList: any;
  fromStart: any;
  per_page: any;
  total: any;
  serviceViewObject: any;
  log_type:any;
  is_master: any;
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    public dialog: MatDialog,
    private api: ApiService,
  ) {}
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get loading() {
    return this.loadingSubject.asObservable();
  }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.log_type = params['log_type'];
    });
    this.initializeData();
  }

  initializeData() {
    this.showLoader();
    const ID = this.route.snapshot.paramMap.get('id');
    const callAPI = this.log_type ? 'get-archive-service-log/' : 'get-service-log/';
    this.api.getWithPaginate(callAPI + ID).subscribe({
      next: (response: any) => {
        this.serviceLogList = response.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        this.hideLoader();
      },
    });
  }
  viewService(id: any) {
    if (!id) return;

    $('#viewServiceModal').modal('show');
    if(this.log_type){
      this.serviceViewObject = this.serviceLogList.filter((item: { archive_service_change_log_id: any; }) => item.archive_service_change_log_id === id);
    }else{
      this.serviceViewObject = this.serviceLogList.filter((item: { current_service_change_log_id: any; }) => item.current_service_change_log_id === id);
    }
    
    if (!this.serviceViewObject) return;

    this.is_master =  this.serviceViewObject[0].is_master;
    this.serviceViewObject = this.serviceViewObject[0].updated_zip_data;
    if(this.is_master){
      var mergedArray = this.serviceViewObject.serviceOperators.serviceOperatorsArray.concat(this.serviceViewObject.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj)).concat(this.serviceViewObject.serviceVessels.ServiceVesselUniqueOperators.map((obj: { operator_name: any; }) => obj));
    }else{
      var mergedArray = this.serviceViewObject.serviceAlliance.ServiceAllianceArray.service_operator_array.concat(this.serviceViewObject.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj)).concat(this.serviceViewObject.serviceVessels.ServiceVesselUniqueOperators.map((obj: { operator_name: any; }) => obj));
    }

    this.serviceViewObject.serviceOperators.serviceOperatorsArray = Array.from(new Set(mergedArray));
    this.serviceViewObject = [this.serviceViewObject];
  }
  closeServiceModal() {
    $('#viewServiceModal').modal('hide');
  }
  // viewService(serviceId: any, serviceName: string, updated_date: Date) {
  //   this.showLoader();    
  //   this.api
  //     .getSearch('get-archive-service-logs', {
  //       service_id: serviceId,
  //       service_name: serviceName,
  //       updated_date: updated_date,
  //     })
  //     .subscribe({
  //       next: (response: any) => {
  //         this.serviceViewObject = [response.data];
  //         var mergedArray = response.data.serviceAlliance.ServiceAllianceArray.service_operator_array.concat(response.data.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj.operator_name)).concat(response.data.serviceOperators.serviceOperatorsArray.map((obj: { operator_name: any; }) => obj.operator_name));
  //         this.serviceViewObject[0].serviceOperators.serviceOperatorsArray = Array.from(new Set(mergedArray));
  //         setTimeout(() => {
  //           $('#viewServiceModal').modal('show');
  //           this.hideLoader();
  //         }, 200);
  //       },
  //       error: (error: any) => {
  //         this.hideLoader();
  //       },
  //       complete: () => {
  //         setTimeout(() => {
  //           this.hideLoader();
  //         }, 2000);
  //       },
  //     });
  // }
  // closeServiceModal() {
  //   $('#viewServiceModal').modal('hide');
  // }
}
