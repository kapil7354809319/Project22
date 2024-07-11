import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-view-archived-services',
  templateUrl: './view-archived-services.component.html',
  styleUrls: ['./view-archived-services.component.scss']
})
export class ViewArchivedServicesComponent {
  servicesArchiveForm !: FormGroup;
  years: any;
  months: any;
  constructor(private fb: FormBuilder, public api: ApiService, public toasterService: ToasterService, public router: Router) {
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
    this.servicesArchiveForm = this.fb.group({
      archivedYear: ['', [Validators.required]],
      archivedMonth: ['']
    });

    this.api.get('get-archive-years').subscribe({
      next: (response: any) => {
        this.years = response.data;
        this.hideLoader();
      },
      error: (error: any) => { this.hideLoader(); },
      complete: () => {
      }
    });
  }

  onSubmit() {
    if (this.servicesArchiveForm.valid) {
      const year = this.servicesArchiveForm?.get('archivedYear')?.value;
      const month = this.servicesArchiveForm?.get('archivedMonth')?.value;
      this.router.navigate(['administrator/service'], { queryParams: { year: year, month: month } });
    }
  }

  onChangeYear() {
    if (this.servicesArchiveForm.valid) {
      const year = this.servicesArchiveForm?.get('archivedYear')?.value;
      this.api.getSearch('get-archive-months', { 'Year': year }).subscribe({
        next: (response: any) => {
          this.months = response.data;
          this.hideLoader();
        },
        error: (error: any) => { this.hideLoader(); },
        complete: () => {
        }
      });
    }
  }

  resetForm() {
    this.servicesArchiveForm.reset();
    this.servicesArchiveForm.patchValue({
      archivedYear: '',
      archivedMonth: ''
    });
  }


}
