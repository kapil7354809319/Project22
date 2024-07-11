import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/administrator/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-current-vessel-report',
  templateUrl: './current-vessel-report.component.html',
  styleUrls: ['./current-vessel-report.component.scss']
})
export class CurrentVesselReportComponent {
  private loadingSubject = new BehaviorSubject<boolean>(false);
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
    public router: Router,
    public dialog: MatDialog,
  ) {
  }

  generateReports() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        reportConfirm:true
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        this.api
        .getSearchExport('export', {})
        .subscribe({
          next: (response: any) => {
            this.hideLoader();
            this.downloadExcel(response, 'vesselDeploymentReport.xlsx');
            this.toasterService.success(
              environment.REPORTGENERATED,
              environment.DATAINSERTTITLEMESSAGE
            );
          },
          error: (error: any) => { this.hideLoader(); },
        });
      }else {
        console.log('Canceled.');
        this.toasterService.error(
          environment.REPORTCANCELLED
        );
      }
    })
  }

  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
    this.hideLoader();
  }
}
