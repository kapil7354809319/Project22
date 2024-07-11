import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-by-service',
  templateUrl: './search-by-service.component.html',
  styleUrls: ['./search-by-service.component.scss'],
})
export class SearchByServiceComponent {
  years: any;
  months: any;
  searchByService!: FormGroup;
  serviceList: any;
  serviceDetail: any;
  archieveServices: any;
  code: any;
  selectedService_code:any;
  constructor(private fb: FormBuilder, public api: ApiService,  private route: ActivatedRoute) {}

  private loadingSubject = new BehaviorSubject<boolean>(false);

  get loading() {
    return this.loadingSubject.asObservable();
  }

  showContent: boolean = false;

  toggleContent() {
    this.showContent = !this.showContent;
  }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  onChangeYear() {
      const year = this.searchByService?.get('year')?.value;
      this.api.getSearch('get-archive-months', { Year: year }).subscribe({
        next: (response: any) => {
          this.months = response.data;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
  }

  ngOnInit() {
    this.showLoader();
    this.searchByService = this.fb.group({
      year: ['', [Validators.required]],
      month: ['',[Validators.required]],
      service: [''],
      code:['']
    }, { validators: this.serviceOrCodeValidator() });
    this.api.get('get-archive-years').subscribe({
      next: (response: any) => {
        this.years = response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
    const serviceId: string | null = this.route.snapshot.queryParamMap.get('serviceId');
    if(serviceId){
      this.loadServiceDetails(Number(serviceId));
    }
  }
  serviceOrCodeValidator(): ValidatorFn {
    return (form: AbstractControl): { [key: string]: any } | null => {
      const service = form.get('service')?.value;
      const code = form.get('code')?.value;

      return service || code ? null : { 'serviceOrCodeRequired': true };
    };
  }
  onSubmit() {
    if (this.searchByService.valid) {
      this.showLoader();
      const serviceId = this.searchByService?.get('service')?.value;
      this.code = this.searchByService?.get('code')?.value;
      this.loadServiceDetails(serviceId);
      console.log(serviceId);
      console.log(this.code);
    }else{
      this.searchByService.markAllAsTouched();
    }
  }
  loadServiceDetails(service_id: number){
    if(this.code != ''){
      const service_code= this.code;
      this.api
      .getSearch('get-service-details', { service_id, service_code})
      .subscribe({
        next: (response: any) => {
          if(response.status === true){
          this.serviceDetail = response.data;
          this.archieveServices =  response.archieveServices;
          this.showContent =true;
          }else{
          this.showContent =false;
          }
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
      });
    }else{
    this.api
        .getSearch('get-service-details', { service_id })
        .subscribe({
          next: (response: any) => {
            this.serviceDetail = response.data;
            this.archieveServices =  response.archieveServices;
            this.showContent =true;
            this.hideLoader();
          },
          error: (error: any) => {
            this.hideLoader();
          },
        });
      }
  }
  getservice_code() {

    const selectedOption = document.getElementById("serviceSelect") as HTMLSelectElement;
    const selectedServiceId = selectedOption.value;
    this.selectedService_code = this.serviceList.find((service: { archived_service_id: string; }) => service.archived_service_id == selectedServiceId);
    this.selectedService_code = this.selectedService_code?.drewry_service_name;
  }
  removeslected_service(){
    this.searchByService?.get('service')?.setValue('');
  }
  onChangeMonth() {
      this.showLoader();
      const year = this.searchByService?.get('year')?.value;
      const month = this.searchByService?.get('month')?.value;
      this.api
        .getSearch('get-date-service', { Year: year, Month: month })
        .subscribe({
          next: (response: any) => {
            this.serviceList = response.data;
            this.hideLoader();
          },
          error: (error: any) => {
            this.hideLoader();
          },
        });
  }
  viewDetail(id:number){
    this.showLoader();

      const serviceId = id;
      this.loadServiceDetails(serviceId);
  }
  clear() {
    this.searchByService.reset();
    this.serviceList = [];
    this.months = [];
    this.searchByService.controls['year'].setValue('');
    this.searchByService.controls['month'].setValue('');
    this.searchByService.controls['service'].setValue('');
  }
  roundOff(value: number){
    return Math.round(value);
  }
}

