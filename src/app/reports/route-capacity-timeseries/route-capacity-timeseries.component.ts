import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { saveAs } from 'file-saver';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-route-capacity-timeseries',
  templateUrl: './route-capacity-timeseries.component.html',
  styleUrls: ['./route-capacity-timeseries.component.scss']
})
export class RouteCapacityTimeseriesComponent {

  showContent: boolean = false;
  showFormControls: boolean = true; // Initial value
  searchForm!: FormGroup;
  months: any = ['January','February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  fromMonths: any =[];
  toMonths: any = [];
  reports: any;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  dropdownSettings: any;
  selectedRoutes: any = [];
  
  constructor(
    private fb: FormBuilder,    
    public api: ApiService,

    private toasterService: ToasterService
  ) {
  }
  ngOnInit() {
    this.searchForm = this.fb.group({
      toYear: ['', [Validators.required]],
      toMonth: ['', [Validators.required]],
      fromYear: ['', [Validators.required]],
      fromMonth: ['', [Validators.required]],
      route: ['', [Validators.required]],
      routeFront: [''],
    });
    this.loadRoutes();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'trade_route_id',
      textField: 'trade_route_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    
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
  getValue(e: any){
    console.log(e.target.value);

  }
  loadRoutes() {
      this.api.getSearch('route-capacity-report/get-trade-route-list', {}).subscribe({
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
  showLoader() {
    this.loadingSubject.next(true);
  }
  

  hideLoader() {
    this.loadingSubject.next(false);
  }

  onItemSelectRoute(item: any) {
    this.selectedRoutes.push(item);
  }

  onDeselectRoute(item: any) {
    // console.log(item)
    this.selectedRoutes = this.selectedRoutes.filter(
      (it: { trade_route_name: any }) => it.trade_route_name != item.trade_route_name
    );
    // console.log(this.selectedRoutes)
  }
  onSelectAllRoute(items: any) {
    this.selectedRoutes = items;
  }
  export(){

    let routes = this.selectedRoutes.map((item:any) => item.trade_route_id);
    this.searchForm.patchValue({'route': routes});
    if(this.searchForm.invalid){
      this.toasterService.error("Please select all fields.", '');
      return;
    }
    var dFrom = new Date(this.searchForm.value.fromYear, this.searchForm.value.fromMonth, 1);
    var dTo = new Date(this.searchForm.value.toYear, this.searchForm.value.toMonth, 1);
    if(dFrom > dTo){
      this.toasterService.error("To Date must be after From Date.", '');
      return;
    }

    this.showLoader();
    const body = this.searchForm.value;
    routes = routes.toString();
    body.route = routes;
    
    this.api.getSearchExport('route-capacity-report/get-report', body).subscribe({
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
  get loading() {
    return this.loadingSubject.asObservable();
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
    this.searchForm.controls['toYear'].setValue('');
    this.searchForm.controls['toMonth'].setValue('')
    this.searchForm.controls['fromYear'].setValue('')
    this.searchForm.controls['fromMonth'].setValue('')
    this.searchForm.controls['route'].setValue('')
    this.selectedRoutes = [];
  }

}
