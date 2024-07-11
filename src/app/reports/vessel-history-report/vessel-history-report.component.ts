import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vessel-history-report',
  templateUrl: './vessel-history-report.component.html',
  styleUrls: ['./vessel-history-report.component.scss']
})
export class VesselHistoryReportComponent {

  showContent: boolean = false;
  months: any = ['January','February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  fromMonths: any =[];
  toMonths: any = [];
  searchForm!: FormGroup;
  reports: any;
  vesselDetail: any;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  filteredOptions: Observable<any>;
  auto: any;
  myControl = new FormControl<string>('');;
  
  constructor(
    private fb: FormBuilder,    
    public api: ApiService,
    private toasterService: ToasterService
  ) {
    this.searchForm = this.fb.group({
      toYear: ['', [Validators.required]],
      toMonth: ['', [Validators.required]],
      fromYear: ['', [Validators.required]],
      fromMonth: ['', [Validators.required]],
      imo_no: ['', [Validators.required]],
    });
    this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(val => {
            console.log(val);
            return this.filter(val || '')
          })       
        );
  }
  filter(val: any): Observable<any> {
    // call the service which makes the http-request
    return this.api.getSearch('vessel-history-report/get-imo-number', {
      search_text: val,
      table_name: 'vessel_name'
    })
     .pipe(
       map(response => response )
     )
   }  
  ngOnInit() {
    // this.myControl.valueChanges
    // .subscribe((value: any) => {
    //   if(value.length >= 1){
    //     this.api.getSearch('vessel-history-report/get-imo-number', {
    //       search_text: this.searchForm.value.imo_no,
    //       table_name: 'vessel_name'
    //     }).subscribe({
    //       next: (response: any) => {
    //         return this.filteredOptions = response.result;
    //       },
    //       error: (error: any) => {
    //       },
    //     });;
    //   }
      
    //     return null;
      
    // })
    
    
  }
  get loading() {
    return this.loadingSubject.asObservable();
  }
  toggleContent() {
    this.showContent = !this.showContent;
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
  changeToDropDownValue(){
    var d = new Date();
    let currentYear = d.getFullYear()
    if(currentYear == this.searchForm.value.toYear) {
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
    if(currentYear == this.searchForm.value.fromYear) {
      let selected_month = d.getMonth();
      let months = JSON.parse(JSON.stringify(this.months));
      this.fromMonths  = months.splice(0, selected_month);
    } else {
      this.fromMonths  = this.months;
    }
  }

  getReport(){
    let from_year =  this.searchForm.value.fromYear;
    let from_month = this.searchForm.value.fromMonth;
    let to_year = this.searchForm.value.toYear;
    let to_month = this.searchForm.value.toMonth;
    let dFrom = new Date(from_year, from_month, 1);
    let dTo = new Date(to_year, to_month, 1);
    const imo_no = this.myControl.value;
    const from_date = from_year + '-' + from_month + '-' + '01';
    const to_date = to_year + '-' + to_month + '-' + '01';

    
    if (imo_no == '') {
        this.toasterService.error("Imo no is required", '');
        return;
    }
    else if (from_year == '' || from_month == '' || to_year == '' || to_month == '') {
        this.toasterService.error("From and to date is required", '');
        return ;

    }else if (dFrom > dTo) {
        this.toasterService.error("To Date must be after From Date", '');
        return ;

    }
    this.showLoader();
    this.api
    .getSearch('vessel-history-report/get-report', { imo_no, from_date, to_date })
    .subscribe({
      next: (response: any) => {
        this.reports = response.data;
        this.vesselDetail =  response.vesselInfo;
        this.showContent =true;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
    });
    
  }
  export(){

    let from_year =  this.searchForm.value.fromYear;
    let from_month = this.searchForm.value.fromMonth;
    let to_year = this.searchForm.value.toYear;
    let to_month = this.searchForm.value.toMonth;
    let dFrom = new Date(from_year, from_month, 1);
    let dTo = new Date(to_year, to_month, 1);
    const imo_no = this.myControl.value;
    const from_date = from_year + '-' + from_month + '-' + '01';
    const to_date = to_year + '-' + to_month + '-' + '01';

    
    if (imo_no == '') {
        this.toasterService.error("Imo no is required", '');
        return;
    }
    else if (from_year == '' || from_month == '' || to_year == '' || to_month == '') {
        this.toasterService.error("From and to date is required", '');
        return ;

    }else if (dFrom > dTo) {
        this.toasterService.error("To Date must be after From Date", '');
        return ;

    }

    this.showLoader();
    const body = this.searchForm.value;
    let url = ''
    if(this.searchForm.value.report_req ==='trade_routes') {
      url = 'vessel-range-deployment-report/get-report';
    } else {
      url = 'vessel-range-deployment-report/get-report-operator';
    }
    this.api.getSearchExport('vessel-history-report/excel-export', { imo_no, from_date, to_date }).subscribe({
      next: (response: any) => {
        this.hideLoader();
        const fileName ='route_capacity_timeseries.xlsx';
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

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
  clear(){
    this.searchForm.reset();
    this.searchForm.controls['toYear'].setValue('');
    this.searchForm.controls['toMonth'].setValue('')
    this.searchForm.controls['fromYear'].setValue('')
    this.searchForm.controls['fromMonth'].setValue('');
    this.myControl.setValue('');
  }
  


}
