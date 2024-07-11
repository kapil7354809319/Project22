import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-captab-report',
  templateUrl: './captab-report.component.html',
  styleUrls: ['./captab-report.component.scss']
})

export class CaptabReportComponent {
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  getPerPageCount: number[];
  years: any;
  searchForm!: FormGroup;
  months: any;
  reports: any;
  yearUrl: string  = '';
  monthsUrl: string = '';
  tradeRouteUrl: string = '';
  type: string = '';
  viewReport: boolean = false;
  report: any;
  routeDetails: any;
  tradeReports: any;
  genDate: any;
  tradeRouteNameDir: any;
  captab: any;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public toasterService: ToasterService,
    public router: Router
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
  }

  get loading() {
    return this.loadingSubject.asObservable();
  }
  ngOnInit() {
    this.showLoader();
    this.loadYears();
    this.searchForm = this.fb.group({
      year: ['', [Validators.required]],
      month: [''],
      route: [''],
    });
    
  }
  getYears(){
    this.api.get(this.yearUrl).subscribe({
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
  showLoader() {
    this.loadingSubject.next(true);
  }
  loadYears(type: string = 'after17'){
    this.months = [];
    this.type = type;
    if(type === 'after17'){
      this.yearUrl = 'get-archive-years';
      this.monthsUrl = 'get-archive-months';
      this.tradeRouteUrl =  'cap-tab-report/get-trade-route-list';
    } else{
      this.yearUrl = 'cap-tab-report/get-archived-years';
      this.monthsUrl = 'cap-tab-report/get-archived-months';
      this.tradeRouteUrl = 'cap-tab-report/get-archived-old-report';
    }
    this.getYears();
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
  onChangeYear() {
    if (this.searchForm.valid) {
      const year = this.searchForm?.get('year')?.value;
      this.api.getSearch(this.monthsUrl, { Year: year }).subscribe({
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
  }
  onChangeMonth() {
    if (this.searchForm.valid) {
      const year = this.searchForm?.get('year')?.value;
      const Month = this.searchForm?.get('month')?.value;
      this.api.getSearch(this.tradeRouteUrl, { Year: year , Month}).subscribe({
        next: (response: any) => {
          this.reports = response.data;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
    }
  }
  
  onChangeRoute(){
    if(this.type === 'before17') {
      const route = this.searchForm?.get('route')?.value;
      const path = environment.ReportPath + route;
      window.open(path, "_blank");
    } else {
      const year = this.searchForm?.get('year')?.value;
      const Month = this.searchForm?.get('month')?.value;
      const routes = this.searchForm?.get('route')?.value;
      this.showLoader();
      this.api.getSearch('cap-tab-report', { Year: year , Month, routes}).subscribe({
        next: (response: any) => {
          const others = response.data['Others']
          delete response.data['Others'];
          this.tradeReports = Object.values(response.data);

          this.tradeReports  = this.tradeReports.sort((a:any, b: any) => a.group_name > b.group_name ? 1 : -1);
          if(others){
            this.tradeReports.push(others);
          }
          this.tradeReports.forEach((element :any) => {
             element.services_compact_array = Object.values(element.services_compact_array);
          });
          this.captab = response.captab;
          this.hideLoader();

          this.routeDetails = response.trade_route_name;
          this.genDate = response.gen_date;
          this.tradeRouteNameDir = response.trade_route_name_dir;
          // console.log(Object.values(this.tradeReports));
          this.viewReport = true;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
    }

  }
  getMonth(monthStr: any){
    return new Date(monthStr+'-1-01').toLocaleDateString(`en`, {month:`2-digit`});
  }
  export(reportType: string){
    
    const year = this.searchForm?.get('year')?.value;
    const Month = this.searchForm?.get('month')?.value;
    const routes = this.searchForm?.get('route')?.value;
    this.showLoader();
    this.api.getSearchExport('cap-tab-report', { Year: year , Month, routes, reportType}).subscribe({
      next: (response: any) => {
        this.hideLoader();
        const monthN =  this.getMonth(Month);
        const fileName = this.routeDetails+ year + '-' + monthN +'-'+ '01' + '.xlsx';
        this.downloadExcel(response, fileName);
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
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

  clear(){
    this.searchForm.reset();
    this.searchForm.controls['year'].setValue('');
    this.searchForm.controls['month'].setValue('');
    this.searchForm.controls['route'].setValue('');
    this.months = [];
    this.reports = [];
  }

}
