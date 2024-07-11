import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { yearRangeValidator } from 'src/app/yearrangevalidator';
declare var $: any;
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss'],
})
export class VesselComponent {
  vesseldeletedBox!: FormGroup;
  vesselForm!: FormGroup;
  vesselSearchForm!: FormGroup;
  vesselSearchBox!: FormGroup;
  otherVesselSearchBox!: FormGroup;
  regionList: any;
  capacityrangeList: any;
  operatorList: any;
  vesselList: any;
  pagination: any;
  fromStart: any;
  editListData: any;
  per_page: any;
  total: any;
  vesselDeletedList: any;
  searchApply: boolean = false;
  otherVesselList: any;
  viewListData: any;
  editDeletedVessel: boolean = false;
  capacityValue: number = 0;
  fullListRange: any;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  tabActive: string = 'Search';
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(
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

  ngOnInit(): void {
    this.vesselForm = this.fb.group({
      IMO_no: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      vessel_name: ['', Validators.required],
      teu_capacity: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      ship_dwt: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      year_build: ['', [Validators.required, yearRangeValidator()]], 
      owner_company: ['', Validators.required],
      ownership_status: ['', Validators.required],
      vessel_type: ['', Validators.required],
      operator: ['', Validators.required],
      vessel_ex_name: ['', ''],
      refer_teu_capacity: ['', [Validators.pattern(/^[0-9]+$/)]],
      design_speed: ['', [Validators.pattern(/^[0-9]+$/)]],
      flag: [''],
      beam: [''],
      draft: [''],
      ship_EEDI_value: [0, [Validators.pattern(/^[0-9]+$/)]],
      ship_main_fuel_type: [''],
      ship_main_engine_fuel_consumption: [''],
      teu_capacity_range: [''],
      ship_auxiliary_fuel_consumption: [''],
      ship_status: [''],
      ship_auxiliary_fuel_type: [''],
      id: [''],
      current_service_id:[]
    });

    this.vesselSearchForm = this.fb.group({
      IMO_no: [''],
      vessel_name: [''],
      teu_capacity_range: [''],
      year_build: [''],
      owner_company: [''],
      operator: [''],
      vessel_ex_name: [''],
      search: [1],
    });

    this.vesseldeletedBox = this.fb.group({
      search: ['', Validators.required],
    });

    this.otherVesselSearchBox = this.fb.group({
      searching: [''],
      vesselFilter: [''],
      search: [1],
    });

    this.vesselSearchBox = this.fb.group({
      searching: [''],
      search: [1],
    });

    this.loadData();
  }

  loadData() {
    this.api.get('get-region').subscribe({
      next: (response: any) => {
        this.regionList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.operatorList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.api.get('get-capacity-range').subscribe({
      next: (response: any) => {
        this.capacityrangeList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });
    this.initializeData();
  }

  otherVessel() {
    this.showLoader();
    this.tabActive = 'Other';
    this.api.getWithPaginate('get-other-vessel').subscribe({
      next: (response: any) => {
        this.otherVesselList = response.data.data;
        this.pagination = response.data.links;
        this.fromStart = {
          from: response.data.from,
          current_page: response.data.current_page,
        };
        this.per_page = response.data.per_page;
        this.total = response.data.total;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {
        this.hideLoader();
      },
    });
  }

  changePaginationother(url: any) {
    this.showLoader();
    this.api.getWithPaginate(url).subscribe({
      next: (response: any) => {
        this.otherVesselList = response.data.data;
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

  onPerPageChangeOtherVessel(event: any) {
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
    this.api.getWithPerPage('get-other-vessel', '', allParams, true).subscribe({
      next: (response: any) => {
        this.otherVesselList = response.data.data;
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

  initializeData() {
    this.showLoader();
    this.api.getWithPaginate('get-vessel').subscribe({
      next: (response: any) => {
        this.vesselList = response.data.data;
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
    this.otherVessel();
  }

  deletedVessel() {
    this.showLoader();
    this.tabActive = 'Deleted';
    this.api.getWithPaginate('get-deleted-vessel').subscribe({
      next: (response: any) => {
        this.vesselDeletedList = response.data.data;
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
        this.vesselList = response.data.data;
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
    this.api.getWithPerPage('get-vessel', '', allParams, true).subscribe({
      next: (response: any) => {
        this.vesselList = response.data.data;
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

  onPerPageChangeDeleted(event: any) {
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
      .getWithPerPage('get-deleted-vessel', '', allParams, true)
      .subscribe({
        next: (response: any) => {
          this.vesselDeletedList = response.data.data;
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

  editSelect(id: number, deleted: boolean = false) {
    let uri;
    if (deleted) {
      uri = 'edit-get-deleted-vessel/' + id;
      this.editDeletedVessel = true;
    } else {
      uri = 'edit-get-vessel/' + id;
      this.editDeletedVessel = false;
    }
    this.api.get(uri).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        $('#myModal').modal('show');
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  editSelectOther(id: number) {
    if(id){
    this.api.get('edit-get-other-vessel/'+id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        $('#myModal').modal('show');
      },
      error: (error: any) => {},
      complete: () => {},
    });
    }
  }

  restoreVessel(id: number) {
    this.showLoader();
    this.api.get('get-restore-vessel/' + id).subscribe({
      next: (response: any) => {
        this.hideLoader();
        this.deletedVessel();
        if (response.status === true) {
          this.toasterService.success(
            environment.DATARESTORED,
            environment.DATAINSERTTITLEMESSAGE
          );
        } else {
          this.toasterService.error(response.error, '');
        }
      },
      error: (error: any) => {
        this.hideLoader();
        this.toasterService.error(error['message'], '');
      },
      complete: () => {},
    });
  }

  viewData(id: number, deleted: boolean = false) {
    this.showLoader();
    let uri;
    if (deleted) {
      uri = 'edit-get-deleted-vessel/' + id;
    } else {
      uri = 'edit-get-vessel/' + id;
    }
    this.api.get(uri).subscribe({
      next: (response: any) => {
        this.viewListData = response.data;
        $('#viewModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
  }

  viewDataOther(id: number) {
    this.showLoader();
    this.api.get('edit-get-other-vessel/'+id).subscribe({
      next: (response: any) => {
        this.viewListData = response.data;
        $('#viewModal').modal('show');
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
  }

  onSubmit() {
    if (this.vesselForm.valid) {
      this.showLoader();
      this.api.post('vessel', this.vesselForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAINSERTMESSAGE,
              environment.DATAINSERTTITLEMESSAGE
            );
            this.initializeData();
            this.resetForm();
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
    }else{
      this.vesselForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.vesselForm.valid) {
      this.showLoader();
      var uri;
      if (this.editDeletedVessel) {
        uri = 'deleted-vessel';
      } else {
        uri = 'vessel';
      }
      this.api.update(uri, this.vesselForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.closeModal();
            if (this.editDeletedVessel) {
              this.deletedVessel();
            } else {
              this.initializeData();
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
    }
  }

  deletedeletedData(id: number, name: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        name: name,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showLoader();
        this.api.delete('deleted-delete-vessel/' + id).subscribe({
          next: (response: any) => {
            this.toasterService.success(
              environment.DATADELETEMESSAGE,
              environment.DATADELETETITLEMESSAGE
            );
            this.deletedVessel();
          },
          error: (error: any) => {
            this.toasterService.error(error.error.message + ' - ' + name);
            this.hideLoader();
          },
          complete: () => {},
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
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
        this.api.delete('delete-vessel/' + id).subscribe({
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
          },
        });
      } else {
        console.log('Data deletion canceled.');
      }
    });
  }

  resetForm() {
    this.vesselForm.reset();
    this.vesselForm.patchValue({
      operator: '',
      ship_status: '',
      ownership_status: '',
      vessel_type: '',
    });
  }

  closeModal() {
    $('#myModal').modal('hide');
    $('#viewModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  otherSearch() {
    this.showLoader();
    if (this.otherVesselSearchBox.valid) {
      this.api
        .getSearch('get-other-vessel', this.otherVesselSearchBox.value)
        .subscribe({
          next: (response: any) => {
            this.sortDirection = '';
            this.otherVesselList = response.data.data;
            this.pagination = response.data.links;
            this.fromStart = {
              from: response.data.from,
              current_page: response.data.current_page,
            };
            this.per_page = response.data.per_page;
            this.total = response.data.total;
            this.hideLoader();
          },
          error: (error: any) => {
            this.hideLoader();
          },
          complete: () => {
            this.hideLoader();
          },
        });
    }
  }

  onSearch() {
    if (this.vesselSearchForm.valid) {
      this.showLoader();
      this.api.getSearch('get-vessel', this.vesselSearchForm.value).subscribe({
        next: (response: any) => {
          this.searchApply = true;
          if (response.status === true) {
            this.sortDirection = '';
            this.vesselList = response.data.data;
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

  onSearchDeletedBox() {
    if (this.vesseldeletedBox.valid) {
      this.showLoader();
      this.api
        .getSearch('get-deleted-vessel', this.vesseldeletedBox.value)
        .subscribe({
          next: (response: any) => {
            this.searchApply = true;
            if (response.status === true) {
              this.sortDirection = '';
              this.vesselDeletedList = response.data.data;
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

  onSearchBox() {
    if (this.vesselSearchBox.valid) {
      this.showLoader();
      this.api.getSearch('get-vessel', this.vesselSearchBox.value).subscribe({
        next: (response: any) => {
          this.searchApply = true;
          if (response.status === true) {
            this.sortDirection = '';
            this.vesselList = response.data.data;
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

  resetSearchForm(tab: string) {
    this.tabActive = tab;
    this.vesselSearchForm.patchValue({
      vessel_name: '',
      IMO_no: '',
      year_build: '',
      teu_capacity_range: '',
      owner_company: '',
      operator: '',
      vessel_ex_name: '',
      search: 1,
    });

    this.vesselSearchBox.patchValue({
      searching: '',
      search: 1,
    });

    this.searchApply = false;
    this.initializeData();
  }

  getTeuCapacityRange() {
    this.fullListRange = this.capacityrangeList.map(
      (item: { teu_capacity_range: any }) => item.teu_capacity_range
    );
    this.capacityValue = parseInt(
      this.vesselForm.get('teu_capacity')?.value,
      10
    );

    if (this.capacityValue) {
      for (let i = 0; i < this.fullListRange.length; i++) {
        const rangeParts = this.fullListRange[i].split('-');
        const fromRange = parseInt(rangeParts[0].replace(',', ''), 10);
        const toRange = parseInt(rangeParts[1].replace(',', ''), 10);
        if (fromRange <= this.capacityValue && toRange >= this.capacityValue) {
          var test = $(
            "select[formcontrolname='teu_capacity_range'] option:contains('" +
              this.fullListRange[i] +
              "')"
          ).val();
          this.vesselForm.get('teu_capacity_range')?.setValue(test);
        }
      }
    } else {
      this.vesselForm.get('teu_capacity_range')?.setValue('');
    }
  }

  sortData(column: string, data: string = 'default') {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'desc';
    }
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
      orderby: this.sortDirection,
      column: column,
      page: paginationMove.toString(),
    };
    let allParams: { [key: string]: string } = {
      ...parameters,
      ...additionalParams,
    };
    var vessel;
    if (data == 'other') {
      vessel = 'get-other-vessel';
    } else if (data == 'deleted') {
      vessel = 'get-deleted-vessel';
    } else {
      vessel = 'get-vessel';
    }
    this.api.getWithPerPage(vessel, '', allParams, true).subscribe({
      next: (response: any) => {
        if (data == 'other') {
          this.otherVesselList = response.data.data;
        } else if (data == 'deleted') {
          this.vesselDeletedList = response.data.data;
        } else {
          this.vesselList = response.data.data;
        }
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
  export(){
    this.showLoader();
    this.api.getVesselExport('vessel-export').subscribe({
      next: (response: any) => {
        this.hideLoader();
        this.downloadExcel(response, 'Vessel_list.xlsx');
        this.toasterService.success(
          environment.VESSELEXPORTEDSUCESS,
          environment.DATAINSERTTITLEMESSAGE
        );
      },
      error: (error: any) => {
        this.hideLoader();
        this.toasterService.error(
          error.message
        );
      },
      complete: () => { this.hideLoader(); },
    });
  }
  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
  }
}
