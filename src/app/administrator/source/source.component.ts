import { Component, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss'],
})
export class SourceComponent {
  sourceForm!: FormGroup;
  sourceSearchForm!: FormGroup;
  sourceList: any;
  pagination: any;
  fromStart: any;
  editListData: any;
  per_page: any;
  total: any;
  searchApply: boolean = false;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  tabActive: string = 'Add';
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(
    public cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService
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

  tabChange(tab: string) {
    this.tabActive = tab;
  }

  ngOnInit(): void {
    this.sourceForm = this.fb.group({
      source_name: ['', [Validators.required]],
      source_contact_name: ['', Validators.required],
      source_contact_phone: ['', Validators.required],
      source_contact_email: ['', [Validators.required, Validators.email]],
      source_fax: [''],
      source_address: [''],
      source_description: [''],
      id: [''],
    });

    this.sourceSearchForm = this.fb.group({
      source_name: [''],
      search: [1],
    });
    this.showLoader();
    this.initializeData();
  }

  initializeData() {
    this.api.getWithPaginate('get-source').subscribe({
      next: (response: any) => {
        this.sourceList = response.data.data;
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
        this.sourceList = response.data.data;
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
    this.api.getWithPerPage('get-source', '', allParams, true).subscribe({
      next: (response: any) => {
        this.sourceList = response.data.data;
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
    this.api.get('edit-get-source/' + id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        this.cdr.detectChanges();
        $('#myModal').modal('show');
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  onSubmit() {
    if (this.sourceForm.valid) {
      this.showLoader();
      this.api.post('source', this.sourceForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAINSERTMESSAGE,
              environment.DATAINSERTTITLEMESSAGE
            );
            this.initializeData();
            this.resetForm();
          } else {
            this.toasterService.error(response.error, '');
          }
        },
        error: (error: any) => {
          this.toasterService.error(error.error, '');
        },
        complete: () => {
          // Handle completion if needed
        },
      });
    }else{
      this.sourceForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.sourceForm.valid) {
      this.showLoader();
      this.api.update('source', this.sourceForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.closeModal();
            this.initializeData();
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
        this.api.delete('delete-source/' + id).subscribe({
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

  resetForm() {
    this.sourceForm.reset();
  }

  closeModal() {
    $('#myModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  onSearch() {
    if (this.sourceSearchForm.valid) {
      this.showLoader();
      this.api.getSearch('get-source', this.sourceSearchForm.value).subscribe({
        next: (response: any) => {
          this.searchApply = true;
          if (response.status === true) {
            this.sortDirection = '';
            this.sourceList = response.data.data;
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
    this.sourceSearchForm.get('source_name')?.setValue('');
    this.initializeData();
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
    this.api.getWithPerPage('get-source', '', allParams, true).subscribe({
      next: (response: any) => {
        this.sourceList = response.data.data;
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
