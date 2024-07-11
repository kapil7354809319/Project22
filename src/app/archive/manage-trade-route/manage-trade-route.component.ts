import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../administrator/confirmation-dialog/confirmation-dialog.component';
import { mixinInitialized } from '@angular/material/core';
declare var $: any;

@Component({
  selector: 'app-manage-trade-route',
  templateUrl: './manage-trade-route.component.html',
  styleUrls: ['./manage-trade-route.component.scss']
})
export class ManageTradeRouteComponent {
  manageTradeRouteForm!: FormGroup;
  manageArchivedTradeRouteForm!: FormGroup;
  years: any;
  months: any;
  manageTradeRouteList: any;
  Year: any;
  Month: any;
  pagination: any;
  fromStart: any;
  editListData: any;
  per_page: any;
  total: any;
  getPerPageCount!: number[];
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  oldLimit: any;
  archiveTradeRouteView: any;

  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public toasterService: ToasterService,
    public router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
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
    this.manageTradeRouteForm = this.fb.group({
      archivedYear: ['', [Validators.required]],
      archivedMonth: [''],
    });

    this.manageArchivedTradeRouteForm = this.fb.group({
      trade_route_name: ['', [Validators.required]],
      out_of_scope: [''],
      dwt_adjustment: [''],
      high_cube_adjustment: [''],
      sequence: ['', [Validators.pattern('^[0-9]*$')]],
      direction: ['', [Validators.required]],
      vessel_deployment: ['Yes'],
      shipping_capacity: ['Yes'],
      archivedYear: [''],
      archivedMonth: [''],
      id: [''],
    });
    this.initialized();
  }

  initialized() {
    this.api.get('get-archive-years').subscribe({
      next: (response: any) => {
        this.years = response.data;
        setTimeout(() => {
          if (this.Year) {
            this.manageTradeRouteForm.get('archivedYear')?.setValue(this.Year);
            this.onChangeYear();
          }
          if (this.Month) {
            this.manageTradeRouteForm.get('archivedMonth')?.setValue(this.Month);
            this.monthChange();
          }
        }, 0);
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => { },
    });
    this.route.queryParams.subscribe((params) => {
      this.Year = params['Year'] ? +params['Year'] : '';
      this.Month = params['Month'];
    });
  }


  reloadData() {
    this.api.getSearch('manage-trade-route', this.manageTradeRouteForm.value).subscribe({
      next: (response: any) => {
        if (response.status === true) {
          this.manageTradeRouteList = response.data.data;
        }
      }
    })
  }

  monthChange() {
    if (this.manageTradeRouteForm.valid) {
      this.showLoader();
      const selectedValueMonth =
        this.manageTradeRouteForm?.get('archivedMonth')?.value;
      this.router.navigate([], {
        queryParams: { Month: selectedValueMonth },
        queryParamsHandling: 'merge',
      });
      this.api.getSearch('manage-trade-route', this.manageTradeRouteForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.manageTradeRouteList = response.data.data;
            this.pagination = response.data.links;
            this.fromStart = {
              from: response.data.from,
              current_page: response.data.current_page,
            };
            this.per_page = response.data.per_page;
            this.total = response.data.total;
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
    if (this.manageTradeRouteForm.valid) {
      const year = this.manageTradeRouteForm?.get('archivedYear')?.value;
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
        this.manageTradeRouteForm?.get('archivedYear')?.value;
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
              this.manageTradeRouteForm.get('archivedYear')?.setValue(this.Year);
              this.manageTradeRouteForm.get('archivedMonth')?.setValue(this.Month);
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

  onPerPageChange(event: any) {
    const url = this.pagination[1].url;
    const params = new URLSearchParams(url.split('?')[1]);
    const parameters: { [key: string]: string } = {};
    params.forEach((value, key) => {
      parameters[key] = value;
    });
    /*************************************************************/
    delete parameters['page'];
    this.oldLimit = parameters['limit'] ? parameters['limit'] : 20;
    const currentPage = Math.ceil(
      (this.fromStart.current_page * this.oldLimit) / this.per_page
    );
    const totalPages = Math.ceil(this.total / this.oldLimit);
    let paginationMove = Math.ceil(
      currentPage / (this.per_page / this.oldLimit || 1)
    );
    if (this.oldLimit !== this.per_page) {
      this.oldLimit = this.per_page;
      const newCurrentPage = Math.ceil(
        (currentPage * this.oldLimit) / this.per_page
      );
      paginationMove = Math.ceil(
        newCurrentPage / (this.per_page / this.oldLimit || 1)
      );
      if (paginationMove > totalPages) {
        paginationMove = totalPages;
      }
    }
    /*********************************************************/
    const additionalParams = {
      limit: this.per_page,
      page: paginationMove.toString(),
    };
    let allParams: { [key: string]: string } = {
      ...parameters,
      ...additionalParams,
    };

    this.api.getWithPerPage('manage-trade-route', '', allParams, true).subscribe({
      next: (response: any) => {
        this.manageTradeRouteList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => { },
      complete: () => {
        this.hideLoader();
      },
    });
  }

  changePagination(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.manageTradeRouteList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => { },
      complete: () => {
        this.hideLoader();
      },
    });
  }

  sortData(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'desc';
    }
    this.orderByColumn(column, this.sortDirection);
  }

  orderByColumn(column: string, orderBy: string) {
    const url = this.pagination[1].url;
    const params = new URLSearchParams(url.split('?')[1]);
    const parameters: { [key: string]: string } = {};
    params.forEach((value, key) => {
      parameters[key] = value;
    });
    /*************************************************************/
    delete parameters['page'];
    this.oldLimit = parameters['limit'] ? parameters['limit'] : 20;
    const currentPage = Math.ceil(
      (this.fromStart.current_page * this.oldLimit) / this.per_page
    );
    const totalPages = Math.ceil(this.total / this.oldLimit);
    let paginationMove = Math.ceil(
      currentPage / (this.per_page / this.oldLimit || 1)
    );
    if (this.oldLimit !== this.per_page) {
      this.oldLimit = this.per_page;
      const newCurrentPage = Math.ceil(
        (currentPage * this.oldLimit) / this.per_page
      );
      paginationMove = Math.ceil(
        newCurrentPage / (this.per_page / this.oldLimit || 1)
      );
      if (paginationMove > totalPages) {
        paginationMove = totalPages;
      }
    }
    /*********************************************************/
    const additionalParams = {
      limit: this.per_page,
      orderby: orderBy,
      column: column,
      page: paginationMove.toString(),
    };
    let allParams: { [key: string]: string } = {
      ...parameters,
      ...additionalParams,
    };
    this.api.getWithPerPage('manage-trade-route', '', allParams, true).subscribe({
      next: (response: any) => {
        this.manageTradeRouteList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => { },
      complete: () => {
        this.hideLoader();
      },
    });
  }

  viewData(Id: any) {
    this.showLoader();
    this.api.get('edit-manage-archived-trade-route/' + Id).subscribe({
      next: (response: any) => {
        this.archiveTradeRouteView = response.data;
        $('#archiveTradeRouteModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.hideLoader();
        }, 2000);
      },
    });
  }

  editSelect(id: any) {
    this.showLoader();
    this.api.get('edit-manage-archived-trade-route/' + id).subscribe({
      next: (response: any) => {
        this.archiveTradeRouteView = response.data;
        $('#editArchiveTradeRouteModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        setTimeout(() => {
          this.hideLoader();
        }, 2000);
      },
    });
  }

  deleteData(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        this.api.delete('archived-delete-trade-route/' + id).subscribe({
          next: (response: any) => {
            this.toasterService.success(
              environment.DATADELETEMESSAGE,
              environment.DATADELETETITLEMESSAGE
            );
          },
          error: (error: any) => {
            this.toasterService.error(error.error.message + ' - ' + name);
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
            this.hideLoader();
          },
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  closeModal() {
    $('#archiveTradeRouteModal').modal('hide');
    $('#editArchiveTradeRouteModal').modal('hide');
    // setTimeout(() => {
    //   this.resetForm();
    // }, 10);
  }

  onUpdate() {
    if (this.manageArchivedTradeRouteForm.valid) {
      this.showLoader();
      this.api.update('archived-trade-route', this.manageArchivedTradeRouteForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.closeModal();
            this.reloadData();
            this.hideLoader();
          } else {
            this.toasterService.error(response.error, '');
            this.hideLoader();
            this.closeModal();
          }
        },
        error: (error: any) => {
          this.toasterService.error(error, '');
          this.hideLoader();
          this.closeModal();
        },
        complete: () => {
        },
      });
    }
  }


}

