import { Component, ChangeDetectorRef } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
declare var $: any;

@Component({
  selector: 'app-add-service-to-archive',
  templateUrl: './add-service-to-archive.component.html',
  styleUrls: ['./add-service-to-archive.component.scss'],
})
export class AddServiceToArchiveComponent {
  addServiceArchiveForm!: FormGroup;
  selectedYear: any; // Store the selected year here
  years: number[] = [];
  monthArray: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  selectedId: any;
  constructor(
    public DataService: DataServiceService,
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = 2016; y <= currentYear; y++) {
      this.years.push(y);
    }
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

  ngOnInit(): void {
    this.addServiceArchiveForm = this.fb.group({
      from_year: ['', [Validators.required]],
      to_year: ['', Validators.required],
      from_month: ['', Validators.required],
      to_month: ['', Validators.required],
      selectedId: [this.DataService.serviceIds],
    });
  }

  // test() {
  //   this.router.navigateByUrl('/administrator/service#search');
  // }

  onSubmit() {
    if (this.addServiceArchiveForm.valid) {
      var selectedId =
        this.addServiceArchiveForm?.get('selectedId')?.value || '';
      if (selectedId == '') {
        this.toasterService.error(environment.DATASERVICEIDNOTFIND, '');
      } else {
        this.showLoader();
        this.api
          .post('add-service-to-archive', this.addServiceArchiveForm.value)
          .subscribe({
            next: (response: any) => {
              if (response.status === true) {
                this.toasterService.success(
                  environment.DATAINSERTMESSAGE,
                  environment.DATAINSERTTITLEMESSAGE
                );
                this.DataService.clearServiceIds();
                this.hideLoader();
                this.router.navigateByUrl('/administrator/service#search');
              } else {
                const Errorresponse = response.error.toString();
                this.toasterService.error("already archived for months-" + Errorresponse, '');
                this.hideLoader();
              }
            },
            error: (error: any) => {
              this.toasterService.error(error, '');
              this.hideLoader();
            },
            complete: () => {},
          });
      }
    }
  }

  resetForm() {
    this.addServiceArchiveForm.patchValue({
      from_year: '',
      from_month: '',
      to_year: '',
      to_month: '',
    });
    ['from_year', 'from_month', 'to_year', 'to_month'].forEach((key) => {
      this.addServiceArchiveForm.get(key)?.markAsUntouched();
    });
  }

  onFromYearChange() {
    const year = this.addServiceArchiveForm.get('from_year')?.value;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    let allMonths = '<option value="">Select Month</option>';
    if (year !== '') {
      let selected_month = 12;
      if (year == currentYear) {
        selected_month = currentMonth - 1;
      }
      for (let i = 0; i < selected_month; i++) {
        allMonths +=
          '<option value="' + (i + 1) + '">' + this.monthArray[i] + '</option>';
      }
      document.getElementById('from_month')!.innerHTML = allMonths;
    } else {
      document.getElementById('from_month')!.innerHTML =
        '<option value="">Select Month</option>';
    }
  }
  onToYearChange() {
    const year = this.addServiceArchiveForm.get('to_year')?.value;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    let allMonths = '<option value="">Select Month</option>';
    if (year !== '') {
      let selected_month = 12;

      if (year == currentYear) {
        selected_month = currentMonth - 1;
      }
      for (let i = 0; i < selected_month; i++) {
        allMonths +=
          '<option value="' + (i + 1) + '">' + this.monthArray[i] + '</option>';
      }
      document.getElementById('to_month')!.innerHTML = allMonths;
    } else {
      document.getElementById('to_month')!.innerHTML =
        '<option value="">Select Month</option>';
    }
  }
}
