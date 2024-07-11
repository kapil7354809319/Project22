import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CustomValidationService } from '../../services/custom-validation.service';
declare var $: any;

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss'],
})
export class ServiceEditComponent {
  serviceForm!: FormGroup;
  serviceDataForm!: FormGroup;
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
  vessel: any[] = [];
  newVessels: any;
  vesselList: any;
  topform!: string;
  portServiceform!: string;
  vesselForm!: string;
  checkedCheckboxCount: number = 0;
  formValues: any;
  errorDetails: any = [];
  serviceViewObject: any;
  portArray: any;
  operatorList: any;
  aliasList: any;
  vesselsList: any;
  movetoList: any;
  tradeRoutePrimary!: boolean;
  vesselDeploymentFlag!: boolean;
  serializeData: any;
  serviceData: any;
  year: any;
  month: any;
  firstPort: boolean = false;
  lastPort: boolean = false;
  roundVal!: number;
  roundValPhasedOut!: number;
  newDataArray: any[] = [];
  oldArray: any[] = [];
  isDuplicate: boolean = false;
  vesselCount!: number;
  tabActive: string = 'Edit';
  selectVesselOperators:any;
  servicePortModified: boolean = false;
  serviceAliasModified: boolean = false;
  serviceVesselModified: boolean = false;
  totalNumberOfDays: number | undefined;
  ServiceType:any;
  serviceDataLog: any;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService,
    private CustomValidation: CustomValidationService
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
  }
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

  navigateToSearch() {
    this.router.navigate(['/administrator/service'], { fragment: 'search' });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.year = +params['year'];
      this.month = params['month'];
      if(this.year){
        this.ServiceType = "Archive";
      }
    });
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
      id_for_edit: [''],
    });

    this.serviceDataForm = this.fb.group({
      update: ['Update'],
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
    });

    this.showLoader();
    this.vesselDefualt();
    this.serviceForm.get('object_source')?.setValue('from_screen');
    this.api.get('get-alliance').subscribe({
      next: (response: any) => {
        this.allianceList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-routing').subscribe({
      next: (response: any) => {
        this.routingList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-service-type').subscribe({
      next: (response: any) => {
        this.serviceTypeList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('set-service-status-dropDown').subscribe({
      next: (response: any) => {
        this.serviceStatusList = this.sanitizer.bypassSecurityTrustHtml(
          "<option value=''>Select</option>" +
            response.data.service_status_drop_down
        );
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-port').subscribe({
      next: (response: any) => {
        this.port = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.operator = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });


    this.regionToTagsSettings = {
      idField: 'port_id',
      textField: 'port_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
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
    this.initializeData();
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
    if (event && event.length > 0) {
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

  initializeData() {
    const ID = this.route.snapshot.paramMap.get('id');
    const callAPI = this.year ? 'edit-get-archive-service' : 'edit-get-service';
    this.api.get(callAPI + '/' + ID).subscribe({
      next: (response: any) => {
        (this.serviceForm.get('servicePort') as FormArray).clear();
        (this.serviceForm.get('serviceAlias') as FormArray).clear();
        (this.serviceForm.get('serviceVessel') as FormArray).clear();
        this.serviceData = response.data;
        this.serviceDataLog = response.servicelog;
        if(this.serviceData.canal_id == null){
          this.serviceData.canal_id = 0;
        }
        this.portArray = response.data.servicePorts.ServicePortArray;
        this.tradeRouteList =
          response.data.serviceTradeRoutes.ServiceTradeRouteArray;
        this.aliasList = response.data.serviceAliases.ServiceAliasArray;
        this.vesselsList = response.data.serviceVessels.ServiceVesselArray;
        this.newDataArray = [];
        this.tradeRouteList.forEach((item: any) => {
          this.newDataArray.push(item.trade_route_id);
        });
        this.tradeRouteArrayCheck(this.newDataArray, false);
        this.populatePortServiceFormArray();
        this.populateTradeServiceFormArray();
        this.populateOperatorServiceFormArray();
        this.populateVesselServiceFormArray();
        this.vesselsInitNumber(response.data.serviceVessels.ServiceVesselArray);
        setTimeout(() => {
          this.hideLoader();
          this.onFormCheckValid();
          this.servicePostValid(false);
          this.serviceVesselValid();
          this.checkCheckbox();
        }, 2000);
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.onFormCheckValid();
          this.servicePostValid(false);
          this.serviceVesselValid();
          this.dateValueChanged();
          this.hideLoader();
        }, 2000);
      },
    });

    this.api.get('get-current-service-move-to?id=' + ID).subscribe({
      next: (response: any) => {
        this.movetoList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  handleAllianceChange(event: any) {
    const total_vessel_id = ','+this.serviceForm.get('serviceVessel')?.value.map((item: { vessel: any; }) => item.vessel).join(',');
    // var total_vessel_id = ',';
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
              service_name: response.data,
            });
            // this.serviceCodeChange();
          }
          this.onFormCheckValid(false);
        },
        error: (error: any) => {},
        complete: () => {},
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
              service_name: response.data,
            });
            // this.serviceCodeChange();
          }
          this.onFormCheckValid(false);
        },
        error: (error: any) => { },
        complete: () => { },
      });
    }
  },0);
  }

  populateOperatorServiceFormArray() {
    this.aliasList.forEach((alias: any, index: number) => {
      const serviceAliasFormArray = this.serviceForm.get(
        'serviceAlias'
      ) as FormArray;
      const matchedOperator = this.operator.find(
        (operator: { operator_id: any }) =>
          operator.operator_id === alias.operator_id
      );
      serviceAliasFormArray.push(
        this.createOperatorServiceFormGroup(alias, matchedOperator)
      );
    });
  }

  createOperatorServiceFormGroup(alias: any, matchedOperator: any) {
    const formGroup = this.fb.group({
      operator: new FormControl(matchedOperator.operator_name),
      alias_name: new FormControl(alias.alias_name),
      schedule_hyperlink: new FormControl(alias.schedule_hyperlink),
    });

    formGroup?.get('operator')?.setValue([
      {
        operator_id: matchedOperator.operator_id,
        operator_name: matchedOperator.operator_name,
      },
    ]);
    return formGroup;
  }

  populatePortServiceFormArray() {
    this.portArray.forEach((port: any) => {
      const ServicePortFormArray = this.serviceForm.get(
        'servicePort'
      ) as FormArray;
      ServicePortFormArray.push(this.createPortServiceFormGroup(port));
    });
  }

  createPortServiceFormGroup(port: any) {
    const formGroup = this.fb.group({
      port_up: new FormControl(
        port.port_id + '-' + port.archived_service_port_id
      ),
      port: new FormControl(port.port_name),
      arrival_days: new FormControl(port.arrival_days),
      departure_days: new FormControl(port.departure_days),
      arrival_day: new FormControl(port.arrival_day),
      departure_day: new FormControl(port.departure_day),
    });
    formGroup
      ?.get('port')
      ?.setValue([{ port_id: port.port_id, port_name: port.port_name }]);
    return formGroup;
  }

  populateVesselServiceFormArray() {
    this.vesselsList.forEach((vessel: any) => {
      const ServiceVesselFormArray = this.serviceForm.get(
        'serviceVessel'
      ) as FormArray;
      ServiceVesselFormArray.push(this.createVesselServiceFormGroup(vessel));
    });
  }

  createVesselServiceFormGroup(vessel: any) {
    const formGroup = this.fb.group({
      vessel: new FormControl(
        vessel.vessel_id + '-' + vessel?.archived_service_vessel_id
      ),
      vessel_name: new FormControl(vessel.vessel_name),
      teu_capacity: new FormControl(vessel.teu_capacity),
      vessel_operator: new FormControl(vessel.operator_name),
      ownership_status: new FormControl(vessel.ownership_status),
      move_to_service: new FormControl(
        vessel.move_to_service !== null ? vessel.move_to_service : ''
      ),
    });
    formGroup
      ?.get('vessel_name')
      ?.setValue([
        { vessel_id: vessel.vessel_id, vessel_name: vessel.vessel_name },
      ]);
    return formGroup;
  }

  serviceCodeChange() {
    var service = this.serviceForm?.get('service_name')?.value;
    if (service != '') {
      var servicename = service.split('-');
      this.serviceForm
        .get('service_name')
        ?.setValue(
          servicename[0] + '-' + this.serviceForm?.get('service_code')?.value
        );
    } else {
      this.serviceForm
        .get('service_name')
        ?.setValue(
          service + '-' + this.serviceForm?.get('service_code')?.value
        );
    }
    // this.serviceNameChange();
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
        const getAlince = service.split('/');
        if (alliance == '') {
          this.serviceForm
            .get('service_name')
            ?.setValue(
              operators + ' -' + this.serviceForm?.get('service_code')?.value
            );
        } else {
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

  onSubmit() {
    if (this.serviceForm.valid) {
      this.showLoader();
      this.formValues = this.serviceForm.getRawValue();
      let action = '';
      if (this.servicePortModified){
        action = 'Archive Service Ports are Updated';
      } else if (this.serviceAliasModified) {
        action = 'Archive Service Operators are Updated';
      } else if (this.serviceVesselModified) {
        action = 'Archive Service Vessels are Updated';
      }else{
        action = 'Archive Service updated successfully';
      }
      this.formValues.action = action;
      const callAPI = this.year ? 'archive-service' : 'service';
      this.api.post(callAPI, this.formValues).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.serviceViewObject = [response.data];
            var mergedArray = response.data.newOperators.concat(response.data.serviceAlliance.ServiceAllianceArray.service_operator_array).concat(response.data.serviceAliases.ServiceAliasArray.map((obj: { operator_name: any; }) => obj.operator_name));
            this.serviceViewObject[0].serviceOperators.serviceOperatorsArray = Array.from(new Set(mergedArray));
            this.newVessels = response.data.newVessel;
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

  dateValueChanged() {
    this.valueChanged();
    setTimeout(() => {
      const startDate = this.serviceForm.get('round_voyage_start_date')?.value;
      const endDate = this.serviceForm.get('round_voyage_end_date')?.value;
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const timeDiff = endDateObj.getTime() - startDateObj.getTime();
      const numberOfDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      // if(numberOfDays){
      //   this.totalNumberOfDays = numberOfDays;
      // }
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
      if (days > 0) {
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

  resetAllForm() {
    this.showLoader();
    this.initializeData();
  }

  resetForm() {
    this.showLoader();
    this.initializeResetData();
  }

  initializeResetData() {
    const ID = this.route.snapshot.paramMap.get('id');
    const callAPI = this.year ? 'edit-get-archive-service' : 'edit-get-service';
    this.api.get(callAPI + '/' + ID).subscribe({
      next: (response: any) => {
        this.serviceData = response.data;
        this.onFormCheckValid();
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        this.dateValueChanged();
        setTimeout(() => {
          this.onFormCheckValid();
          this.hideLoader();
        }, 1000);
      },
    });
  }

  resetPortForm() {
    this.showLoader();
    this.initializePortResetData();
  }

  initializePortResetData() {
    const ID = this.route.snapshot.paramMap.get('id');
    const callAPI = this.year ? 'edit-get-archive-service' : 'edit-get-service';
    this.api.get(callAPI + '/' + ID).subscribe({
      next: (response: any) => {
        (this.serviceForm.get('servicePort') as FormArray).clear();
        this.portArray = response.data.servicePorts.ServicePortArray;
        this.tradeRouteList =
          response.data.serviceTradeRoutes.ServiceTradeRouteArray;
        this.newDataArray = [];
        this.tradeRouteList.forEach((item: any) => {
          this.newDataArray.push(item.trade_route_id);
        });
        this.tradeRouteArrayCheck(this.newDataArray, false);
        this.populatePortServiceFormArray();
        this.populateTradeServiceFormArray();
        this.servicePostValid(false);
        this.checkCheckbox();
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
      
        setTimeout(() => {
          this.servicePostValid(false);
          this.hideLoader();
        }, 1000);
      },
    });
  }

  resetVesselForm() {
    this.showLoader();
    this.initializeVesselResetData();
  }

  initializeVesselResetData() {
    const ID = this.route.snapshot.paramMap.get('id');
    const callAPI = this.year ? 'edit-get-archive-service' : 'edit-get-service';
    this.api.get(callAPI + '/' + ID).subscribe({
      next: (response: any) => {
        (this.serviceForm.get('serviceAlias') as FormArray).clear();
        (this.serviceForm.get('serviceVessel') as FormArray).clear();
        this.aliasList = response.data.serviceAliases.ServiceAliasArray;
        this.vesselsList = response.data.serviceVessels.ServiceVesselArray;
        this.vesselsInitNumber(response.data.serviceVessels.ServiceVesselArray);
        this.populateOperatorServiceFormArray();
        this.populateVesselServiceFormArray();
        this.serviceVesselValid();
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.serviceVesselValid();
          this.hideLoader();
        }, 1000);
      },
    });

    this.api.get('get-current-service-move-to?id=' + ID).subscribe({
      next: (response: any) => {
        this.movetoList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });
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
        }
      },
      error: (error: any) => {},
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: "Service Port",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.servicePort().removeAt(i);
        this.servicePostValid(false);
        this.portServiceform = 'invalid';
        setTimeout(() => {
          this.onItemSelect(i, false);
        }, 100);
      } else {
        console.log('Data deletion canceled.');
      }
    });
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
      move_to_service: '',
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
      move_to_service: '',
    });
  }
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
      move_to_service: '',
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
      move_to_service: '',
    });
  }

  // VesselTBN(): FormGroup {
  //   const tbnValue = `TBN${this.currentTBN}`;
  //   this.currentTBN++;
  //   return this.fb.group({
  //     vessel: tbnValue,
  //     teu_capacity: '',
  //     vessel_operator: '',
  //     ownership_status: 'Owned',
  //     addedInput: 'select',
  //   });
  // }

  // PhasedOut(): FormGroup {
  //   const PhasedOutValue = `Phased Out Vessel${this.currentPhasedOut}`;
  //   this.currentPhasedOut++;
  //   return this.fb.group({
  //     vessel: PhasedOutValue,
  //     teu_capacity: '',
  //     vessel_operator: '',
  //     ownership_status: 'Owned',
  //     addedInput: 'select',
  //   });
  // }

  addVessel() {
    this.serviceVessel().push(this.newserviceVessel());
    this.serviceVesselValid(false);
  }

  missedVoyage() {
    this.serviceVessel().push(this.MissedVoyage());
    this.vesselOperator();
  }

  phasedOut() {
    this.serviceVessel().push(this.PhasedOut());
    this.vesselOperator();
  }

  addVesselTBN() {
    this.serviceVessel().push(this.VesselTBN());
    this.vesselOperator();
  }

  removeVessel(i: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: "Service Vessel ",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        var vessel_value = this.serviceForm.get('serviceVessel')?.get(i.toString());
        var vessel_value_name = this.serviceForm.get('serviceVessel')?.get(i.toString())?.get('vessel')?.value;
        console.log(vessel_value);
        this.serviceVessel().removeAt(i);
        this.valueChanged();
        if(vessel_value?.value?.vessel_name){
          var vessel_name = vessel_value.value.vessel_name[0].vessel_name;
          if(vessel_name.substring(0, 17) != "Phased out vessel" && vessel_name.substring(0, 3) != "TBN" && vessel_name.substring(0, 13) !="Missed voyage"){
          this.handleAllianceChange_Vessel();
          }
        }else{
        if(vessel_value_name.substring(0, 17) != "Phased out vessel" && vessel_value_name.substring(0, 3) != "TBN" && vessel_value_name.substring(0, 13) !="Missed voyage"){
          this.handleAllianceChange_Vessel();
        }
        }
        // this.serviceNameChange();
        // if(vessel_value.substring(0, 17) != "Phased out vessel" && vessel_value.substring(0, 3) != "TBN" && vessel_value.substring(0, 13) !="Missed voyage"){
        //   this.handleAllianceChange_Vessel();
        // }
        // this.handleAllianceChange_Vessel();
        this.serviceVesselValid(false);
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

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
      var wayport_percentage: any[] =[];
      var trade_id: any[] =[];
      var out_of_scope:any = [];
      var dwt_adjustment:any = [];
      var high_cube_adjustment:any = [];
      var valid:any=[];
      var vessel_deployment_flag:any=[];
      var tradeService = this.serviceForm.get('tradeService') as FormArray;
      tradeService.value.forEach((data:any) =>{
        // console.log(data);
        wayport_percentage.push(data.way_port);
        trade_id.push(data.trade_route_id);
        out_of_scope.push(data.out_of_scope);
        dwt_adjustment.push(data.dwt_adjustment);
        high_cube_adjustment.push(data.high_cube_adjustment);
        valid.push(data.valid);
        vessel_deployment_flag.push(data.vessel_deployment_flag);
      });
      const portIdsString = portIds.join(',');
      this.api
        .post('get-trade-route-service', {
          port_up_array: ',' + portIdsString,
          serviceId: '',
          trade_id: trade_id,
          wayport_percentage: wayport_percentage,
          wayport_comments: '',
          out_of_scope: out_of_scope,
          dwt_adjustment: dwt_adjustment,
          high_cube_adjustment: high_cube_adjustment,
          classvalid_status: valid,
          vessel_deployment_flag: vessel_deployment_flag,
          type:"edit"
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
              this.checkCheckbox();
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

  tradeRouteArrayCheck(newDataArray: any[], showMessage = true) {
    const sortedNewDataArray = newDataArray.slice().sort();
    const sortedOldArray = this.oldArray.slice().sort();
    var j = 0;
    for (let i = 0; i < sortedNewDataArray.length; i++) {
      if (sortedNewDataArray[i] !== sortedOldArray[i]) {
        j++;
      }
    }
    if (j > 0 && showMessage) {
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
  }

  createTradeServiceFormGroup(tradeRoute: any) {
    this.tradeRoutePrimary =
      tradeRoute.service_primary_trade_route === 'Yes' ? true : false;
    this.vesselDeploymentFlag =
      tradeRoute.vessel_deployment_flag === 'Yes' ? true : false;
    return this.fb.group({
      service_primary_trade_route: new FormControl(this.tradeRoutePrimary),
      service_trade_route_name: new FormControl(tradeRoute.trade_route_name),
      service_trade_route: new FormControl(tradeRoute.trade_route_id),
      trade_route_id: new FormControl(tradeRoute.trade_route_id),
      valid: new FormControl(tradeRoute.valid_status),
      way_port: new FormControl(tradeRoute.wayport_percentage),
      out_of_scope: new FormControl(tradeRoute.out_of_scope),
      dwt_adjustment: new FormControl(tradeRoute.dwt_adjustment),
      high_cube_adjustment: new FormControl(tradeRoute.high_cube_adjustment),
      vessel_deployment_flag: new FormControl(this.vesselDeploymentFlag),
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
      this.vesselList = this.vessel.filter(vessel => {
          // Check if vessel_id is in the vesselIds array
          return vesselIds.includes(vessel.vessel_id);
      });
      if(this.vesselList.length > 0){
        this.vesselList = this.vesselList[0];
        // this.serviceNameChange();
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
          ?.setValue(this.vesselList?.vessel_operator.operator_name);
        this.serviceForm
          .get('serviceVessel')
          ?.get(indexs.toString())
          ?.get('ownership_status')
          ?.setValue(this.vesselList?.ownership_status);
      }else{
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
      this.checkDuplicateVessel();
      this.vesselOperator();
      // this.api
      //   .post('get-vessel-details', { total_vessel_id: vesselIds })
      //   .subscribe({
      //     next: (response: any) => {
      //       if (response.status === true) {
      //         this.vesselList = response.data;
      //         this.serviceNameChange();
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('vessel')
      //           ?.setValue(this.vesselList?.vessel_id + '-0');
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('teu_capacity')
      //           ?.setValue(this.vesselList?.teu_capacity);
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('vessel_operator')
      //           ?.setValue(this.vesselList?.operator.operator_name);
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('ownership_status')
      //           ?.setValue(this.vesselList?.ownership_status);
      //       } else {
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('vessel')
      //           ?.setValue('');
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('teu_capacity')
      //           ?.setValue('');
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('vessel_operator')
      //           ?.setValue('');
      //         this.serviceForm
      //           .get('serviceVessel')
      //           ?.get(indexs.toString())
      //           ?.get('ownership_status')
      //           ?.setValue('');
      //       }
      //       this.valueChanged();
      //       this.serviceVesselValid(false);
      //     },
      //     error: (error: any) => {},
      //     complete: () => {
      //       this.checkDuplicateVessel();
      //       this.vesselOperator();
      //     },
      //   });
    }
  }

  // onItemVessel(index: number) {
  //   const serviceVesselArray: FormArray = this.serviceForm.get(
  //     'serviceVessel'
  //   ) as FormArray;
  //   const serviceVesselValues = serviceVesselArray.value;
  //   const vesselIds: any[] = [];
  //   serviceVesselValues.forEach((item: { vessel_name: any[] }) => {
  //     if (Array.isArray(item.vessel_name)) {
  //       item.vessel_name.forEach((vesselItem) => {
  //         if (vesselItem.vessel_id) {
  //           vesselIds.push(vesselItem.vessel_id + '-0');
  //         }
  //       });
  //     }
  //   });
  //   const vesselIdsString = vesselIds.join(',');
  //   this.api
  //     .post('get-vessel-details', { total_vessel_id: vesselIdsString })
  //     .subscribe({
  //       next: (response: any) => {
  //         if (response.status === true) {
  //           this.vesselList = response.data;
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('vessel')
  //             ?.setValue(this.vesselList?.vessel_id + '-0');
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('teu_capacity')
  //             ?.setValue(this.vesselList?.teu_capacity);
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('vessel_operator')
  //             ?.setValue(this.vesselList?.operator.operator_name);
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('ownership_status')
  //             ?.setValue(this.vesselList?.ownership_status);
  //         } else {
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('vessel')
  //             ?.setValue('');
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('teu_capacity')
  //             ?.setValue('');
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('vessel_operator')
  //             ?.setValue('');
  //           this.serviceForm
  //             .get('serviceVessel')
  //             ?.get(index.toString())
  //             ?.get('ownership_status')
  //             ?.setValue('');
  //         }
  //       },
  //       error: (error: any) => {},
  //       complete: () => {
  //         this.checkDuplicateVessel();
  //       },
  //     });
  // }

  // servicePostValid(showToster: boolean = true) {
  //   const startDate = this.serviceForm.get('round_voyage_start_date')?.value;
  //   const endDate = this.serviceForm.get('round_voyage_end_date')?.value;
  //   const startDateObj = new Date(startDate);
  //   const endDateObj = new Date(endDate);
  //   const timeDiff = endDateObj.getTime() - startDateObj.getTime();
  //   const numberOfDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  //   const servicePortArray: FormArray = this.serviceForm.get(
  //     'servicePort'
  //   ) as FormArray;
  //   const servicePortValues = servicePortArray.value;
  //   if (servicePortValues.length < 2) {
  //     this.portServiceform = 'invalid';
  //     if (showToster) {
  //       this.toasterService.error(environment.portLessThenTwo);
  //     }
  //   }

  //   let portValid = true;
  //   if (servicePortValues.length >= 2) {
  //     // const i = servicePortArray.length - 1;
  //     for (let i = 0; i < servicePortArray.length; i++) {
  //       const portFormGroup = servicePortArray.at(i) as FormGroup;
  //       Object.keys(portFormGroup.controls).forEach((controlName) => {
  //         const arrivalDaysControl = portFormGroup.get('arrival_days');
  //         const departureDaysControl = portFormGroup.get('departure_days');

  //         if (arrivalDaysControl && arrivalDaysControl.valid) {
  //           this.errorDetails[i] = false;

  //           const arrivalDaysValue = Number(arrivalDaysControl.value);
  //           if (arrivalDaysValue !== numberOfDays) {
  //             portValid = false;
  //             arrivalDaysControl.setErrors({ invalidArrivalDays: true });
  //             this.errorDetails[i] = {
  //               totalNumberOfDays: Number(numberOfDays),
  //               days: arrivalDaysValue,
  //             };
  //           }
  //         }

  //         if (departureDaysControl && departureDaysControl.valid) {
  //           const departureDaysValue = Number(departureDaysControl.value);
  //           const arrivalDaysValue = Number(arrivalDaysControl?.value);
  //           if (departureDaysValue < arrivalDaysValue) {
  //             portValid = false;
  //             departureDaysControl.setErrors({ invalidDepartureDays: true });
  //             this.errorDetails[i] = {
  //               totalNumberOfDays: Number(numberOfDays),
  //               days: departureDaysValue,
  //             };
  //           }
  //         }

  //         const control = portFormGroup.get(controlName);
  //         if (control && control.invalid) {
  //           portValid = false;
  //           control.markAsTouched();
  //         }
  //       });
  //     }
  //   }

  //   const tradeServiceFormArray = this.serviceForm.get(
  //     'tradeService'
  //   ) as FormArray;
  //   const tradeServiceValues = tradeServiceFormArray.value;
  //   const checkedCount = tradeServiceValues.filter(
  //     (item: { service_primary_trade_route: any }) =>
  //       item.service_primary_trade_route
  //   ).length;
  //   if (portValid && servicePortValues.length >= 2) {
  //     if (checkedCount < 1) {
  //       if (showToster) {
  //         this.toasterService.error(
  //           'You have to select at least one primary trade route!'
  //         );
  //       }
  //       this.portServiceform = 'invalid';
  //     } else {
  //       this.portServiceform = 'valid';
  //     }
  //   } else {
  //     this.portServiceform = 'invalid';
  //   }
  // }
  servicePostValid(showToster: boolean = true) {
    const startDate = this.serviceForm.get('round_voyage_start_date')?.value;
    const endDate = this.serviceForm.get('round_voyage_end_date')?.value;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const timeDiff = endDateObj.getTime() - startDateObj.getTime();
    const numberOfDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
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
                this.totalNumberOfDays =   Number(numberOfDays);
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

  checkCheckbox() {
    this.checkedCheckboxCount = 0;
    const tradeServiceFormArray = this.serviceForm.get(
      'tradeService'
    ) as FormArray;
    tradeServiceFormArray.controls.forEach((control, index) => {
      const isChecked = control.get('service_primary_trade_route')?.value;
      if (isChecked) {
        this.checkedCheckboxCount++;
      }
    });
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

  onSaveData() {
    if (this.serviceDataForm.valid) {
      this.showLoader();
      const callAPI = this.year ? 'archive-service' : 'service';
      this.serviceDataForm.value.serviceDataLog = this.serviceDataLog;
      this.api.update(callAPI, this.serviceDataForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.hideLoader();
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            $('#myModal').modal('hide');
            this.hideLoader();
            if(this.year){
              this.router.navigate(['/archive/view-archived-services']);
            }else{
              this.router.navigate(['/administrator/service'], { fragment: 'search' });
            }   
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
  vesselsInitNumber(ServiceVesselArray:any){
    let maxMissedVoyageNumber= 0, maxTBNNumber= 0, maxPhasedOutNumber= 0;
    ServiceVesselArray.forEach((vessel_missedvoyage: { vessel_name: string | string[]; }) => {
      ["Missed voyage", "TBN", "Phased out vessel"].forEach((type) => {
        if (Array.isArray(vessel_missedvoyage.vessel_name)) {
          vessel_missedvoyage.vessel_name.forEach(name => {
            if (name.includes(type)) {
              const number = parseInt(name.replace(type, "").trim());
              if (!isNaN(number) && number > (type === "Missed voyage" ? maxMissedVoyageNumber : (type === "TBN" ? maxTBNNumber : maxPhasedOutNumber))) {
                type === "Missed voyage" ? maxMissedVoyageNumber = number : (type === "TBN" ? maxTBNNumber = number : maxPhasedOutNumber = number);
              }
            }
          });
        } else {
          if (vessel_missedvoyage.vessel_name.includes(type)) {
            const number = parseInt(vessel_missedvoyage.vessel_name.replace(type, "").trim());
            if (!isNaN(number) && number > (type === "Missed voyage" ? maxMissedVoyageNumber : (type === "TBN" ? maxTBNNumber : maxPhasedOutNumber))) {
              type === "Missed voyage" ? maxMissedVoyageNumber = number : (type === "TBN" ? maxTBNNumber = number : maxPhasedOutNumber = number);
            }
          }
        }
      });
    });
    this.currentMissedVoyage = maxMissedVoyageNumber + 1;
    this.currentTBN = maxTBNNumber + 1;
    this.currentPhasedOut = maxPhasedOutNumber + 1;
  }
  onServicePortChange() {
    this.servicePortModified = true;
  }
  onServiceAliasChange() {
    this.serviceAliasModified = true;
  }
  onServiceVesselChange() {
    this.serviceVesselModified = true;
  }
}
