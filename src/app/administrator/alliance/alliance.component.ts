import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
declare var $: any;

@Component({
  selector: 'app-alliance',
  templateUrl: './alliance.component.html',
  styleUrls: ['./alliance.component.scss'],
})
export class AllianceComponent {
  allianceForm!: FormGroup;
  allianceSearchForm!: FormGroup;
  operatorList: any;
  allianceList: any;
  allocatedOptionValue: string[] = [];
  pagination: any;
  fromStart: any;
  editListData: any;
  filteredOperators: any;
  operatorEditList: any;
  editOperatorEdit: any;
  total: any;
  per_page: any;
  searchApply: boolean = false;
  sortedColumn: string | undefined;
  sortDirection: string | undefined;
  tabActive: string = 'Add';
  oldLimit: any;
  getPerPageCount: number[];
  form!: FormGroup;
  Editform!: FormGroup;
  filteredOperatorList: Array<{ operator_id: string; operator_name: string; }> | undefined;
  allocatedOperators: Array<{ operator_id: string, operator_name: string }> = [];
  filteredOperatorListEdit: Array<{ operator_id: string; operator_name: string; }> | undefined;
  OldEditData: any;
  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toasterService: ToasterService
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
    this.form = new FormGroup({
      filterText: new FormControl('')
    });
    this.Editform = new FormGroup({
      filterText: new FormControl('')
    });
  }
  @ViewChild('mySelect') mySelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('mySelectEdit') mySelectEdit!: ElementRef<HTMLSelectElement>;
  @ViewChild('mySelectSearch') mySelectSearch!: ElementRef<HTMLSelectElement>;

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
    this.allianceForm = this.fb.group({
      alliance_name: ['', [Validators.required]],
      id: [''],
    });

    this.allianceSearchForm = this.fb.group({
      alliance_name: [''],
      search: [1],
    });

    this.loadData();

    this.form.get('filterText')?.valueChanges.subscribe(value => {
      this.filterOperators(value);
    });
    this.Editform.get('filterText')?.valueChanges.subscribe(value => {
      this.filterOperatorsEdit(value);
    });
  }

  loadData() {
    this.showLoader();
    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.operatorList = response.data;
        this.filteredOperatorList = this.operatorList;
      },
      error: (error: any) => {},
      complete: () => {},
    });
    this.initializeData();
  }

  // filterOperators(filterText: string) {
  //   const filterTextLower = filterText.toLowerCase();
  //   this.filteredOperatorList = this.operatorList.filter((operator: { operator_name: string; }) =>
  //     operator.operator_name.toLowerCase().includes(filterTextLower)
  //   );
  // }
  filterOperators(filterText: string) {
    const filterTextLower = filterText.toLowerCase();
    this.filteredOperatorList = this.operatorList.filter((operator: { operator_name: string; }) =>
      operator.operator_name.toLowerCase().startsWith(filterTextLower)
    );
  }
  filterOperatorsEdit(filterText:string){
    const filterTextLower = filterText.toLowerCase();
    this.filteredOperatorListEdit = this.operatorEditList.filter((operator: { operator_name: string; }) =>
      operator.operator_name.toLowerCase().startsWith(filterTextLower)
    );
  }
  moveToRight() {
    const select1 = <HTMLSelectElement>document.getElementById('select1');
    const selectedOptions = Array.from(select1.selectedOptions);
    selectedOptions.forEach(option => {
      const operator = this.operatorList.find((op: { operator_id: any; }) => op.operator_id == option.value);
      if (operator) {
        this.allocatedOperators.push(operator);
        this.operatorList = this.operatorList.filter((op: { operator_id: any; }) => op.operator_id != option.value);
        this.filterOperators(this.form.get('filterText')?.value || '');
      }
    });
  }

  moveToRightEdit() {
    const select1 = <HTMLSelectElement>document.getElementById('myoption');
    const selectedOptions = Array.from(select1.selectedOptions);
    selectedOptions.forEach(option => {
      const operator = this.operatorEditList.find((op: { operator_id: any; }) => op.operator_id == option.value);
      if (operator) {
        this.editListData[0].allianceoperators.push(operator);
        this.operatorEditList = this.operatorEditList.filter((op: { operator_id: any; }) => op.operator_id != option.value);
        this.filterOperatorsEdit(this.form.get('filterText')?.value || '');
      }
    });
  }
  
  moveToLeft() {
    const select2 = <HTMLSelectElement>document.getElementById('select2');
    const selectedOptions = Array.from(select2.selectedOptions);
    selectedOptions.forEach(option => {
      const operator = this.allocatedOperators.find(op => op.operator_id == option.value);
      if (operator) {
        this.operatorList.push(operator);
        this.allocatedOperators = this.allocatedOperators.filter(op => op.operator_id != option.value);
        this.filterOperators(this.form.get('filterText')?.value || '');
      }
    });
  }
  moveToLeftEdit() {
    const select2 = <HTMLSelectElement>document.getElementById('myoption2');
    const selectedOptions = Array.from(select2.selectedOptions);
    selectedOptions.forEach(option => {
      const operator = this.editListData[0].allianceoperators.find((op: { operator_id: string; }) => op.operator_id == option.value);
      if (operator) {
        this.operatorEditList.push(operator);
        this.editListData[0].allianceoperators = this.editListData[0].allianceoperators.filter((op: { operator_id: string; }) => op.operator_id != option.value);
        this.filterOperatorsEdit(this.form.get('filterText')?.value || '');
      }
    });
  }
  initializeData() {
    this.api.getWithPaginate('get-alliance').subscribe({
      next: (response: any) => {
        this.allianceList = response.data.data;
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
        this.allianceList = response.data.data;
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
    this.api.getWithPerPage('get-alliance', '', allParams, true).subscribe({
      next: (response: any) => {
        this.allianceList = response.data.data;
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
    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.editOperatorEdit = response.data;
      },
    });

    this.api.get('edit-get-alliance/' + id).subscribe({
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
    this.api.get('get-operator').subscribe({
      next: (response: any) => {
        this.editOperatorEdit = response.data;
      },
    });

    this.api.get('edit-get-alliance/' + id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        this.OldEditData = JSON.stringify(response.data[0].allianceoperators);
        const operatorIds = this.editListData[0].allianceoperators.map(
          (operator: { operator_id: any }) => operator.operator_id
        );
        this.operatorEditList = this.editOperatorEdit.filter(
          (operator: { operator_id: number }) => {
            return !operatorIds.includes(operator.operator_id);
          }
        );
        this.filteredOperatorListEdit = this.operatorEditList;
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
    if (this.allianceForm.valid) {
      // const selectElement = this.mySelect.nativeElement;
      // const options = selectElement.options;
      const options = this.allocatedOperators;
      if (options.length > 0) {
        this.showLoader();
        this.allocatedOptionValue = [];
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const optionValue = option.operator_id;
          this.allocatedOptionValue.push(optionValue);
        }

        this.allianceForm.addControl(
          'allocated_operator',
          this.fb.control(this.allocatedOptionValue)
        );
        this.allianceForm
          .get('allocated_operator')
          ?.setValue(this.allocatedOptionValue);
        this.api.post('alliance', this.allianceForm.value).subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.toasterService.success(
                environment.DATAINSERTMESSAGE,
                environment.DATAINSERTTITLEMESSAGE
              );
              this.loadData();
              this.resetForm();
              // while (selectElement.options.length > 0) {
              //   selectElement.remove(0);
              // }
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
      } else {
        this.toasterService.error('Please select operator', '');
      }
    }else{
      this.allianceForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.allianceForm.valid) {
      // const selectElement = this.mySelectEdit.nativeElement;
      // const options = selectElement.options;
      const options = this.editListData[0].allianceoperators;
      if (options.length > 0) {
        this.showLoader();
        this.allocatedOptionValue = [];
        for (let i = 0; i < options.length; i++) {
          const option = options[i];
          const optionValue = option.operator_id;
          this.allocatedOptionValue.push(optionValue);
        }
        this.allianceForm.addControl(
          'allocated_operator',
          this.fb.control(this.allocatedOptionValue)
        );
        this.allianceForm
          .get('allocated_operator')
          ?.setValue(this.allocatedOptionValue);
        var UpdatedOperator = this.editOperatorEdit.filter((item:any) => {
            return this.allocatedOptionValue.includes(item.operator_id);
        });
        const comparedResult = this.compareOperators(JSON.parse(this.OldEditData), UpdatedOperator);
        this.allianceForm.value.defaultallianceoperators = comparedResult;
        this.api.update('alliance', this.allianceForm.value).subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.toasterService.success(
                environment.DATAUPDATEMESSAGE,
                environment.DATAUPDATETITLEMESSAGE
              );
              this.initializeData();
              this.resetForm();
              // while (selectElement.options.length > 0) {
              //   selectElement.remove(0);
              // }
              this.closeModal();
            } else {
              this.toasterService.error(response.error, '');
              this.hideLoader();
              this.closeModal();
            }
          },
          error: (error: any) => {
            this.toasterService.error(error, '');
            this.closeModal();
          },
          complete: () => {
            // Handle completion if needed
          },
        });
      } else {
        this.toasterService.error('Please select operator', '');
      }
    }
  }
  compareOperators(oldData: any, updatedData: any) {
    const comparedArray: any[] = [];

    // Check if oldData is an array
    if (!Array.isArray(oldData)) {
        console.error('oldData is not an array');
        return comparedArray;
    }

    // Check for new operators
    updatedData.forEach((updatedOperator: { operator_id: any; }) => {
        const found = oldData.find((oldOperator: { operator_id: any; }) => oldOperator.operator_id === updatedOperator.operator_id);
        if (!found) {
            comparedArray.push({...updatedOperator, class: 'new'});
        }
    });

    // Check for removed operators
    oldData.forEach((oldOperator: { operator_id: any; }) => {
        const found = updatedData.find((updatedOperator: { operator_id: any; }) => updatedOperator.operator_id === oldOperator.operator_id);
        if (!found) {
            comparedArray.push({...oldOperator, class: 'remove'});
        }
    });

    return comparedArray;
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
        this.api.delete('delete-alliance/' + id).subscribe({
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
    this.allianceForm.reset();
    this.searchApply = false;
    this.allocatedOperators = [];
    // const selectElement = this.mySelect.nativeElement;
    // while (selectElement.options.length > 0) {
    //   selectElement.remove(0);
    // }
    // $('.checkbutton').addClass('btn-disabled');
  }

  closeModal() {
    $('#myModal').modal('hide');
    $('#viewModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  onSearch() {
    if (this.allianceSearchForm.valid) {
      this.showLoader();
      const selectElement = this.mySelectSearch.nativeElement;
      const options = selectElement.options;
      this.allocatedOptionValue = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionValue = option.value;
        this.allocatedOptionValue.push(optionValue);
      }
      this.allianceSearchForm.addControl(
        'allocated_operator',
        this.fb.control(JSON.stringify(this.allocatedOptionValue))
      );
      this.allianceSearchForm
        .get('allocated_operator')
        ?.setValue(JSON.stringify(this.allocatedOptionValue));
      this.api
        .getSearch('get-alliance', this.allianceSearchForm.value)
        .subscribe({
          next: (response: any) => {
            this.searchApply = true;
            if (response.status === true) {
              this.sortDirection = '';
              this.allianceList = response.data.data;
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
    this.allianceSearchForm.get('alliance_name')?.setValue('');
    this.initializeData();
    this.searchApply = false;
    const selectElement = this.mySelectSearch.nativeElement;
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
    this.api.getWithPerPage('get-alliance', '', allParams, true).subscribe({
      next: (response: any) => {
        this.allianceList = response.data.data;
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
