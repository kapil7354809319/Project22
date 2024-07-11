import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ship-capacity-by-port-and-trade-route',
  templateUrl: './ship-capacity-by-port-and-trade-route.component.html',
  styleUrls: ['./ship-capacity-by-port-and-trade-route.component.scss']
})
export class ShipCapacityByPortAndTradeRouteComponent {

  showContent: boolean = false;
  showFormControls: boolean = true; // Initial value
  
  selectedOption: string='option1';
  private loadingSubject = new BehaviorSubject<boolean>(false);
  regionList: any;
  shipCapacityForm!: FormGroup;
  shipCapacityReportForm!: FormGroup;
  PeriodForm!:FormGroup;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  PortList: any;
  uniqOb:any;
  data_report: any;
  selected_port: any;
  isGenerateReport_error: boolean=false;
  constructor(
    private renderer: Renderer2, private el: ElementRef,
    private fb: FormBuilder,    
    public api: ApiService,
    private toasterService: ToasterService
  ) {
  }
  ngOnInit(): void {
    this.shipCapacityForm = this.fb.group({
      region_id: ['', [Validators.required]],
      ports:['', [Validators.required]],
      period_label:['monthly'],
      period: this.fb.array([
        this.fb.control(''), // Initialize with one form control
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control('')
      ]),
      search: [1],
    });
    this.PeriodForm = this.fb.group({
    });
    this.shipCapacityReportForm = this.fb.group({
      port_name: this.fb.array([])
    });
    
    this.loadData();
    this.PortList = new Array(this.periodArray.length).fill([])
  }

  get periodArray(): FormArray {
    return this.shipCapacityForm.get('period') as FormArray;
  }

  loadData() {
    this.showLoader();
    this.api.get('get-region').subscribe({
      next: (response: any) => {
        this.hideLoader();
        this.regionList = response.data;
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  // onCheckboxChange(event: Event,index: number) {

  //   const tableRow = this.el.nativeElement.querySelectorAll('.table');
  //   console.log(tableRow);
  //   if (tableRow) {
  //       const tableRowHtml = tableRow.outerHTML;
  //       console.log('Current Table Row HTML:', tableRowHtml);
  //   }

  //   // Cast the event target to HTMLInputElement to access checked and value properties
  //   const target = event.target as HTMLInputElement;
  
  //   const checkArray: FormArray = this.shipCapacityReportForm.get('port_name') as FormArray;
  
  //   if (target.checked) {
  //     checkArray.push(new FormControl(target.value));
  //   } else {
  //     let i: number = 0;
  //     checkArray.controls.forEach((control: AbstractControl<any>) => {
  //       if (control.value === target.value) {
  //         checkArray.removeAt(i);
  //         return;
  //       }
  //       i++;
  //     });
  //   }
  //   this.selected_port = checkArray.value;
  //   console.log(checkArray);
  // }
  
  onCheckboxChange(event: Event, index: number) {
    // Get the table row HTML for the corresponding port
    const tableRow = this.el.nativeElement.querySelectorAll('.table')[index];
    const tableRowHtml = tableRow.outerHTML;
  
    // Cast the event target to HTMLInputElement to access checked and value properties
    const target = event.target as HTMLInputElement;
  
    // Access the FormArray
    const checkArray: FormArray = this.shipCapacityReportForm.get('port_name') as FormArray;
  
    if (target.checked) {
      // Add the checked port name and its corresponding table row HTML
      checkArray.push(new FormControl({ name: target.value, html: tableRowHtml }));
    } else {
      // Remove the unchecked port from the FormArray
      let i: number = 0;
      checkArray.controls.forEach((control: AbstractControl<any>) => {
        if (control.value.name === target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  
    // Update the selected ports array
    this.selected_port = checkArray.value;
    console.log(this.selected_port);
  }
  
  
  toggleContent() {
    this.showContent = !this.showContent;
  }

  toggleFormControls(option: string) {
    this.showFormControls = true;
    this.selectedOption = option;
  }

  export(){

    

    this.showLoader();
    let url = ''
    if(this.selectedOption === 'option3'){
      url =  'get-connectivity-report';
    } else {
      url =  'get-port-summary-report';
    }
   
    this.api.getSearchExport(url, { }).subscribe({
      next: (response: any) => {
        this.hideLoader();
        const fileName ='connectivity_index_report.xlsx';
        this.downloadExcel(response, fileName);
        this.hideLoader();
      },
      error: (error: any) => {
        console.log(error);
        this.hideLoader();
        this.toasterService.error(error.statusText, '');
      },
      complete: () => {},
    });
  
  }

  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
  }
  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  get loading() {
    return this.loadingSubject.asObservable();
  }
  onSubmit(){
      this.showLoader();
      this.api.post('ship-capacity-data-report', this.shipCapacityForm.value).subscribe({
        next: (response: any) => {
          this.data_report = response.data;
          console.log(response);
          // if (response.status === true) {
            // this.toasterService.success(
            //   environment.DATAINSERTMESSAGE,
            //   environment.DATAINSERTTITLEMESSAGE
            // );
            // this.resetForm();
            // this.initializeData();
          // } else {
          //   this.toasterService.error(response.error, '');
            this.hideLoader();
          // }
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

 getKeys(obj: any): Array<string> {
    return Object.keys(obj);
  }
  ArchiveDataForPortCapacity(){
    if (this.shipCapacityForm.valid) {
      var i =0;
      const filteredPeriod = this.shipCapacityForm.value.period.filter((value: string) => value !== '');
      this.shipCapacityForm.value.period = filteredPeriod;
      console.log(this.shipCapacityForm.value.period);
      this.showLoader();
      // for(var i in this.shipCapacityForm.value.period.length)
      // this.uniqOb[this.shipCapacityForm.value.period[i]] = "";
      // if (this.shipCapacityForm.value.period.length != Object.keys(this.uniqOb).length) {
      //   return false;
      // }
      var m =1;
      this.shipCapacityForm.value.period.forEach((data:any) => {
        console.log(data);
        if(m == 1){
          this.shipCapacityForm.value.clear_old_records ='Yes';
        }else{
          this.shipCapacityForm.value.clear_old_records ='No';
        }
        m++;
        this.shipCapacityForm.value.perioddata = data;
        this.api.post('archiveddata-for-port-capacity', this.shipCapacityForm.value).subscribe({
            next: (response: any) => {
              i++;
              if(i >= this.shipCapacityForm.value.period.length){
                this.onSubmit();
              }
              
              console.log(response);
              // if (response.status === true) {
                // this.toasterService.success(
                //   environment.DATAINSERTMESSAGE,
                //   environment.DATAINSERTTITLEMESSAGE
                // );
                // this.resetForm();
                // this.initializeData();
              // } else {
              //   this.toasterService.error(response.error, '');
              //   this.hideLoader();
              // }
            },
            error: (error: any) => {
              this.toasterService.error(error, '');
              this.hideLoader();
            },
            complete: () => {
              // Handle completion if needed
            },
          });
      });
    }else{
      this.shipCapacityForm.markAllAsTouched();
    }
    return true;
  }
  getPort(){
      this.showLoader();
      this.api.getSearch('get-port-by-region', this.shipCapacityForm.value).subscribe({
        next: (response: any) => {
          // this.searchApply = true;
          if (response.status === true) {
            this.PortList = response.data;
            console.log(response);
            // this.sortDirection = '';
            // this.portList = response.data.data;
            // this.pagination = response.data.links;
            // this.fromStart = {
            //   from: response.data.from,
            //   current_page: response.data.current_page,
            // };
            // this.per_page = response.data.per_page;
            // this.total = response.data.total;
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

    handleAutoSuggest(index: number, keyword: string) {
      var type = this.shipCapacityForm.get('period_label')?.value;
      if(type == "monthly"){
        this.PeriodForm.value.monthly = keyword;
      }else{
        this.PeriodForm.value.quarterly = keyword;
      }
      this.api.getSearch('get-archived-service-period-list', this.PeriodForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.PortList[index] = response.data;
          } else {
          }
        },
        error: (error: any) => {
          // Handle error
        }
      });
    }

    // GetArchivedServicePeriodList(){
    //   this.showLoader();
    //   this.api.getSearch('get-archived-service-period-list', this.searchdata).subscribe({
    //     next: (response: any) => {
    //       // this.searchApply = true;
    //       if (response.status === true) {
    //         this.PortList = response.data;
    //         console.log(response);
    //         this.hideLoader();
    //       } else {
    //         this.toasterService.error(response.error, '');
    //         this.hideLoader();
    //       }
    //     },
    //     error: (error: any) => {
    //       this.toasterService.error(error, '');
    //       this.hideLoader();
    //     },
    //     complete: () => {
    //       // Handle completion if needed
    //     },
    //   });
    // }

    setSuggestion(index: number, suggestion: string) {
      (this.shipCapacityForm.get('period') as FormArray).at(index).setValue(suggestion);
      this.PortList[index] = []; // Clear suggestions once a suggestion is selected
    }


    GenerateReport(){
      this.selected_port = this.shipCapacityReportForm.value.port_name;
      console.log(this.selected_port);
      if(this.selected_port.length > 0){
        const filteredData = this.data_report.filter((item: { port_name: any; }) => {
          return this.selected_port.includes(item.port_name);
        });
        if(filteredData.length > 0){
        this.shipCapacityReportForm.value.data = filteredData;
        this.api.getShipPortTrade('ship-capacity-data-report-excel', this.shipCapacityReportForm.value).subscribe({
          next: (response: any) => {
            this.hideLoader();
            this.downloadExcel(response, 'ship_capacity_report_list.xlsx');
            // this.toasterService.success(
            //   environment.VESSELEXPORTEDSUCESS,
            //   environment.DATAINSERTTITLEMESSAGE
            // );
            console.log(response);
          },
          error: (error: any) => {
            console.log(error);
            this.toasterService.error(error, '');
            this.hideLoader();
          },
          complete: () => {
            // Handle completion if needed
          },
        });
        }
        console.log(filteredData);
      }else{
        this.isGenerateReport_error = true;
      }
      // if(this.shipCapacityReportForm.valid){
        
      // }else{
      //   this.shipCapacityReportForm.markAllAsTouched();
      // }
    }

    getPortControl(portName: string): FormControl {
      return this.fb.control(false); // Initialize with false or true based on your initial state
    }
    
    getMonths(data: any): string[] {
      // Assuming avg_ship_size_data is directly accessible from port
      return Object.keys(data); // Returns an array of keys ("Jan18", "Jan19", etc.)
  }

  onChange(email: string, event:any) {
    const emailFormArray = <FormArray>this.shipCapacityReportForm.controls['port_name'];

    if (event.currentTarget.checked) {
      emailFormArray.push(new FormControl(email));
    } else {
      let index = emailFormArray.controls.findIndex(x => x.value == email)
      emailFormArray.removeAt(index);
    }
  }

  clear() {
    this.shipCapacityForm = this.fb.group({
      region_id: ['', [Validators.required]],
      ports: ['', [Validators.required]],
      period_label: ['monthly'],
      period: this.fb.array([
        this.fb.control(''), // Initialize with one form control
        this.fb.control(''),
        this.fb.control(''),
        this.fb.control(''),
      ]),
      search: [1],
    });
    this.PeriodForm = this.fb.group({});
    this.loadData();
    this.PortList = new Array(this.periodArray.length).fill([]);
  }
}
