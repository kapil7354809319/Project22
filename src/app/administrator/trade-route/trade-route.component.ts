import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { CustomValidationService } from '../../services/custom-validation.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
declare var $: any;

@Component({
  selector: 'app-trade-route',
  templateUrl: './trade-route.component.html',
  styleUrls: ['./trade-route.component.scss'],
})
export class TradeRouteComponent {
  tradeForm!: FormGroup;
  tradeSearchForm!: FormGroup;
  tradeSearchBoxForm!: FormGroup;
  tradeList: any;
  allocatedOptionValue: string[] = [];
  tradeRouteList: any;
  pagination: any;
  fromStart: any;
  editListData: any;
  tradeEditForm: any;
  per_page: any;
  total: any;
  searchApply: boolean = false;
  tradeSerachList: any;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  tabActive: string = 'Add';
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(
    private renderer: Renderer2,
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
  @ViewChild('mySelect') mySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('mySelectEdit') mySelectEdit!: ElementRef<HTMLSelectElement>;
  @ViewChild('mySearch') mySearch!: ElementRef<HTMLSelectElement>;

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

  tabChange(tab: string) {
    this.tabActive = tab;
  }

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      trade_route_name: ['', [Validators.required]],
      out_of_scope: [''],
      dwt_adjustment: [''],
      high_cube_adjustment: [''],
      sequence: ['', [Validators.pattern('^[0-9]*$')]],
      direction: ['', [Validators.required]],
      vessel_deployment: ['Yes'],
      shipping_capacity: ['Yes'],
      id: [''],
    });

    this.tradeSearchForm = this.fb.group({
      trade_route_name: [''],
      direction: [''],
      vessel_deployment: ['Yes'],
      shipping_capacity: ['Yes'],
      search: [1],
    });

    this.tradeSearchBoxForm = this.fb.group({
      trade_route_name: [''],
      search: [1],
    });

    this.loadData();
  }

  loadData() {
    this.api.get('get-all-trades').subscribe({
      next: (response: any) => {
        this.tradeList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });
    this.showLoader();
    this.initializeData();

    this.api.get('get-trade').subscribe({
      next: (response: any) => {
        this.tradeSerachList = response.data;
      },
    });
  }

  initializeData() {
    this.api.getWithPaginate('get-trade-route').subscribe({
      next: (response: any) => {
        this.tradeRouteList = response.data.data;
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

  ngAfterViewInit(): void {
    this.loadScript();
  }

  loadScript() {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', 'assets/js/custom.js');
    this.renderer.appendChild(document.head, script);
  }

  removeScript() {
    const scriptToRemove = document.querySelector(
      'script[src="assets/js/custom.js"]'
    );
    if (scriptToRemove) {
      this.renderer.removeChild(document.head, scriptToRemove);
    }
  }

  ngOnDestroy() {
    this.removeScript();
  }

  changePagination(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.tradeRouteList = response.data.data;
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
    this.api.getWithPerPage('get-trade-route', '', allParams, true).subscribe({
      next: (response: any) => {
        this.tradeRouteList = response.data.data;
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

  viewData(id: number) {
    this.showLoader();
    this.api.get('get-trade').subscribe({
      next: (response: any) => {
        this.tradeEditForm = response.data;
      },
    });

    this.api.get('edit-get-trade-route/' + id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        $('#viewModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
  }

  editSelect(id: number) {
    this.api.get('get-all-trades').subscribe({
      next: (response: any) => {
        this.tradeEditForm = response.data;
      },
    });

    this.api.get('edit-get-trade-route/' + id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        const tradeIds = this.editListData[0].traderoutetrade.map(
          (trade: { trade_id: any }) => trade.trade_id
        );
        this.tradeEditForm = this.tradeEditForm.filter(
          (trade: { trade_id: number }) => {
            return !tradeIds.includes(trade.trade_id);
          }
        );
        this.cdr.detectChanges();
        $('#myModal').modal('show');
        setTimeout(() => {
          $('.add').on('click', function () {
            $('.select1 option:selected').each(function (
              this: HTMLOptionElement
            ) {
              $(this).appendTo('.select2');
            });
          });
          $('.remove').on('click', function () {
            $('.select2 option:selected').each(function (
              this: HTMLOptionElement
            ) {
              $(this).appendTo('.select1');
            });
          });
        }, 0);
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  onSubmit() {
    if (this.tradeForm.valid) {
      this.showLoader();
      const selectElement = this.mySelect.nativeElement;
      const options = selectElement.options;
      this.allocatedOptionValue = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionValue = option.value;
        this.allocatedOptionValue.push(optionValue);
      }

      this.tradeForm.addControl(
        'allocated_subtrades',
        this.fb.control(this.allocatedOptionValue)
      );
      this.tradeForm
        .get('allocated_subtrades')
        ?.setValue(this.allocatedOptionValue);
      this.api.post('trade-route', this.tradeForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAINSERTMESSAGE,
              environment.DATAINSERTTITLEMESSAGE
            );
            this.initializeData();
            this.resetForm();
            while (selectElement.options.length > 0) {
              selectElement.remove(0);
            }
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
    }else{
      this.tradeForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.tradeForm.valid) {
      this.showLoader();
      const selectElement = this.mySelectEdit.nativeElement;
      const options = selectElement.options;
      this.allocatedOptionValue = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionValue = option.value;
        this.allocatedOptionValue.push(optionValue);
      }

      this.tradeForm.addControl(
        'allocated_subtrades',
        this.fb.control(this.allocatedOptionValue)
      );
      this.tradeForm
        .get('allocated_subtrades')
        ?.setValue(this.allocatedOptionValue);
      this.api.update('trade-route', this.tradeForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.initializeData();
            this.resetForm();
            while (selectElement.options.length > 0) {
              selectElement.remove(0);
            }
            this.closeModal();
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
          // Handle completion if needed
        },
      });
    }
  }

  resetForm() {
    this.tradeForm.reset();
    this.tradeForm.patchValue({
      direction: '',
      vessel_deployment: 'Yes',
      shipping_capacity: 'Yes',
    });
    $('.checkbutton').addClass('btn-disabled');
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
        this.api.delete('delete-trade-route/' + id).subscribe({
          next: (response: any) => {
            this.toasterService.success(
              environment.DATADELETEMESSAGE,
              environment.DATADELETETITLEMESSAGE
            );
            this.initializeData();
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

  onKeyUp(event: KeyboardEvent) {
    this.CustomValidation.numericFilter(event);
    this.CustomValidation.validatePercentageValue(event);
  }

  closeModal() {
    $('#myModal').modal('hide');
    $('#viewModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  onSearch() {
    if (this.tradeSearchForm.valid) {
      this.showLoader();
      const selectElement = this.mySearch.nativeElement;
      const options = selectElement.options;
      this.allocatedOptionValue = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionValue = option.value;
        this.allocatedOptionValue.push(optionValue);
      }
      this.tradeSearchForm.addControl(
        'allocated_subtrades',
        this.fb.control(JSON.stringify(this.allocatedOptionValue))
      );
      this.tradeSearchForm
        .get('allocated_subtrades')
        ?.setValue(JSON.stringify(this.allocatedOptionValue));
      this.api
        .getSearch('get-trade-route', this.tradeSearchForm.value)
        .subscribe({
          next: (response: any) => {
            this.searchApply = true;
            if (response.status === true) {
              this.sortDirection = '';
              this.tradeRouteList = response.data.data;
              this.pagination = response.data.links;
              this.fromStart = {
                from: response.data.from,
                current_page: response.data.current_page,
              };
              this.per_page = response.data.per_page;
              this.total = response.data.total;
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

  onBoxSearch() {
    if (this.tradeSearchBoxForm.valid) {
      this.showLoader();
      const selectElement = this.mySearch.nativeElement;
      const options = selectElement.options;
      this.allocatedOptionValue = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionValue = option.value;
        this.allocatedOptionValue.push(optionValue);
      }
      this.tradeSearchBoxForm.addControl(
        'allocated_subtrades',
        this.fb.control(JSON.stringify(this.allocatedOptionValue))
      );
      this.tradeSearchBoxForm
        .get('allocated_subtrades')
        ?.setValue(JSON.stringify(this.allocatedOptionValue));
      this.api
        .getSearch('get-trade-route', this.tradeSearchBoxForm.value)
        .subscribe({
          next: (response: any) => {
            this.searchApply = true;
            if (response.status === true) {
              this.sortDirection = '';
              this.tradeRouteList = response.data.data;
              this.pagination = response.data.links;
              this.fromStart = {
                from: response.data.from,
                current_page: response.data.current_page,
              };
              this.per_page = response.data.per_page;
              this.total = response.data.total;
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

  resetSearchForm() {
    this.tradeSearchForm.get('trade_route_name')?.setValue('');
    this.tradeSearchForm.get('direction')?.setValue('');
    this.tradeSearchForm.get('vessel_deployment')?.setValue('Yes');
    this.tradeSearchForm.get('shipping_capacity')?.setValue('Yes');
    this.initializeData();
    this.searchApply = false;
    const selectElement = this.mySearch.nativeElement;
    while (selectElement.options.length > 0) {
      selectElement.remove(0);
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
    this.api.getWithPerPage('get-trade-route', '', allParams, true).subscribe({
      next: (response: any) => {
        this.tradeRouteList = response.data.data;
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
