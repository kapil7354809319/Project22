import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../administrator/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthly-archive',
  templateUrl: './monthly-archive.component.html',
  styleUrls: ['./monthly-archive.component.scss']
})
export class MonthlyArchiveComponent {
  monthlyArchiveForm !: FormGroup;
  archiveLogsList: any;
  pagination: any;
  fromStart: any;
  total: any;
  per_page: any;
  constructor(private fb: FormBuilder, public api: ApiService, public toasterService: ToasterService, public dialog: MatDialog, private datePipe: DatePipe) {
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
    this.showLoader();
    this.monthlyArchiveForm = this.fb.group({
      date: ['', [Validators.required]]
    });
    this.initializeData();
  }

  initializeData() {
    this.api.getWithPaginate('get-archive-logs').subscribe({
      next: (response: any) => {
        this.archiveLogsList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = { 'from': response.data.from, 'current_page': response.data.current_page };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.hideLoader();
      },
      error: (error: any) => { this.hideLoader(); },
      complete: () => {
      }
    });
  }

  changePagination(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.archiveLogsList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = { 'from': response.data.from, 'current_page': response.data.current_page };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => { },
      complete: () => { this.hideLoader(); }
    });
  }

  onSubmit() {
    this.api.post('verify-archive-status', this.monthlyArchiveForm.value).subscribe({
      next: (response: any) => {
        if (response.status == true) {
          this.toasterService.error(environment.DATAARCHIVEALREADY, environment.DATAARCHIVEALREADYTITLE);
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '400px',
            data: {
              name: 'Archive Data Confirmation',
              archive: 'Yes',
              confirmation: 'Do you really want to Archive Data?'
            },
            hasBackdrop: true,
            disableClose: true
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.verifyPassword();
            } else {
              console.log('Data deletion canceled.');
            }
          });
        }
      },
      error: (error: any) => { },
      complete: () => {
      }
    });
  }

  verifyPassword(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: 'Step Verification',
        title: 'Please enter your password to add Archive Logs.',
        archive: 'Yes',
        buttonTitle: 'OK'
      },
      hasBackdrop: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.reason != '') {
          this.api.post('verify-admin-password', { 'password': result.reason }).subscribe({
            next: (response: any) => {
              if (response.status == true) {
                this.enterComment(this.monthlyArchiveForm.value);
              } else {
                this.toasterService.error(environment.INVALIDPASSWORD, environment.INVALIDPASSWORDTITLE);
              }
            },
            error: (error: any) => {

            }
          });
        } else {
          this.toasterService.error('Password is required');
        }
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  enterComment(date: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        name: "Add Comment",
        title: 'Please Enter Comments Here.',
        archive: 'Yes',
        buttonTitle: 'ADD'
      },
      hasBackdrop: true,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader();
        this.api.post('archive', { 'comments': result.reason, 'archive_date': this.monthlyArchiveForm?.get('date')?.value }).subscribe({
          next: (response: any) => {
            if (response.status == true) {
              this.toasterService.success(response.data, environment.DATAINSERTTITLEMESSAGE);
              this.initializeData();
            }
            this.hideLoader();
          },
          error: (error: any) => {
            this.hideLoader();
          }
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  resetForm() {
    this.monthlyArchiveForm.reset();
  }

  deleteData(id: number, date: string): void {
    const name = this.datePipe.transform(new Date(date), 'MMMM yyyy');
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '460px',
      data: {
        name: name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.showLoader();
        this.api.delete('delete-archive-logs/' + id).subscribe({
          next: (response: any) => {
            this.toasterService.success(environment.DATADELETEMESSAGE, environment.DATADELETETITLEMESSAGE);
            this.initializeData();
          },
          error: (error: any) => {
            this.toasterService.error(error.error.message + ' - ' + name);
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
            this.hideLoader();
          }
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  onPerPageChange(event: any) {
    this.api.getWithPerPage('get-archive-logs', { 'perPage': this.per_page }).subscribe({
      next: (response: any) => {
        this.archiveLogsList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = { 'from': response.data.from, 'current_page': response.data.current_page };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => { },
      complete: () => {
        this.hideLoader();
      }
    });
  }


}
