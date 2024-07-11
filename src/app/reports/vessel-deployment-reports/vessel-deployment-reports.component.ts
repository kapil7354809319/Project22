import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vessel-deployment-reports',
  templateUrl: './vessel-deployment-reports.component.html',
  styleUrls: ['./vessel-deployment-reports.component.scss']
})

export class VesselDeploymentReportsComponent {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  vesselDeploymentReportForm!: FormGroup;
  getPerPageCount: number[];
  yearUrl!: string;
  monthsUrl!: string;
  tradeRouteUrl!: string;
  years: any;
  months: any;
  reports: any;
  vesselDeploymentReport:any;

  get loading() {
    return this.loadingSubject.asObservable();
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
  showLoader() {
    this.loadingSubject.next(true);
  }

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public toasterService: ToasterService,
    public router: Router
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
  }

  ngOnInit() {
    this.loadYears();
    this.vesselDeploymentReportForm = this.fb.group({
      year: ['', [Validators.required]],
      month: ['',[Validators.required]],
      typedata: ['', [Validators.required]],
    });
  }

  loadYears(type:string='after17') {
    this.years = [];
    this.months = [];
    if (type == 'after17') {
      this.yearUrl = 'get-archive-years';
      this.monthsUrl = 'get-archive-months';
      
    } else {
      this.yearUrl = 'cap-tab-report/get-archived-years';
      this.monthsUrl = 'cap-tab-report/get-archived-months';
      
    }
    this.getYears(type);
  }

  getYears(type:any) {
    this.showLoader();
    this.api.get(this.yearUrl).subscribe({
      next: (response: any) => {
        this.years = response.data;
        this.hideLoader();
        this.vesselDeploymentReportForm.get('year')?.setValue('');
        if(type == "after17"){
          this.vesselDeploymentReportForm.get('typedata')?.setValue('after17');
        }else{
          this.vesselDeploymentReportForm.get('typedata')?.setValue('before17');
        }
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => { },
    });
  }

  onChangeYear() {
      const year = this.vesselDeploymentReportForm?.get('year')?.value;
      this.api.getSearch(this.monthsUrl, { Year: year }).subscribe({
        next: (response: any) => {
          this.months = response.data;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => { },
      });
  }

  onSubmit() {
    if (this.vesselDeploymentReportForm.valid) {
      this.showLoader();
      this.api.getSearch('vessel-deployment/archived-vessel-deployment-report', this.vesselDeploymentReportForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
              this.vesselDeploymentReport = response.data;
              if (this.vesselDeploymentReport) {
                window.open(environment.VesselDeploymentReport+this.vesselDeploymentReport);
              }
          }
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => { },
      });
    }
  }

}
