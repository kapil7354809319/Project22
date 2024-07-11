import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { BehaviorSubject } from 'rxjs';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-port-to-port-search',
  templateUrl: './port-to-port-search.component.html',
  styleUrls: ['./port-to-port-search.component.scss'],
})
export class PortToPortSearchComponent {
  years: any;
  months: any;
  portToPortSearch!: FormGroup;
  showContent: boolean = false;
  portList: any;

  servicesList: any;
  totalShips: number = 0;
  activeShips: number = 0;
  missedShips: number = 0;
  totalShipTeu: number = 0;
  averageCapacity: number = 0;
  averageActiveCapacity: number = 0;
  maxShipTeu: number = 0;
  limit: number = 10;
  currentPage: number = 1;

  pagination: any;
  fromStart: any;
  per_page: any;
  total: any;
  oldLimit: any;
  getPerPageCount!: number[];

  constructor(private fb: FormBuilder, public api: ApiService) {
    
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);

  get loading() {
    return this.loadingSubject.asObservable();
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  onChangeYear() {

    const year = this.portToPortSearch?.get('year')?.value;
    if (year) {
      this.api.getSearch('get-archive-months', { Year: year }).subscribe({
        next: (response: any) => {
          this.months = response.data;
          this.hideLoader();
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
    }
  }

  ngOnInit() {
    this.showLoader();
    this.portToPortSearch = this.fb.group({
      year: ['', [Validators.required]],
      month: ['', [Validators.required]],
      departurePort: ['', [Validators.required]],
      arrivalPort: ['', [Validators.required]],
    });
    this.api.get('get-archive-years').subscribe({
      next: (response: any) => {
        this.years = response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
  }

  onSubmit() {
    if (this.portToPortSearch.valid) {
      this.showLoader();
      const departurePort = this.portToPortSearch?.get('departurePort')?.value;
      const year = this.portToPortSearch?.get('year')?.value;
      const month = this.portToPortSearch?.get('month')?.value;
      const arrivalPort = this.portToPortSearch?.get('arrivalPort')?.value;
      this.api
      .getSearch('get-services-by-port', {
        Year: year,
        Month: month,
        departurePort,
        arrivalPort,
        limit: this.limit,
        page: this.currentPage,
       })
        .subscribe({
          next: (response: any) => {
            this.showContent = true;
            this.totalShips = 0;
            this.activeShips = 0;
            this.maxShipTeu =0
            this.missedShips = 0;
            this.totalShipTeu = 0;
            this.averageCapacity = 0;
            this.averageActiveCapacity = 0;
            this.servicesList = response.data.data;
            console.log(response.data.data);
            this.pagination = response.data.links;
            this.fromStart = {
              from: response.data.from,
              current_page: response.data.current_page,
            };
            this.per_page = response.data.per_page;
            this.total = response.data.total;
            this.totalShips = response.totalShips;
                      
            this.activeShips = response.activeShips;
            this.missedShips = response.missedShips;
  
            this.totalShipTeu = response.totalTeuCapacity;
            this.maxShipTeu = response.maxTeuCapacity;
            this.averageCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.totalShips) : 0;
            
            this.averageActiveCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.activeShips) : 0;
            
            this.showContent =true;
            this.hideLoader();
          },
          error: (error: any) => {
            this.hideLoader();
          },
        });
    }
  }

  onChangeMonth() {
    
    const year = this.portToPortSearch?.get('year')?.value;
    const month = this.portToPortSearch?.get('month')?.value;
    if (year && month) {
      this.showLoader();
      this.api
        .getSearch('get-date-archive-port', { Year: year, Month: month })
        .subscribe({
          next: (response: any) => {
            this.portList = response.data;
          },
          error: (error: any) => {},
        });
    }
  }
  export(reportType: string){
    
    if (this.portToPortSearch.valid) {
      this.showLoader();
      const departurePort = this.portToPortSearch?.get('departurePort')?.value;
      const year = this.portToPortSearch?.get('year')?.value;
      const month = this.portToPortSearch?.get('month')?.value;
      const arrivalPort = this.portToPortSearch?.get('arrivalPort')?.value;
      this.api
        .getSearchExport('excel-export-for-ports', {
          Year: year,
          Month: month,
          departurePort,
          arrivalPort,
        reportType
      }).subscribe({
        next: (response: any) => {
          this.hideLoader();
          this.downloadExcel(response, 'service_list.xlsx');
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
    }
  
  }
  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
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
    const checkLastPage = paginationMove * this.per_page;
    if(checkLastPage > this.total){
      paginationMove = Math.ceil(this.total / this.per_page);
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
    this.api.getWithPerPage('get-services-by-port', '', allParams, true).subscribe({
      next: (response: any) => {
        this.servicesList = response.data.data;
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
        this.servicesList = response.data.data;
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
  
  roundOff(value: number){
    return Math.round(value);
  }
  getTransitDays(ports_zip: any){
    let start = ports_zip.indexOf('port_name<=>');
    let end = ports_zip.indexOf('Vessel data');
    ports_zip = ports_zip.substr(start, end);
    let portsZipArray=ports_zip.split("<><>");
		let revers="N";
    let de_po="N";
    let ar_po="N";
    let dr_po_transit=0;
    let total_departure_days=0;
    let cont_status="Y";

    let first_arrival: any=[];
    let first_status="N";
    let dep_status="N";
    let ar_status="N";
    let last_port: any=[];
    let departure_port_array: any =[];
    let continue_status="Y";
    let transit_days=0;
    for(let countPortsZipData=0;countPortsZipData<portsZipArray.length;countPortsZipData++)
    {
      let portRowsArray=portsZipArray[countPortsZipData].split("<>");
      let explode_port_name=portRowsArray[0].split("<=>");
      let port_name=explode_port_name[1];
      let explode_arrival=portRowsArray[6].split("<=>");
      let explode_departure=portRowsArray[7].split("<=>");
      let arrival_days=explode_arrival[1];
      let departure_days=explode_departure[1];
      let arrival_ports = this.portToPortSearch?.get('arrivalPort')?.value;
      let departure_ports = this.portToPortSearch?.get('departurePort')?.value;
      if(continue_status=="Y")
      {
        
        if(first_status=="N" && port_name==arrival_ports)
        {
          first_status="Y";
          first_arrival=[port_name,arrival_days,departure_days];
        }
        if(port_name==departure_ports)
        {
          dep_status="Y";
          departure_port_array=[port_name,arrival_days,departure_days];
        }
        if(port_name==arrival_ports && dep_status=="Y")
        {
          continue_status="N";
          transit_days=arrival_days-departure_port_array[2];
        }
      }
      last_port=[port_name,arrival_days,departure_days];
    }
    if(continue_status=="Y")
    {
      let deference_last_dep= last_port[2]-departure_port_array[2];
      transit_days=deference_last_dep+parseInt(first_arrival[1]);
    }
   return transit_days;
  }
  clear(){
    this.portToPortSearch.reset();

    this.months = [];
    this.portToPortSearch.controls['year'].setValue('');
    this.portToPortSearch.controls['month'].setValue('');
    this.portToPortSearch.controls['arrivalPort'].setValue('');
    this.portToPortSearch.controls['departurePort'].setValue('');
  }
}
