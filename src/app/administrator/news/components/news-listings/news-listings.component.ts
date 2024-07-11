import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { ToasterService } from '../../../../services/toaster.service';
import { environment } from '../../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { NewsServiceService } from '../../../../services/news-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-news-listings',
  templateUrl: './news-listings.component.html',
  styleUrls: ['./news-listings.component.scss'],
})
export class NewsListingsComponent {
  @Output() loaderEvent = new EventEmitter<boolean>();
  newsList: any;
  pagination: any;
  fromStart: any;
  per_page: any;
  total: any;
  update: any;
  editListData: any;
  searchApply: boolean = false;
  NewsSearchBox!: FormGroup;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(
    private newsService: NewsServiceService,
    public fb: FormBuilder,
    public dialog: MatDialog,
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
    this.loaderEvent.emit(true);
  }

  hideLoader() {
    this.loaderEvent.emit(false);
  }

  ngOnInit(): void {
    this.NewsSearchBox = this.fb.group({
      searching: [''],
      search: [1],
    });

    this.newsService.newsAdded$.subscribe(() => {
      this.initializeData();
    });

    this.newsService.newsSearch$.subscribe((newsSearchData) => {
      this.onSearchData(newsSearchData);
      // console.log(newsSearchData)
    });

    this.initializeData();
  }

  initializeData() {
    this.showLoader();
    this.api.getWithPaginate('get-news').subscribe({
      next: (response: any) => {
        this.newsList = response.data.data;
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
        this.newsList = response.data.data;
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
    this.api.getWithPerPage('get-news', '', allParams, true).subscribe({
      next: (response: any) => {
        this.newsList = response.data.data;
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
    this.newsService.announceNewsModel(id);
  }

  statusUpdate(id: any, status: string, identify: string) {
    let statustext;
    let statusconfirm;

    if (identify == 'active') {
      statusconfirm = 1;
      this.update = 'is_active';
      statustext = parseInt(status) === 1 ? 'activate' : 'inactive';
    }
    if (identify == 'status') {
      statusconfirm = 2;
      this.update = 'status';
      statustext = status === 'Pending' ? 'Done' : 'Pending';
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        statusconfirm: statusconfirm,
        status: statustext,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        this.api
          .update('news', { newsstatus: status, id: id, update: this.update })
          .subscribe({
            next: (response: any) => {
              if (response.status === true) {
                this.toasterService.success(
                  environment.DATAUPDATEMESSAGE,
                  environment.DATAUPDATETITLEMESSAGE
                );
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
    });
  }

  onSearchData(news: any) {
    this.showLoader();
    this.api.getSearch('get-news', news).subscribe({
      next: (response: any) => {
        this.searchApply = true;
        if (response.status === true) {
          this.sortDirection = '';
          this.newsList = response.data.data;
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

  onSearch() {
    if (this.NewsSearchBox.valid) {
      const searchingValue = this.NewsSearchBox?.get('searching')?.value;
      this.showLoader();
      this.api.getSearch('get-news', this.NewsSearchBox.value).subscribe({
        next: (response: any) => {
          this.searchApply = true;
          if (response.status === true) {
            this.sortDirection = '';
            this.newsList = response.data.data;
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
    this.api.getWithPerPage('get-news', '', allParams, true).subscribe({
      next: (response: any) => {
        this.newsList = response.data.data;
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
