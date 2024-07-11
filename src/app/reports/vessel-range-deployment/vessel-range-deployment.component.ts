import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vessel-range-deployment',
  templateUrl: './vessel-range-deployment.component.html',
  styleUrls: ['./vessel-range-deployment.component.scss']
})
export class VesselRangeDeploymentComponent {

  showContent: boolean = false;
  showFormControls: boolean = true; // Initial value
  searchForm!: FormGroup;
  months: any = ['January','February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  fromMonths: any =[];
  toMonths: any = [];
  years: any = [];
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  selectedOption!: string;
  quaters: any;
  
  constructor(
    private fb: FormBuilder,    
    public api: ApiService,

    private toasterService: ToasterService
  ) {
  }
  ngOnInit() {
    this.searchForm = this.fb.group({
      to_year: ['', [Validators.required]],
      to_month: ['', [Validators.required]],
      from_year: ['', [Validators.required]],
      from_month: ['', [Validators.required]],
      min_teu: [''],
      max_teu: [''],
      time_range: ['time_series'],
      period_format: ['monthly'],
      report_req: ['trade_routes'],
      select_quater: ['']
    });
    this.loadQuaters();
    // this.getMonths();
    this.getYears();
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  toggleFormControls(option: string) {
    this.showFormControls = true;
    this.selectedOption = option;
    
  }
  getLastYear() {
    const startYear = 2016
    const now = new Date();
    const currentYear = now.getFullYear();
    const years = [...Array(currentYear+1 - startYear).keys()].map(
      (e) => e + startYear
    );

    return years;
  }
  loadQuaters() {
    this.api.getSearch('vessel-range-deployment-report/get-quaters', {}).subscribe({
      next: (response: any) => {
        this.quaters = response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });

  }
  getYears() {
    this.api.getSearch('vessel-range-deployment-report/get-years', {}).subscribe({
      next: (response: any) => {
        this.years = response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });

  }

  getMonths() {
    this.api.getSearch('vessel-range-deployment-report/get-months', {}).subscribe({
      next: (response: any) => {
        this.months= response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });

  }
  showLoader() {
    this.loadingSubject.next(true);
  }


  hideLoader() {
    this.loadingSubject.next(false);
  }
  get loading() {
    return this.loadingSubject.asObservable();
  }

  export(){

    if(this.searchForm.invalid){
      this.toasterService.error("Please select all fields.", '');
      return;
    }
    if(this.searchForm.value.time_range === 'time_series' && this.searchForm.value.period_format === 'monthly'){
      var dFrom = new Date(this.searchForm.value.from_year, this.searchForm.value.from_month, 1);
      var dTo = new Date(this.searchForm.value.to_year, this.searchForm.value.to_month, 1);
      if(dFrom > dTo){
        this.toasterService.error("To Date must be after From Date.", '');
        return;
      }
    }

    this.showLoader();
    const body = this.searchForm.value;
    let url = ''
    if(this.searchForm.value.report_req ==='trade_routes') {
      url = 'vessel-range-deployment-report/get-report';
    } else {
      url = 'vessel-range-deployment-report/get-report-operator';
    }
    this.api.getSearchExport(url, body).subscribe({
      next: (response: any) => {
        this.hideLoader();
        const fileName ='file.xlsx';
        this.downloadExcel(response, fileName);
        this.hideLoader();
      },
      error: (error: any) => {
        console.log(error);
        this.hideLoader();
        this.toasterService.error(error.statusText, '');
      },
      complete: () => {},
    });
  
  }

  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
  }

  changeValidation(){
    if(this.searchForm.value.time_range === 'time_series' && this.searchForm.value.period_format === 'monthly'){
      this.searchForm.controls['from_year'].setValidators([Validators.required]); 
      this.searchForm.controls['from_month'].setValidators([Validators.required]); 
      this.searchForm.controls['to_year'].setValidators([Validators.required]); 
      this.searchForm.controls['to_month'].setValidators([Validators.required]);  
      this.searchForm.controls['select_quater'].clearValidators();     
    } else if(this.searchForm.value.time_range === 'time_series' && this.searchForm.value.period_format === 'quarterly'){
      this.searchForm.controls['from_year'].clearValidators(); 
      this.searchForm.controls['from_month'].clearValidators(); 
      this.searchForm.controls['to_year'].clearValidators(); 
      this.searchForm.controls['to_month'].clearValidators(); 
      this.searchForm.controls['select_quater'].setValidators([Validators.required]);
    } else{
      this.searchForm.controls['from_year'].clearValidators(); 
      this.searchForm.controls['from_month'].clearValidators(); 
      this.searchForm.controls['to_year'].clearValidators(); 
      this.searchForm.controls['to_month'].clearValidators(); 
      this.searchForm.controls['select_quater'].clearValidators();     
    }
    this.searchForm.controls['from_year'].setValue(''); 
    this.searchForm.controls['from_month'].setValue(''); 
    this.searchForm.controls['to_year'].setValue(''); 
    this.searchForm.controls['to_month'].setValue(''); 
    this.searchForm.controls['select_quater'].setValue('');  
    this.searchForm.controls["from_year"].updateValueAndValidity();
    this.searchForm.controls["from_month"].updateValueAndValidity();
    this.searchForm.controls["to_year"].updateValueAndValidity();
    this.searchForm.controls["to_month"].updateValueAndValidity();
    this.searchForm.controls["select_quater"].updateValueAndValidity();
  }
  changeToDropDownValue(){
    var d = new Date();
    let currentYear = d.getFullYear()
    if(currentYear == this.searchForm.value.to_year) {
      let selected_month = d.getMonth();
      let months = JSON.parse(JSON.stringify(this.months));
      this.toMonths  = months.splice(0, selected_month);
    } else {
      this.toMonths  = this.months;
    }
  }
  changeToDropDownValueForFromMonths(){
    var d = new Date();
    let currentYear = d.getFullYear()
    if(currentYear == this.searchForm.value.from_year) {
      let selected_month = d.getMonth();
      let months = JSON.parse(JSON.stringify(this.months));
      this.fromMonths  = months.splice(0, selected_month);
    } else {
      this.fromMonths  = this.months;
    }
  }

  clear(){
    this.searchForm.reset();
    this.searchForm.controls['to_year'].setValue('');
    this.searchForm.controls['to_month'].setValue('')
    this.searchForm.controls['from_year'].setValue('')
    this.searchForm.controls['from_month'].setValue('')
    this.searchForm.controls['min_teu'].setValue('')
    this.searchForm.controls['max_teu'].setValue('')
    this.searchForm.controls['time_range'].setValue('time_series')
    this.searchForm.controls['period_format'].setValue('monthly')
    this.searchForm.controls['report_req'].setValue('trade_routes')
    this.searchForm.controls['select_quater'].setValue('')
  }

}
