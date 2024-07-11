import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from 'src/environments/environment';
declare var $: any;

@Component({
  selector: 'app-manage-relay',
  templateUrl: './manage-relay.component.html',
  styleUrls: ['./manage-relay.component.scss'],
})
export class ManageRelayComponent {
  manageRelayForm!: FormGroup;
  years: any;
  months: any;
  manageRelay: any;
  Year: any;
  Month: any;
  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public toasterService: ToasterService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

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
    this.manageRelayForm = this.fb.group({
      archivedYear: ['', [Validators.required]],
      archivedMonth: [''],
    });
    this.route.queryParams.subscribe((params) => {
      this.Year = params['Year'] ? +params['Year'] : '';
      this.Month = params['Month'];
    });

    this.api.get('get-archive-years').subscribe({
      next: (response: any) => {
        this.years = response.data;
        setTimeout(() => {
          if (this.Year) {
            this.manageRelayForm.get('archivedYear')?.setValue(this.Year);
            this.onChangeYear();
          }
          if (this.Month) {
            this.manageRelayForm.get('archivedMonth')?.setValue(this.Month);
            this.monthChange();
          }
        }, 10);
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => { },
    });

  }

  monthChange() {
    if (this.manageRelayForm.valid) {
      this.showLoader();
      const selectedValueMonth =
        this.manageRelayForm?.get('archivedMonth')?.value;
      this.router.navigate([], {
        queryParams: { Month: selectedValueMonth },
        queryParamsHandling: 'merge',
      });

      this.api.getSearch('manage-relay', this.manageRelayForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.manageRelay = response.data;
            this.hideLoader();
          }
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => { },
      });
    }
  }

  onChangeYear() {
    if (this.manageRelayForm.valid) {
      const year = this.manageRelayForm?.get('archivedYear')?.value;
      this.api.getSearch('get-archive-months', { Year: year }).subscribe({
        next: (response: any) => {
          this.months = response.data;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => { },
      });
      const selectedValueYear =
        this.manageRelayForm?.get('archivedYear')?.value;
      this.router.navigate([], {
        queryParams: { Year: selectedValueYear },
        queryParamsHandling: 'merge',
      });
    }
  }

  updateArchiveRelay(id: any) {
    this.showLoader();
    this.api
      .update('update-archive-relay', {
        id: id,
        eb_wayport: $('#eb_wayport' + id).val(),
        wb_wayport: $('#wb_wayport_' + id).val(),
        nb_wayport: $('#nb_wayport_' + id).val(),
        sb_wayport: $('#sb_wayport_' + id).val(),
      })
      .subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            if (this.Year && this.Month) {
              this.manageRelayForm.get('archivedYear')?.setValue(this.Year);
              this.manageRelayForm.get('archivedMonth')?.setValue(this.Month);
            }
            this.monthChange();
            this.hideLoader();
          } else {
            this.toasterService.error(response.error, '');
            this.hideLoader();
          }
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => { },
      });
  }
}
