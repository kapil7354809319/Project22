import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CustomValidationService } from '../../services/custom-validation.service';
declare var $: any;

@Component({
  selector: 'app-relay',
  templateUrl: './relay.component.html',
  styleUrls: ['./relay.component.scss'],
})
export class RelayComponent {
  relayForm!: FormGroup;
  relayList: any;
  pagination: any;
  fromStart: any;
  editListData: any;
  per_page: any;
  total: any;
  tradeRouteList: any;
  showList: any = false;
  relayTotalList: any;
  tradeRouteId: any; // You can set this value as needed
  relay: any;
  sendData: any;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService,
    private CustomValidation: CustomValidationService
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
  }
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get_total_calculate_direction() {}

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
    this.relayForm = this.fb.group({
      trade_route_id: ['', [Validators.required]],
    });

    this.api.get('get-trade-route-relay-option').subscribe({
      next: (response: any) => {
        this.tradeRouteList = response.data;
      },
      error: (error: any) => {},
      complete: () => {
        this.hideLoader();
      },
    });

    this.showLoader();
    this.initializeData();
  }

  initializeData() {
    this.api.getWithPaginate('get-trade-route-relay').subscribe({
      next: (response: any) => {
        this.relayList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => {},
      complete: () => {
        this.hideLoader();
      },
    });
  }

  changePagination(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.relayList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
      },
      error: (error: any) => {},
      complete: () => {
        this.hideLoader();
      },
    });
  }

  // onPerPageChange(event: any) {
  //   this.api
  //     .getWithPerPage('get-trade-route-relay', { perPage: this.per_page })
  //     .subscribe({
  //       next: (response: any) => {
  //         this.relayList = response.data.data;
  //         this.pagination = response.data.links;
  //         this.fromStart = {
  //           from: response.data.from,
  //           current_page: response.data.current_page,
  //         };
  //         this.per_page = response.data.per_page;
  //         this.total = response.data.total;
  //       },
  //       error: (error: any) => {},
  //       complete: () => {
  //         this.hideLoader();
  //       },
  //     });
  // }

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
    this.api
      .getWithPerPage('get-trade-route-relay', '', allParams, true)
      .subscribe({
        next: (response: any) => {
          this.relayList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };
          this.per_page = response.data.per_page;
          this.total = response.data.total;
        },
        error: (error: any) => {},
        complete: () => {
          this.hideLoader();
        },
      });
  }

  editSelect(id: number) {
    this.relayForm.get('trade_route_id')?.setValue(id);
    window.scrollTo(0, 0);
    this.getServiceListOnChange();
  }

  onSubmit() {
    if (this.relayForm.valid) {
      this.showLoader();
      this.sendData = {
        eb_wayport: this.relayTotalList.fetch_relay.eb_wayport,
        wb_wayport: this.relayTotalList.fetch_relay.wb_wayport,
        nb_wayport: this.relayTotalList.fetch_relay.nb_wayport,
        sb_wayport: this.relayTotalList.fetch_relay.sb_wayport,
        trade_route_id: this.relayTotalList.trade_route_id,
        id: this.relayTotalList.fetch_relay.id,
      };
      this.api.post('relay', this.sendData).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            if (response.action === 'update') {
              this.checkChangeButtonText();
              this.toasterService.success(
                environment.DATAUPDATEMESSAGE,
                environment.DATAUPDATETITLEMESSAGE
              );
            }
            if (response.action === 'insert') {
              this.checkChangeButtonText();
              this.toasterService.success(
                environment.DATAINSERTMESSAGE,
                environment.DATAINSERTTITLEMESSAGE
              );
            }
            this.initializeData();
            this.hideLoader();
          } else {
            this.toasterService.error(response.error, '');
            this.hideLoader();
          }
        },
        error: (error: any) => {
          this.toasterService.error(error, '');
          this.hideLoader();
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }
  }

  checkChangeButtonText() {
    if (this.relayForm.valid) {
      this.api
        .post('get-trade-route-all-service', this.relayForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.relayTotalList = response.data;
            }
          },
        });
    }
  }

  onKeyUp(event: KeyboardEvent, input: string) {
    this.CustomValidation.numericFilter(event);
    var valueReturn = this.CustomValidation.validateRelayValue(event);
    if (input == 'diable_eb') {
      this.relayTotalList.fetch_relay.eb_wayport = valueReturn;
    }
    if (input == 'diable_wb') {
      this.relayTotalList.fetch_relay.wb_wayport = valueReturn;
    }
    if (input == 'diable_nb') {
      this.relayTotalList.fetch_relay.nb_wayport = valueReturn;
    }
    if (input == 'diable_sb') {
      this.relayTotalList.fetch_relay.sb_wayport = valueReturn;
    }
  }

  deleteData(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        this.api.delete('delete-trade-route-relay/' + id).subscribe({
          next: (response: any) => {
            this.toasterService.success(
              environment.DATADELETEMESSAGE,
              environment.DATADELETETITLEMESSAGE
            );
            this.initializeData();
            this.checkChangeButtonText();
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

  resetForm() {
    this.relayForm.reset();
  }

  closeModal() {
    $('#myModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  getServiceListOnChange() {
    if (this.relayForm.valid) {
      this.showLoader();
      this.api
        .post('get-trade-route-all-service', this.relayForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.showList = true;
              this.relayTotalList = response.data;
              this.hideLoader();
            } else {
              this.toasterService.error(response.error, '');
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
    this.api
      .getWithPerPage('get-trade-route-relay', '', allParams, true)
      .subscribe({
        next: (response: any) => {
          this.relayList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };
          this.per_page = response.data.per_page;
          this.total = response.data.total;
        },
        error: (error: any) => {},
        complete: () => {
          this.hideLoader();
        },
      });
  }
}
