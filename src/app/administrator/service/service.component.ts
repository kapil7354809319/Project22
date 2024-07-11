import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CustomValidationService } from '../../services/custom-validation.service';
import { DataServiceService } from '../../services/data-service.service';

import { Location } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent {
  serviceCheckboxForm!: FormGroup;
  serviceForm!: FormGroup;
  serviceDataForm!: FormGroup;
  serviceSearchForm!: FormGroup;
  serviceSearchBox!: FormGroup;
  allianceList: any;
  routingList: any;
  serviceTypeList: any;
  serviceStatusList: any;
  rcdcode: any;
  rcdshow: boolean = false;
  weekdays: any;
  regionToTagsSettings: IDropdownSettings = {};
  operatorTagsSettings: IDropdownSettings = {};
  vesselTagsSettings: IDropdownSettings = {};
  port: any;
  tradeRouteList: any;
  operator: any;
  vessel: any;
  vesselList: any;
  topform!: string;
  portServiceform!: string;
  vesselForm!: string;
  checkedCheckboxCount: number = 0;
  formValues: any;
  errorDetails: any = [];
  serviceViewObject: any;
  newVessels: any;
  serializeData: any;
  serviceList: any;
  pagination: any;
  fromStart: any;
  per_page: any;
  total: any;
  searchApply: boolean = false;
  serviceFrequency: any;
  serviceTradeRoute: any;
  year: any;
  month: any;
  serviceStatusFilter: any;
  roundVal!: number;
  roundValPhasedOut!: number;
  firstPort: boolean = false;
  lastPort: boolean = false;
  isDuplicate: boolean = false;
  serviceViewObjectBtn: any;
  selectedAll = false;
  checkedCount = 0;
  checkedAll = 0;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  tabActive: string = 'Search';
  oldLimit: any;
  getPerPageCount!: number[];
  serviceName: any;
  selectVesselOperators: any;
  serviceFilterOption:any;
  totalNumberOfDays: number | undefined;
  ServiceType:any;
  service_name: any='';
  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService,
    private CustomValidation: CustomValidationService,
    public DataService: DataServiceService
  ) {
    this.weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    this.getPerPageCount = this.api.getPerPageCount();
  }
  @ViewChild('scrollTarget') scrollTarget!: ElementRef;
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

  // calculateFrequency() {
  //   const service_start_date_current = this.serviceForm.get('service_start_date_current')?.value;
  //   const service_end_date_current = this.serviceForm.get('service_end_date_current')?.value;
  //   const total_vessel = this.serviceForm?.get('vessel_operator').length;

  //   const startDay = new Date(service_start_date_current);
  //   const endDay = new Date(service_end_date_current);
  //   const millisecondsPerDay = 1000 * 60 * 60 * 24;

  //   const millisBetween = endDay.getTime() - startDay.getTime();
  //   const days = millisBetween / millisecondsPerDay;
  //   const voyage_days = Math.floor(days);
  //   const frequency = Math.round(voyage_days / total_vessel);

  //   return frequency;
  // }

  scrollToTarget() {
    setTimeout(() => {
      const targetElement = this.scrollTarget.nativeElement;
      targetElement.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
    }, 300);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.year = params['year'] ? +params['year'] : '';
      this.month = params['month'];
      this.serviceName = params['service'];
      if(this.year){
        this.ServiceType = "Archive";
      }
    });

    const currentRoute = this.router.url;
    // Set the active tab based on the current route
    if (currentRoute.includes('addnew')) {
      this.setActiveTab('addnew');
    } else if (currentRoute.includes('search')) {
      this.setActiveTab('search');
    }

    this.showLoader();
    this.vesselDefualt();
    this.serviceForm = this.fb.group({
      object_source: ['', [Validators.required]],
      Performa_frequency: ['', [Validators.required]],
      service_frequency: ['', [Validators.required]],
      service_name: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      wayport_comments: [''],
      drewry_reference: ['', [Validators.required, Validators.minLength(6)]],
      alliance: [''],
      service_code: ['', [Validators.required]],
      service_type: ['', [Validators.required]],
      service_status: ['', [Validators.required]],
      canal_id: [''],
      service_start_date: ['', [Validators.required]],
      round_voyage_end_date: ['', [Validators.required]],
      round_voyage_start_date: ['', [Validators.required]],
      servicePort: this.fb.array([]),
      serviceAlias: this.fb.array([]),
      serviceVessel: this.fb.array([]),
      tradeService: this.fb.array([]),
    });

    this.serviceCheckboxForm = this.fb.group({
      serviceCheckbox: this.fb.array([]),
    });

    this.serviceDataForm = this.fb.group({
      save: ['Save'],
      sendServiceObject: [''],
      newVessel: [''],
      service_name: '',
      alliance: '',
      total_vessel: '',
      active_vessel: '',
      missed_vessel: '',
      round_voyage_days: '',
      performa_frequency: '',
      average_capacity: '',
      remarks: '',
      id_for_edit: '',
    });

    this.serviceSearchForm = this.fb.group({
      search: [1],
      service_name: [''],
      alliance: [''],
      service_frequency: [''],
      service_code: [''],
      service_type: [''],
      canal_id: [''],
      trade_route: [''],
      drewry_service_name: [''],
      service_status: [''],
    });

    this.serviceSearchBox = this.fb.group({
      searching: [''],
      service_status: [''],
      search: [1],
    });

    this.api.get('set-service-status-dropDown').subscribe({
      next: (response: any) => {
        this.serviceFilterOption = response.data.service_status_drop_down;
        this.serviceStatusList = this.sanitizer.bypassSecurityTrustHtml(
          "<option value=''>All</option>" +
          response.data.service_status_drop_down
        );
        this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml(
          "<option value=''>All</option>" +
          response.data.service_status_drop_down
        );
      },
      error: (error: any) => { },
      complete: () => { },
    });

    if (this.serviceName) {
      this.serviceSearchForm.get('service_name')?.setValue(this.serviceName);
      this.onSearch();
    } else {
      this.initializeData();
    }
    this.serviceForm.get('object_source')?.setValue('from_screen');
    this.addPort();
    this.addAlias();
    this.addVessel();

    this.api.get('get-alliance').subscribe({
      next: (response: any) => {
        this.allianceList = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    this.api.get('get-routing').subscribe({
      next: (response: any) => {
        this.routingList = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    this.api.get('get-service-type').subscribe({
      next: (response: any) => {
        this.serviceTypeList = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    /********************/
    this.api.get('get-port').subscribe({
      next: (response: any) => {
        this.port = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.operator = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    this.regionToTagsSettings = {
      idField: 'port_id',
      textField: 'port_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
      closeDropDownOnSelection:true
    };

    this.operatorTagsSettings = {
      idField: 'operator_id',
      textField: 'operator_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    this.vesselTagsSettings = {
      idField: 'vessel_id',
      textField: 'vessel_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    this.api.get('get-service-frequency').subscribe({
      next: (response: any) => {
        this.serviceFrequency = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

    this.api.get('get-service-trade-route').subscribe({
      next: (response: any) => {
        this.serviceTradeRoute = response.data;
      },
      error: (error: any) => { },
      complete: () => { },
    });

  }

  initializeData() {
    const callAPI = this.year ? 'get-archive-service' : 'get-service';
    const requestData = this.year
      ? { paginate: '1', archivedYear: this.year, archivedMonth: this.month }
      : null;
    const ParamData = this.year ? { param: true } : null;
    const apiUrl = requestData
      ? `${callAPI}?${Object.entries(requestData)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
      : callAPI;
    this.api.getWithPaginate(apiUrl, ParamData).subscribe({
      next: (response: any) => {
        this.serviceList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.serviceCheckboxInit(response.data.data);
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => { },
    });
  }

  serviceCheckboxInit(data: any) {
    const serviceCheckboxFormArray = this.serviceCheckboxForm.get(
      'serviceCheckbox'
    ) as FormArray;
    data.forEach((isServiceList: any) => {
      serviceCheckboxFormArray.push(
        this.createServieListAddToArchiveFormGroup(isServiceList)
      );
    });
  }

  createServieListAddToArchiveFormGroup(tradeRoute: any) {
    return this.fb.group({
      checkboxinput: new FormControl(false),
      serviceId: [],
    });
  }

  otherSearch() {
    this.showLoader();
    if (this.serviceSearchBox.valid) {
      const requestDatamerge = {
        ...this.serviceSearchForm.value,
        ...this.serviceSearchBox.value
      };
      const callAPI = this.year ? 'get-archive-service' : 'get-service';
      const requestData = this.year ? { search: '1', archivedYear: this.year, archivedMonth: this.month, searching: this.serviceSearchBox?.get('searching')?.value, service_status: this.serviceSearchBox?.get('service_status')?.value } : requestDatamerge;
      this.api.getSearch(callAPI, requestData).subscribe({
        next: (response: any) => {
          this.sortDirection = '';
          this.serviceList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.serviceCheckboxInit(response.data.data);
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
  }

  resetSearchForm() {
    this.serviceSearchForm.reset();
    this.serviceSearchBox.reset();
    this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value=''>All</option>"+this.serviceFilterOption);
    this.serviceSearchForm.patchValue({
      search: [1],
      service_name: [''],
      alliance: [''],
      service_frequency: [''],
      service_code: [''],
      service_type: [''],
      canal_id: [''],
      trade_route: [''],
      drewry_service_name: [''],
      service_status: [''],
    });
    this.searchApply = false;
    this.initializeData();
  }

  onSearch() {
    if (this.serviceSearchForm.valid) {
      this.showLoader();
      this.api
        .getSearch('get-service', this.serviceSearchForm.value)
        .subscribe({
          next: (response: any) => {
            this.searchApply = true;
            if (response.status === true) {
              this.sortDirection = '';
              this.serviceList = response.data.data;
              this.pagination = response.data.links;
              this.fromStart = {
                from: response.data.from,
                current_page: response.data.current_page,
              };
              this.per_page = response.data.per_page;
              this.total = response.data.total;
              this.serviceCheckboxInit(response.data.data);
              this.hideLoader();
              if (this.serviceSearchForm.get('service_status')?.value !== '') {
                var serviceStatus = this.serviceSearchForm.get('service_status')?.value;
                if (serviceStatus === '1') {
                  this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value='1'>Active</option>");
                } else if (serviceStatus === '2') {
                  this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value='2'>Inactive</option>");
                } else if (serviceStatus === '3') {
                  this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value='3'>Suspended</option>");
                } else if (serviceStatus === '4') {
                  this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value='4'>Shelved</option>");
                } else if (serviceStatus === '5') {
                  this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value='5'>In Service</option>");
                }
                this.serviceSearchBox.get('service_status')?.setValue(serviceStatus);  
              }else{
                this.serviceStatusFilter = this.sanitizer.bypassSecurityTrustHtml("<option value=''>All</option>"+this.serviceFilterOption);
              }
              this.serviceSearchBox.get('searching')?.setValue('');     
            } else {
              this.toasterService.error(response.error, '');
              this.hideLoader();
            }
          },
          error: (error: any) => {
            this.toasterService.error(error, '');
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
          },
        });
    }
  }

  changePagination(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.serviceList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.serviceCheckboxInit(response.data.data);
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

  onPerPageChange(event: any) {
    this.showLoader();
    const callAPI = this.year ? 'get-archive-service' : 'get-service';
    const requestData = this.year
      ? {
        perPage: this.per_page,
        archivedYear: this.year,
        archivedMonth: this.month,
      }
      : false;
    const url = this.pagination[1].url;
    const params = new URLSearchParams(url.split('?')[1]);
    const parameters: { [key: string]: string } = {};
    params.forEach((value, key) => {
      parameters[key] = value;
    });
    /*************************************************************/
    delete parameters['page'];
    this.oldLimit = parameters['limit'] ? parameters['limit'] : 20;
    const currentPage = Math.ceil(
      (this.fromStart.current_page * this.oldLimit) / this.per_page
    );
    const totalPages = Math.ceil(this.total / this.oldLimit);
    let paginationMove = Math.ceil(
      currentPage / (this.per_page / this.oldLimit || 1)
    );
    if (this.oldLimit !== this.per_page) {
      this.oldLimit = this.per_page;
      const newCurrentPage = Math.ceil(
        (currentPage * this.oldLimit) / this.per_page
      );
      paginationMove = Math.ceil(
        newCurrentPage / (this.per_page / this.oldLimit || 1)
      );
      if (paginationMove > totalPages) {
        paginationMove = totalPages;
      }
    }
    /*********************************************************/
    const additionalParams = {
      limit: this.per_page,
      page: paginationMove.toString(),
    };
    let allParams: { [key: string]: string } = {
      ...parameters,
      ...additionalParams,
      ...requestData,
    };
    this.api.getWithPerPage(callAPI, '', allParams, true).subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.serviceList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };
          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.serviceCheckboxInit(response.data.data);
        }
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

  getEditServiceUrl(id: number): string {
    let url = `administrator/edit-service/${id}`;
    if (this.year) {
      url += `?year=${this.year}&month=${this.month}`;
    }
    return url;
  }
  
  editSelect(id: number) {
    const url = this.getEditServiceUrl(id);
    window.open(url, '_blank');
    $('#viewServiceModal').modal('hide');
  }

  deleteData(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '600px',
      data: {
        name: name,
        id: id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const reason = result.reason; // Get the textarea value
        this.deleteService(id, name, reason);
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  deleteService(id: number, name: string, reason: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        const callAPI = this.year ? 'delete-archive-service' : 'delete-service';
        const data = { log: reason };
        this.api.deleteWithData(callAPI + '/' + id, data).subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.toasterService.success(
                environment.DATADELETEMESSAGE,
                environment.DATADELETETITLEMESSAGE
              );
              this.initializeData();
            } else {
              this.toasterService.error(response.error, '');
              this.hideLoader();
            }
          },
          error: (error: any) => {
            this.toasterService.error(error.error.message + ' - ' + name);
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
            // this.hideLoader();
          },
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  handleAllianceChange(event: any) {
    const total_vessel_id = ','+this.serviceForm.get('serviceVessel')?.value.map((item: { vessel: any; }) => item.vessel).join(',');
    this.api
      .post('service-name-operator', {
        total_vessel_id: total_vessel_id,
        alliance_id: event.target.value,
        service_code: this.serviceForm?.get('service_code')?.value,
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.serviceForm.patchValue({
              service_name: response.data.service_name_with_code,
            });
            this.service_name = response.data.service_name_without_code;
          }
          this.onFormCheckValid(false);
        },
        error: (error: any) => { },
        complete: () => { },
      });
  }

  handleAllianceChange_Vessel() {
    setTimeout(() => {
    const total_vessel_id = ','+this.serviceForm.get('serviceVessel')?.value.map((item: { vessel: any; }) => item.vessel).join(',');
    if(total_vessel_id){
    this.api
      .post('service-name-operator', {
        total_vessel_id: total_vessel_id,
        alliance_id:this.serviceForm?.get('alliance')?.value,
        service_code: this.serviceForm?.get('service_code')?.value,
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.serviceForm.patchValue({
              service_name: response.data.service_name_with_code,
            });
            this.service_name = response.data.service_name_without_code;
          }
          this.onFormCheckValid(false);
        },
        error: (error: any) => { },
        complete: () => { },
      });
    }
  },0);
  }

  serviceNameChange() {
    setTimeout(() => {
      const serviceVessels = this.serviceForm.get('serviceVessel')?.value || [];
      const uniqueOperatorsSet = new Set<string>();

      // Collect unique operator names
      serviceVessels.forEach((vessel: any) => {
        uniqueOperatorsSet.add(vessel.vessel_operator);
      });

      // Convert the Set to an array and join with '/'
      const operators = Array.from(uniqueOperatorsSet).join('/');

      // Update the service_name in the form
      const service = this.serviceForm?.get('service_name')?.value || '';
      const alliance = this.serviceForm?.get('alliance')?.value || '';
      if (service !== '') {
        if (alliance == '') {
          this.serviceForm
            .get('service_name')
            ?.setValue(
              operators + ' -' + this.serviceForm?.get('service_code')?.value
            );
        } else {
          const getAlince = service.split('/');
          this.serviceForm
            .get('service_name')
            ?.setValue(
              getAlince[0] +
              '/' +
              operators +
              ' -' +
              this.serviceForm?.get('service_code')?.value
            );
        }
      }
    }, 0);
  }

  serviceCodeChange() {
    var service = this.service_name;
    if (service != '') {
      this.serviceForm
        .get('service_name')
        ?.setValue(
          service + ' - ' + this.serviceForm?.get('service_code')?.value
        );
    } else {
      this.serviceForm
        .get('service_name')
        ?.setValue(
          service + '- ' + this.serviceForm?.get('service_code')?.value
        );
    }
  }

  removeFragmentFromUrl(tab: string) {
    const currentUrl = this.location.path();
    const updatedUrl = currentUrl.split('#')[0];
    this.location.replaceState(updatedUrl);
    this.tabActive = tab;
  }

  setActiveTab(tabId: string) {
    setTimeout(() => {
      const removeClassFromElements = (selector: string, className: string) => {
        const elements = document.querySelectorAll(
          selector
        ) as NodeListOf<HTMLElement>;
        elements.forEach((element) => element.classList.remove(className));
      };
      removeClassFromElements('.nav-links', 'active');
      removeClassFromElements('.tab-panes', 'active');
      const addClassToElement = (selector: string, className: string) => {
        const element = document.querySelector(selector);
        if (element) {
          element.classList.add(className);
        }
      };
      addClassToElement(`a[data-toggle="tab"][href="#${tabId}"]`, 'active');
      addClassToElement(`#${tabId}`, 'active');
    }, 10);
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      this.showLoader();
      this.formValues = this.serviceForm.getRawValue();
      this.api.post('service', this.formValues).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.serviceViewObject = [response.data];
            var mergedArray = response.data.newOperators.concat(response.data.serviceAlliance.ServiceAllianceArray.service_operator_array).concat(response.data.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj.operator_name));
            this.serviceViewObject[0].serviceOperators.serviceOperatorsArray = Array.from(new Set(mergedArray));
            this.newVessels = response.newVessel;
            this.serializeData = response.serializeData;
            $('#myModal').modal('show');
            this.hideLoader();
          }
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  onSaveData() {
    if (this.serviceDataForm.valid) {
      this.showLoader();
      this.api.post('save-service', this.serviceDataForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.hideLoader();
            this.toasterService.success(
              environment.DATAINSERTMESSAGE,
              environment.DATAINSERTTITLEMESSAGE
            );
            $('#myModal').modal('hide');
            this.resetAll();
          }else{
            this.hideLoader();
            this.toasterService.error(
              environment.DATAALREADYINSERTMESSAGE
            );
            $('#myModal').modal('hide');
          }
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  dateValueChanged() {
    this.valueChanged();
    setTimeout(() => {
      const startDate = this.serviceForm.get('round_voyage_start_date')?.value;
      const endDate = this.serviceForm.get('round_voyage_end_date')?.value;
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const timeDiff = endDateObj.getTime() - startDateObj.getTime();
      const numberOfDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      if(numberOfDays){
      this.totalNumberOfDays = numberOfDays;
      }
      const servicePortArray: FormArray = this.serviceForm.get('servicePort') as FormArray;
      if (servicePortArray.length >= 2) {
        const lastPortIndex = servicePortArray.length - 1;
        const lastPortFormGroup = servicePortArray.at(lastPortIndex) as FormGroup;
        const arrivalDaysControl = lastPortFormGroup.get('arrival_days');
        if (arrivalDaysControl && arrivalDaysControl.value !== null) {
          const arrivalDaysValue = Number(arrivalDaysControl.value);
          if (arrivalDaysValue === numberOfDays) {
            arrivalDaysControl.setValue(arrivalDaysValue);
            arrivalDaysControl.markAsDirty();
          } else {
            arrivalDaysControl.setValue(arrivalDaysValue);
            arrivalDaysControl.markAsDirty();
          }
        }
      }
      this.servicePostValid(false);
    }, 10);
  }

  valueChanged() {
    var total_vessel = 0;
    var service_start_date_current = this.serviceForm.get(
      'round_voyage_start_date'
    )?.value;
    var service_end_date_current = this.serviceForm.get(
      'round_voyage_end_date'
    )?.value;
    setTimeout(() => {
      var checkVessel = $('input[formcontrolname="vessel_operator"], select[formcontrolname="vessel_operator"]').val();
      $(
        'input[formcontrolname="vessel_operator"], select[formcontrolname="vessel_operator"]'
      ).each(function () {
        total_vessel++;
      });
      var startDay = new Date(service_start_date_current);
      var endDay = new Date(service_end_date_current);
      var millisecondsPerDay = 1000 * 60 * 60 * 24;
      var millisBetween = endDay.getTime() - startDay.getTime();
      var days = millisBetween / millisecondsPerDay;
      if (days > 0 && (total_vessel > 1 && checkVessel != '')) {
        var voyage_days = Math.floor(days);
        var frequency = Math.round(voyage_days / total_vessel);
        this.serviceForm.get('service_frequency')?.setValue(frequency);
        this.onFormCheckValid(false);
      }
    }, 500);
  }

  closeModal() {
    $('#myModal').modal('hide');
  }

  onFormCheckValid(display: boolean = true) {
    if (display) {
      this.api.showAllValidationErrors(this.serviceForm);
    }
    const isServiceNameValid = this.serviceForm.get('service_name')?.valid;
    const isObjectSourceValid = this.serviceForm.get('object_source')?.valid;
    // const drewryReferenceControl = this.serviceForm.get('drewry_reference');
    // const isDrewryReferenceValid = drewryReferenceControl?.valid;
    if ($('input[formcontrolname="drewry_reference"]').val() != '') {
      var isDrewryReferenceValid = true;
    } else {
      var isDrewryReferenceValid = false;
    }
    const isServiceFrequencyValid =
      this.serviceForm.get('service_frequency')?.valid;
    const isPerformaFrequencyValid =
      this.serviceForm.get('Performa_frequency')?.valid;
    const isServiceCodeValid = this.serviceForm.get('service_code')?.valid;
    const isServiceTypeValid = this.serviceForm.get('service_type')?.valid;
    const isServiceStatuseValid = this.serviceForm.get('service_status')?.valid;
    const isCanalValid = this.serviceForm.get('canal_id')?.valid;
    const isServiceStartDateValid =
      this.serviceForm.get('service_start_date')?.valid;
    const isRoundVoyageEndDateValid = this.serviceForm.get(
      'round_voyage_end_date'
    )?.valid;
    const isRoundVoyageStartDateValid = this.serviceForm.get(
      'round_voyage_start_date'
    )?.valid;
    const remarkValid = this.serviceForm.get('remarks')?.valid;

    if (
      isServiceNameValid &&
      isPerformaFrequencyValid &&
      isServiceFrequencyValid &&
      isDrewryReferenceValid &&
      isServiceCodeValid &&
      isServiceTypeValid &&
      isServiceStatuseValid &&
      isCanalValid &&
      isServiceStartDateValid &&
      isRoundVoyageEndDateValid &&
      isRoundVoyageStartDateValid &&
      remarkValid
    ) {
      this.topform = 'valid';
    } else {
      this.topform = 'invalid';
    }
  }

  setToDateMin() {
    this.serviceForm
      .get('round_voyage_end_date')
      ?.setValidators([
        Validators.required,
        Validators.min(this.serviceForm.get('round_voyage_start_date')?.value),
      ]);
    this.serviceForm?.get('round_voyage_end_date')?.updateValueAndValidity();
  }

  // resetForm() {
  //   this.serviceForm.patchValue({
  //     alliance: '',
  //     service_status: '',
  //     service_type: '',
  //     canal_id: '',
  //     Performa_frequency: '',
  //     service_frequency: '',
  //     service_name: '',
  //     remarks: '',
  //     wayport_comments: '',
  //     drewry_reference: '',
  //     service_code: '',
  //     service_start_date: '',
  //     round_voyage_end_date: '',
  //     round_voyage_start_date: '',
  //   });
  //   this.serviceForm.get('drewry_reference')?.enable();
  //   this.topform = 'invalid';
  // }

  resetForm() {
    this.serviceForm.patchValue({
      alliance: '',
      service_status: '',
      service_type: '',
      canal_id: '',
      Performa_frequency: '',
      service_frequency: '',
      service_name: '',
      remarks: '',
      wayport_comments: '',
      drewry_reference: '',
      service_code: '',
      service_start_date: '',
      round_voyage_end_date: '',
      round_voyage_start_date: '',
    });
    this.serviceForm.get('drewry_reference')?.enable();
    [
      'alliance',
      'service_status',
      'service_type',
      'canal_id',
      'Performa_frequency',
      'service_frequency',
      'service_name',
      'remarks',
      'wayport_comments',
      'drewry_reference',
      'service_code',
      'service_start_date',
      'round_voyage_end_date',
      'round_voyage_start_date',
    ].forEach((key) => {
      this.serviceForm.get(key)?.markAsUntouched();
    });
    this.topform = 'invalid';
  }

  resetFormPort() {
    (this.serviceForm.get('servicePort') as FormArray).clear();
    this.addPort();
    this.portServiceform = 'invalid';
    this.tradeRouteList = [];
  }

  resetFormVessel() {
    (this.serviceForm.get('serviceVessel') as FormArray).clear();
    (this.serviceForm.get('serviceAlias') as FormArray).clear();
    this.addAlias();
    this.addVessel();
    this.vesselForm = 'invalid';
  }

  resetAll() {
    this.resetForm();
    this.resetFormPort();
    this.resetFormVessel();
  }

  createRcdCode() {
    this.rcdshow = true;
    this.api.post('get-rcd-code', { rcd_code: 1 }).subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.rcdcode = response.data;
          this.serviceForm.get('drewry_reference')?.setValue(this.rcdcode);
          this.rcdshow = false;
          this.serviceForm.get('drewry_reference')?.disable();
          this.onFormCheckValid(false);
        }
      },
      error: (error: any) => { },
      complete: () => {
        // Handle completion if needed
      },
    });
  }

  resetRcdCode() {
    this.serviceForm.patchValue({
      drewry_reference: '',
    });
    this.rcdshow = false;
    this.rcdcode = '';
    this.serviceForm.get('drewry_reference')?.enable();
    this.onFormCheckValid(false);
    this.topform = 'invalid';
  }

  /********* Add Port ********/
  servicePort(): FormArray {
    return this.serviceForm.get('servicePort') as FormArray;
  }

  newServicePort(): FormGroup {
    return this.fb.group({
      port_up: [''],
      port: ['', [Validators.required]],
      arrival_days: ['', [Validators.required]],
      departure_days: ['', [Validators.required]],
      arrival_day: ['', [Validators.required]],
      departure_day: ['', [Validators.required]],
    });
  }

  addPort() {
    this.servicePort().push(this.newServicePort());
    this.servicePostValid(false);
  }

  removePort(i: number) {
    this.servicePort().removeAt(i);
    this.servicePostValid(false);
    this.portServiceform = 'invalid';
    setTimeout(() => {
      this.onItemSelect(i, false);
    }, 100);
  }

  /********* Alias ********/
  serviceAlias(): FormArray {
    return this.serviceForm.get('serviceAlias') as FormArray;
  }

  newServiceAlias(): FormGroup {
    return this.fb.group({
      operator: ['', [Validators.required]],
      alias_name: ['', [Validators.required]],
      schedule_hyperlink: [''],
    });
  }

  addAlias() {
    this.serviceAlias().push(this.newServiceAlias());
    this.serviceVesselValid(false);
  }

  removeAlias(i: number) {
    this.serviceAlias().removeAt(i);
    this.serviceVesselValid(false);
  }

  /********* Vessel ********/
  serviceVessel(): FormArray {
    return this.serviceForm.get('serviceVessel') as FormArray;
  }

  newserviceVessel(): FormGroup {
    return this.fb.group({
      vessel: '',
      vessel_name: ['', [Validators.required]],
      teu_capacity: '',
      vessel_operator: '',
      ownership_status: '',
    });
  }

  currentTBN: number = 1;
  currentPhasedOut: number = 1;
  currentMissedVoyage: number = 1;

  MissedVoyage(): FormGroup {
    const missedVoyageValue = `Missed voyage${this.currentMissedVoyage}`;
    this.currentMissedVoyage++;
    return this.fb.group({
      vessel: missedVoyageValue,
      teu_capacity: 0,
      vessel_operator: 'Unknown',
      ownership_status: 'Owned',
      addedInput: 'select',
    });
  }

  // VesselTBN(): FormGroup {
  //   const serviceVesselArray = this.serviceForm.get(
  //     'serviceVessel'
  //   ) as FormArray;
  //   const serviceVessel = serviceVesselArray.value;
  //   var total = 0;
  //   var countFind = 0;
  //   for (let i = 0; i < serviceVessel.length; i++) {
  //     if (parseInt(serviceVessel[i]['teu_capacity']) > 0) {
  //       total += parseInt(serviceVessel[i]['teu_capacity']);
  //       countFind++;
  //     }
  //   }
  //   var roundVal = Math.round(total / countFind);
  //   const tbnValue = `TBN${this.currentTBN}`;
  //   this.currentTBN++;
  //   return this.fb.group({
  //     vessel: tbnValue,
  //     teu_capacity: roundVal,
  //     vessel_operator: '',
  //     ownership_status: 'Owned',
  //     addedInput: 'select',
  //   });
  // }

  VesselTBN(): FormGroup {
    const serviceVesselArray = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    const serviceVessel = serviceVesselArray.value;
    let total = 0;
    let countFind = 0;

    for (let i = 0; i < serviceVessel.length; i++) {
      if (
        !serviceVessel[i]['vessel'].includes('Missed voyage') &&
        parseInt(serviceVessel[i]['teu_capacity']) > 0
      ) {
        total += parseInt(serviceVessel[i]['teu_capacity']);
        countFind++;
      }
    }

    this.roundVal = Math.round(total / countFind);
    const tbnValue = `TBN${this.currentTBN}`;
    this.currentTBN++;
    return this.fb.group({
      vessel: tbnValue,
      teu_capacity: this.roundVal,
      vessel_operator: 'Unknown',
      ownership_status: 'Owned',
      addedInput: 'select',
    });
  }

  PhasedOut(): FormGroup {
    const serviceVesselArray = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    const serviceVessel = serviceVesselArray.value;
    let totalPhasedOut = 0;
    let countFindPhasedOut = 0;
    for (let i = 0; i < serviceVessel.length; i++) {
      if (
        !serviceVessel[i]['vessel'].includes('Phased out vessel') &&
        parseInt(serviceVessel[i]['teu_capacity']) > 0
      ) {
        totalPhasedOut += parseInt(serviceVessel[i]['teu_capacity']);
        countFindPhasedOut++;
      }
    }
    this.roundValPhasedOut = Math.round(totalPhasedOut / countFindPhasedOut);
    const PhasedOutValue = `Phased out vessel${this.currentPhasedOut}`;
    this.currentPhasedOut++;
    return this.fb.group({
      vessel: PhasedOutValue,
      teu_capacity: this.roundValPhasedOut,
      vessel_operator: 'Unknown',
      ownership_status: 'Owned',
      addedInput: 'select',
    });
  }

  addVessel() {
    this.serviceVessel().push(this.newserviceVessel());
    this.serviceVesselValid(false);
  }

  missedVoyage() {
    this.serviceVessel().push(this.MissedVoyage());
  }

  phasedOut() {
    this.serviceVessel().push(this.PhasedOut());
  }

  addVesselTBN() {
    this.serviceVessel().push(this.VesselTBN());
  }

  removeVessel(i: number) {
    var vessel_value = this.serviceForm.get('serviceVessel')?.get(i.toString())?.get('vessel')?.value;
    this.serviceVessel().removeAt(i);
    this.valueChanged();
    if(vessel_value.substring(0, 17) != "Phased out vessel" && vessel_value.substring(0, 3) != "TBN" && vessel_value.substring(0, 13) !="Missed voyage"){
      this.handleAllianceChange_Vessel();
    }
    this.serviceVesselValid(false);
  }

  // onInput(event: Event, index: number, controlName: string) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const inputValue = inputElement.value;
  //   const numericValue = inputValue.replace(/[^0-9]/g, '');
  //   inputElement.value = numericValue;
  //   if (numericValue !== '') {
  //     const weekdays = [
  //       'Sunday',
  //       'Monday',
  //       'Tuesday',
  //       'Wednesday',
  //       'Thursday',
  //       'Friday',
  //       'Saturday',
  //     ];
  //     const currentDate = new Date();
  //     currentDate.setDate(currentDate.getDate() + parseInt(inputValue));
  //     const upcomingDayIndex = currentDate.getDay();
  //     if (controlName === 'arrival_days') {
  //       this.serviceForm
  //         .get('servicePort')
  //         ?.get(index.toString())
  //         ?.get('arrival_day')
  //         ?.setValue(weekdays[upcomingDayIndex]);
  //     } else if (controlName === 'departure_days') {
  //       this.serviceForm
  //         .get('servicePort')
  //         ?.get(index.toString())
  //         ?.get('departure_day')
  //         ?.setValue(weekdays[upcomingDayIndex]);
  //     }
  //   }
  // }

  onInput(event: Event, index: number, controlName: string) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue: string = inputElement.value;
    const numericValue: string = inputValue.replace(/[^0-9]/g, '');
    inputElement.value = numericValue;

    if (numericValue !== '') {
      const weekdays: string[] = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];

      const numericInput = parseInt(numericValue, 10);
      const calculatedIndex = numericInput % weekdays.length;
      const selectedWeekday = weekdays[calculatedIndex];
      if (controlName === 'arrival_days') {
        const servicePort = this.serviceForm.get('servicePort');
        if (servicePort) {
          const arrivalDayControl = servicePort
            .get(index.toString())
            ?.get('arrival_day');
          if (arrivalDayControl) {
            arrivalDayControl.setValue(selectedWeekday);
          }
        }
      } else if (controlName === 'departure_days') {
        const servicePort = this.serviceForm.get('servicePort');
        if (servicePort) {
          const departureDayControl = servicePort
            .get(index.toString())
            ?.get('departure_day');
          if (departureDayControl) {
            departureDayControl.setValue(selectedWeekday);
          }
        }
      }
    }

    this.servicePostValid(false);
  }

  onItemDeSelect(index: number) {
    this.serviceForm
      .get('servicePort')
      ?.get(index.toString())
      ?.get('port_up')
      ?.setValue('');
    this.onItemSelect(index, false);
    this.servicePostValid(false);
  }

  newDataArray: any[] = [];
  oldArray: any[] = [];

  onItemSelect(index: number, showModelConfirm: boolean = true) {
    const servicePortArray: FormArray = this.serviceForm.get(
      'servicePort'
    ) as FormArray;
    const servicePortValues = servicePortArray.value;
    const portIds: any[] = [];
    servicePortValues.forEach((item: { port: any[] }) => {
      if (Array.isArray(item.port)) {
        item.port.forEach((portItem) => {
          if (portItem.port_id) {
            portIds.push(portItem.port_id);
            this.serviceForm
              .get('servicePort')
              ?.get(index.toString())
              ?.get('port_up')
              ?.setValue(portItem.port_id + '-0');
          }
        });
      }
    });
    this.serviceForm.get('servicePort')?.get(index.toString())?.get('port_up')?.setValue(servicePortValues[index].port[0].port_id + '-0');
    if (portIds.length >= 2) {
      const portIdsString = portIds.join(',');
      this.api
        .post('get-trade-route-service', {
          port_up_array: ',' + portIdsString,
          serviceId: '',
          trade_id: '',
          wayport_percentage: '',
          wayport_comments: '',
          out_of_scope: '',
          dwt_adjustment: '',
          high_cube_adjustment: '',
          classvalid_status: '',
          vessel_deployment_flag: '',
          type: "add"
        })
        .subscribe({
          next: (response: any) => {
            if (response.status === true) {
              if (response.data.length > 0) {
                this.tradeRouteList = response.data;
                this.newDataArray = [];

                //for change trade_route_id check
                response.data.forEach((item: any) => {
                  this.newDataArray.push(item.trade_route_id);
                });
                this.tradeRouteArrayCheck(this.newDataArray);
                this.populateTradeServiceFormArray();
              } else {
                this.tradeRouteList = [];
              }
            } else {
              this.toasterService.error(response.error, '');
              this.hideLoader();
            }
          },
          error: (error: any) => {
            this.toasterService.error(error, '');
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
          },
        });
    } else {
      this.tradeRouteList = [];
    }
  }

  tradeRouteArrayCheck(newDataArray: any[]) {
    const sortedNewDataArray = newDataArray.slice().sort();
    const sortedOldArray = this.oldArray.slice().sort();
    var j = 0;
    for (let i = 0; i < sortedNewDataArray.length; i++) {
      if (sortedNewDataArray[i] !== sortedOldArray[i]) {
        j++;
      }
    }
    if (j > 0) {
      this.ConfirmationDialog();
    }
    this.oldArray = [];
    newDataArray.forEach((value: any) => {
      this.oldArray.push(value);
    });
  }

  populateTradeServiceFormArray() {
    const tradeServiceFormArray = this.serviceForm.get(
      'tradeService'
    ) as FormArray;
    tradeServiceFormArray.clear();
    this.tradeRouteList.forEach((tradeRoute: any) => {
      tradeServiceFormArray.push(this.createTradeServiceFormGroup(tradeRoute));
    });
    tradeServiceFormArray.controls.forEach((control: AbstractControl) => {
      const formGroup = control as FormGroup;
      formGroup.get('service_primary_trade_route')?.setValue(false);
      this.checkedCheckboxCount = 0;
    });
  }

  createTradeServiceFormGroup(tradeRoute: any) {
    return this.fb.group({
      service_primary_trade_route: new FormControl(false),
      service_trade_route_name: new FormControl(tradeRoute.trade_route_name),
      service_trade_route: new FormControl(tradeRoute.trade_route_id),
      trade_route_id: new FormControl(tradeRoute.trade_route_id),
      valid: new FormControl(tradeRoute.valid_status),
      way_port: new FormControl(tradeRoute.wayport_percentage),
      out_of_scope: new FormControl(tradeRoute.out_of_scope),
      dwt_adjustment: new FormControl(tradeRoute.dwt_adjustment),
      high_cube_adjustment: new FormControl(tradeRoute.high_cube_adjustment),
      vessel_deployment_flag: new FormControl(true),
    });
  }

  onKeyUp(event: KeyboardEvent) {
    this.CustomValidation.numericFilter(event);
    this.CustomValidation.validatePercentageValue(event);
  }

  onItemVessel(indexs: number) {
    const serviceVesselArray = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    const serviceVesselValues = serviceVesselArray.value;
    const valuesForIndex = serviceVesselValues[indexs];
    if (Array.isArray(valuesForIndex?.vessel_name)) {
      const vesselIds = valuesForIndex.vessel_name
        .filter((vesselItem: { vessel_id: any }) => vesselItem?.vessel_id)
        .map((vesselItem: { vessel_id: any }) => vesselItem.vessel_id);

      this.api
        .post('get-vessel-details', { total_vessel_id: vesselIds })
        .subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.vesselList = response.data;
              this.handleAllianceChange_Vessel();
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('vessel')
                ?.setValue(this.vesselList?.vessel_id + '-0');
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('teu_capacity')
                ?.setValue(this.vesselList?.teu_capacity);
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('vessel_operator')
                ?.setValue(this.vesselList?.operator.operator_name);
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('ownership_status')
                ?.setValue(this.vesselList?.ownership_status);
            } else {
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('vessel')
                ?.setValue('');
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('teu_capacity')
                ?.setValue('');
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('vessel_operator')
                ?.setValue('');
              this.serviceForm
                .get('serviceVessel')
                ?.get(indexs.toString())
                ?.get('ownership_status')
                ?.setValue('');
            }
            this.valueChanged();
            this.serviceVesselValid(false);
          },
          error: (error: any) => { },
          complete: () => {
            this.checkDuplicateVessel();
            this.vesselOperator();
          },
        });
    }
  }

  servicePostValid(showToster: boolean = true) {
    const startDate = this.serviceForm.get('round_voyage_start_date')?.value;
    const endDate = this.serviceForm.get('round_voyage_end_date')?.value;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    const numberOfDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const servicePortArray: FormArray = this.serviceForm.get(
      'servicePort'
    ) as FormArray;
    const servicePortValues = servicePortArray.value;
    if (servicePortValues.length < 2) {
      this.portServiceform = 'invalid';
      if (showToster) {
        this.toasterService.error(environment.portLessThenTwo);
      }
    }

    let portValid = true;
    if (servicePortValues.length >= 2) {
      // const i = servicePortArray.length - 1;
      var countDiff = 0;
      for (let i = 0; i < servicePortArray.length; i++) {
        const portFormGroup = servicePortArray.at(i) as FormGroup;
        Object.keys(portFormGroup.controls).forEach((controlName) => {
          const arrivalDaysControl = portFormGroup.get('arrival_days');
          const departureDaysControl = portFormGroup.get('departure_days');

          if (arrivalDaysControl) {
            const arrivalDaysValue = Number(arrivalDaysControl.value);
            if (arrivalDaysValue == numberOfDays) {
              if (i == servicePortArray.length - 1) {
                this.errorDetails[i] = false;
              }
            }
          }

          if (arrivalDaysControl && arrivalDaysControl.valid) {
            this.errorDetails[i] = false;
            const arrivalDaysValue = Number(arrivalDaysControl.value);
            for (let j = 0; j < i; j++) {
              this.errorDetails[j] = null;
              const previousArrivalDaysControl = (
                servicePortArray.at(j) as FormGroup
              ).get('arrival_days');
              if (previousArrivalDaysControl) {
                previousArrivalDaysControl.setErrors(null);
              }
            }
            if (arrivalDaysValue !== numberOfDays) {
              if (i == servicePortArray.length - 1) {
                portValid = false;
                arrivalDaysControl.setErrors({ invalidArrivalDays: true });
                this.errorDetails[i] = {
                  totalNumberOfDays: Number(numberOfDays),
                  days: arrivalDaysValue,
                };
              }
            }
          }

          if (departureDaysControl && departureDaysControl.valid) {
            const departureDaysValue = Number(departureDaysControl.value);
            const arrivalDaysValue = Number(arrivalDaysControl?.value);
            if (departureDaysValue < arrivalDaysValue) {
              portValid = false;
              departureDaysControl.setErrors({ invalidDepartureDays: true });
            }
          }

          if (
            arrivalDaysControl &&
            arrivalDaysControl.valid &&
            departureDaysControl &&
            departureDaysControl.valid
          ) {
            const departureDaysValueCheck = Number(departureDaysControl?.value);
            const arrivalDaysValueCheck = Number(arrivalDaysControl?.value);
            if (i == 0) {
              countDiff = departureDaysValueCheck - arrivalDaysValueCheck;
            }
            if (i == servicePortArray.length - 1) {
              if (
                departureDaysValueCheck - arrivalDaysValueCheck !=
                countDiff
              ) {
                portValid = false;
                this.lastPort = true;
              } else {
                this.lastPort = false;
              }
            }
          }

          const control = portFormGroup.get(controlName);
          if (control && control.invalid) {
            portValid = false;
            if (showToster) {
              control.markAsTouched();
            }
          }
        });
      }
    }

    const tradeServiceFormArray = this.serviceForm.get(
      'tradeService'
    ) as FormArray;
    const tradeServiceValues = tradeServiceFormArray.value;
    const checkedCount = tradeServiceValues.filter(
      (item: { service_primary_trade_route: any }) =>
        item.service_primary_trade_route
    ).length;
    if (portValid && servicePortValues.length >= 2) {
      if (checkedCount < 1) {
        if (showToster) {
          this.toasterService.error(
            'You have to select at least one primary trade route!'
          );
        }
        this.portServiceform = 'invalid';
      } else {
        this.portServiceform = 'valid';
      }
    } else {
      this.portServiceform = 'invalid';
    }
  }

  onItemOperator() {
    this.serviceVesselValid(false);
  }

  serviceVesselValid(showMessage: boolean = true) {
    const serviceAliasArray = this.serviceForm.get('serviceAlias') as FormArray;
    let aliasValid = true;
    for (let i = 0; i < serviceAliasArray.length; i++) {
      const aliasFormGroup = serviceAliasArray.at(i) as FormGroup;
      Object.keys(aliasFormGroup.controls).forEach((controlName) => {
        const control = aliasFormGroup.get(controlName);
        if (control && control.invalid) {
          aliasValid = false;
          if (showMessage) {
            control.markAsTouched();
          }
        }
      });
    }

    const serviceVesselArray = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    let vasselValid = true;
    for (let i = 0; i < serviceVesselArray.length; i++) {
      const vesselFormGroup = serviceVesselArray.at(i) as FormGroup;
      Object.keys(vesselFormGroup.controls).forEach((controlName) => {
        const control = vesselFormGroup.get(controlName);
        if (control && control.invalid) {
          vasselValid = false;
          if (showMessage) {
            control.markAsTouched();
          }
        }
      });
    }
    this.checkDuplicateVessel();
    if (aliasValid && vasselValid && this.isDuplicate == false) {
      this.vesselForm = 'valid';
    } else {
      this.vesselForm = 'invalid';
    }
  }

  vesselDefualt() {
    this.api.get('get-vessel-filter').subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.vessel = response.data;
        }
      },
    });
  }

  onFilterVesselChange(event: any) {
    if (event && event.length) {
      this.api.get('get-vessel-filter?search=' + event).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            if (response.data != '') {
              this.vessel = response.data;
            } else {
              this.vesselDefualt();
            }
          }
        },
      });
    } else {
      this.vesselDefualt();
    }
  }

  checkDuplicateVessel() {
    const serviceVesselArrayCheck = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    const serviceVesselValues = serviceVesselArrayCheck.value;
    const seenVesselIds: any = {};
    this.isDuplicate = false;
    serviceVesselValues.forEach((value: any) => {
      if (
        value.vessel_name &&
        value.vessel_name[0] &&
        value.vessel_name[0].vessel_id
      ) {
        const vesselId = value.vessel_name[0].vessel_id;
        if (seenVesselIds[vesselId]) {
          this.isDuplicate = true;
        } else {
          seenVesselIds[vesselId] = true;
        }
      }
    });
    if (this.isDuplicate) {
      this.vesselForm = 'invalid';
    }
  }

  vesselOperator() {
    const serviceVesselArrayCheck = this.serviceForm.get(
      'serviceVessel'
    ) as FormArray;
    const serviceVesselValues = serviceVesselArrayCheck.value;
    const uniqueVesselOperators: any[] = [];
    const seenVesselOperators: any = {}; // Object to keep track of seen vessel operators

    serviceVesselValues.forEach((value: any) => {
      if (value.vessel_operator) {
        const vesselOperator = value.vessel_operator;
        if (!seenVesselOperators[vesselOperator]) {
          seenVesselOperators[vesselOperator] = true;
          if (vesselOperator != 'Unknown') {
            uniqueVesselOperators.push(vesselOperator);
          }
        }
      }
    });
    this.selectVesselOperators = uniqueVesselOperators;
  }
  
  portServiceReset() {
    const servicePort: FormArray = this.serviceForm.get(
      'servicePort'
    ) as FormArray;
  }

  countCheckedCheckboxes(): number {
    return this.checkedCheckboxCount;
  }

  onCheckboxChange(index: number) {
    const tradeServiceFormArray = this.serviceForm.get(
      'tradeService'
    ) as FormArray;
    const formGroup = tradeServiceFormArray.at(index) as FormGroup;
    const isChecked = formGroup.get('service_primary_trade_route')?.value;

    if (isChecked) {
      this.checkedCheckboxCount++;
    } else {
      this.checkedCheckboxCount--;
    }

    if (this.checkedCheckboxCount > 1) {
      this.checkedDataConfirmation();
    } else {
      this.servicePostValid(false);
    }
  }

  checkedDataConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '550px',
      data: {
        serviceConfirm: true,
      },
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } else {
        const tradeServiceFormArray = this.serviceForm.get(
          'tradeService'
        ) as FormArray;
        tradeServiceFormArray.controls.forEach((control: AbstractControl) => {
          const formGroup = control as FormGroup;
          formGroup.get('service_primary_trade_route')?.setValue(false);
          this.checkedCheckboxCount = 0;
        });
      }
    });
  }

  ConfirmationDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        serviceConfirmData: true,
      },
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      } else {
      }
    });
  }

  viewData(serviceId: any) {
    this.showLoader();
    const callAPI = this.year ? 'edit-get-archive-service' : 'edit-get-service';
    this.api.get(callAPI + '/' + serviceId).subscribe({
      next: (response: any) => {
        this.serviceViewObjectBtn = [response.data];
        var mergedArray = response.data.serviceAlliance.ServiceAllianceArray.service_operator_array.concat(response.data.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj.operator_name)).concat(response.data.serviceVessels.ServiceVesselUniqueOperators.map((obj: { operator_name: any; }) => obj.operator_name));
        this.serviceViewObjectBtn[0].serviceOperators.serviceOperatorsArray = Array.from(new Set(mergedArray));
        $('#viewServiceModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.hideLoader();
        }, 2000);
      },
    });
  }

  closeServiceModal() {
    $('#viewServiceModal').modal('hide');
  }

  toggleAll(event: any) {
    this.selectedAll = event.target.checked;
    if (this.selectedAll) {
      this.checkedAll = 1;
    } else {
      this.checkedAll = 0;
      this.checkedCount = 0;
    }
    this.serviceList.forEach((item: any, index: any) => {
      this.toggleSingleAll(this.selectedAll, index);
    });
  }

  toggleSingleAll(event: any, index: number) {
    const formArray = this.serviceCheckboxForm.get(
      'serviceCheckbox'
    ) as FormArray;
    const control = formArray.at(index);
    control.get('checkboxinput')!.patchValue(event);
  }

  toggleSingle(event: any, index: number) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.checkedCount++;
    } else {
      this.checkedCount--;
    }
  }

  addServiceToArchive() {
    const serviceIds: any[] = [];
    const serviceCheckboxFormArray = this.serviceCheckboxForm.get(
      'serviceCheckbox'
    ) as FormArray;
    this.DataService.clearServiceIds();
    serviceCheckboxFormArray.controls.forEach((control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const serviceId = formGroup.get('serviceId')?.value;
      const isChecked = formGroup.get('checkboxinput')?.value;
      if (isChecked) {
        this.DataService.addServiceId(serviceId);
      }
    });
    this.router.navigate(['/administrator/add-service-to-archive']);
  }

  sortData(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'desc';
    }
    this.orderByColumn(column, this.sortDirection);
  }

  orderByColumn(column: string, orderBy: string) {
    this.showLoader();
    const url = this.pagination[1].url;
    const params = new URLSearchParams(url.split('?')[1]);
    const parameters: { [key: string]: string } = {};
    params.forEach((value, key) => {
      parameters[key] = value;
    });

    /*************************************************************/
    delete parameters['page'];
    this.oldLimit = parameters['limit'] ? parameters['limit'] : 20;
    const currentPage = Math.ceil(
      (this.fromStart.current_page * this.oldLimit) / this.per_page
    );
    const totalPages = Math.ceil(this.total / this.oldLimit);
    let paginationMove = Math.ceil(
      currentPage / (this.per_page / this.oldLimit || 1)
    );
    if (this.oldLimit !== this.per_page) {
      this.oldLimit = this.per_page;
      const newCurrentPage = Math.ceil(
        (currentPage * this.oldLimit) / this.per_page
      );
      paginationMove = Math.ceil(
        newCurrentPage / (this.per_page / this.oldLimit || 1)
      );
      if (paginationMove > totalPages) {
        paginationMove = totalPages;
      }
    }
    /*********************************************************/

    const additionalParams = {
      limit: this.per_page,
      orderby: orderBy,
      column: column,
      page: paginationMove.toString(),
    };
    let allParams: { [key: string]: string } = {
      ...parameters,
      ...additionalParams,
    };
    const callAPI = this.year ? 'get-archive-service' : 'get-service';
    this.api.getWithPerPage(callAPI, '', allParams, true).subscribe({
      next: (response: any) => {
        this.serviceList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.serviceCheckboxInit(response.data.data);
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
}
