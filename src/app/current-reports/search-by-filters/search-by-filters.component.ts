import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-search-by-filters',
  templateUrl: './search-by-filters.component.html',
  styleUrls: ['./search-by-filters.component.scss'],
})
export class SearchByFiltersComponent {
  years: any;
  months: any;
  searchByFilters!: FormGroup;
  showContent: boolean = false;
  portDownSettings: any;
  dropdownSettings: any;
  countryDownSettings: any;
  operatorDownSettings: any;
  regionDownSettings: any;
  VesselDownSettings: any;
  allianceDownSettings: any;
  subTradeDownSettings: any;
  tradeDownSettings: any;
  filter: any = [];
  portList: any;
  selectedPort: any = [];
  operatorList: any;
  selectedOperator: any = [];
  countryList: any;
  selectedCountry: any = [];
  regionsList: any;
  selectedRegions: any = [];
  vesselsList: any;
  selectedVessels: any = [];
  alliancesList: any;
  selectedAlliances: any = [];
  subtradeList: any;
  selectedSubtrade: any = [];
  traderouteList: any;
  selectedTraderoute: any = [];

  // new/////
  filteredServices: any = [];
  servicesList: any;

  totalShips: number = 0;
  activeShips: number = 0;
  missedShips: number = 0;
  totalShipTeu: number = 0;
  averageCapacity: number = 0;
  averageActiveCapacity: number = 0;
  maxShipTeu: number = 0;
  limit: number = 20;
  currentPage: number = 1;
  portNameWithRegion: any;
  
  pagination: any;
  fromStart: any;
  per_page: any;
  total: any;
  oldLimit: any;
  getPerPageCount!: number[];


  constructor(
    private fb: FormBuilder,
    public api: ApiService,
    public toasterService: ToasterService,
    public router: Router
  ) {
    this.getPerPageCount = this.api.getPerPageCount();
  }

  private loadingSubject = new BehaviorSubject<boolean>(false);

  get loading() {
    return this.loadingSubject.asObservable();
  }
  dummyData = [
    {
      'Service Name': 'Service 1',
      'Total Ships': 20,
      'Active Ships': 15,
      'Missed Ships': 5,
      'Frequency (Days)': 30,
      'Round Voyage': 'Yes',
      'Total ship TEU capacity': 500000,
      'Average Capacity (Total Ships)': 25000,
      'Average Capacity (Active Ships)': 33333.33,
      'Maximum ship TEU': 80000,
    },
    {
      'Service Name': 'Ningbo',
      'Total Ships': 20,
      'Active Ships': 15,
      'Missed Ships': 5,
      'Frequency (Days)': 30,
      'Round Voyage': 'Yes',
      'Total ship TEU capacity': 500000,
      'Average Capacity (Total Ships)': 25000,
      'Average Capacity (Active Ships)': 33333.33,
      'Maximum ship TEU': 80000,
    },
    {
      'Service Name': 'AAL',
      'Total Ships': 20,
      'Active Ships': 15,
      'Missed Ships': 5,
      'Frequency (Days)': 30,
      'Round Voyage': 'Yes',
      'Total ship TEU capacity': 500000,
      'Average Capacity (Total Ships)': 25000,
      'Average Capacity (Active Ships)': 33333.33,
      'Maximum ship TEU': 80000,
    },
    // Add more rows as needed
  ];

  ngOnInit() {
    this.showLoader();
    this.searchByFilters = this.fb.group({
      year: ['', [Validators.required]],
      month: [''],
      port: [''],
      operator: [''],
      country: [''],
      region: [''],
      vessel: [''],
      alliance: [''],
      subTrade: [''],
      route: [''],
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

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'port_name ',
      textField: 'port_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.portDownSettings = {
      singleSelection: false,
      idField: 'port_name',
      textField: 'port_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.operatorDownSettings = {
      singleSelection: false,
      idField: 'operator_name',
      textField: 'operator_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.countryDownSettings = {
      singleSelection: false,
      idField: 'country_name',
      textField: 'country_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.regionDownSettings = {
      singleSelection: false,
      idField: 'region_name',
      textField: 'region_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.VesselDownSettings = {
      singleSelection: false,
      idField: 'vessel_name',
      textField: 'vessel_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.allianceDownSettings = {
      singleSelection: false,
      idField: 'alliance_name',
      textField: 'alliance_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.subTradeDownSettings = {
      singleSelection: false,
      idField: 'trade_name',
      textField: 'trade_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.tradeDownSettings = {
      singleSelection: false,
      idField: 'trade_route_name',
      textField: 'trade_route_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  viewReport() {
    this.filter = [];
    this.showContent = !this.showContent;
    this.filter.push({ type: 'port', list: this.selectedPort });
    this.filter.push({ type: 'operator', list: this.selectedOperator });
    this.filter.push({ type: 'country', list: this.selectedCountry });
    this.filter.push({ type: 'regions', list: this.selectedRegions });
    this.filter.push({ type: 'vessels', list: this.selectedVessels });
    this.filter.push({ type: 'alliances', list: this.selectedAlliances });
    this.filter.push({ type: 'subtrade', list: this.selectedSubtrade });
    this.filter.push({ type: 'traderoute', list: this.selectedTraderoute });
    // console.log(this.filter);

    // newww
    this.filteredServices = this.dummyData.filter((service) => {
      // Check if the service matches all selected filters
      return (
        (this.selectedPort.length === 0 ||
          this.selectedPort.every((port: any) =>
            service['Service Name'].includes(port.item_text)
          )) &&
        (this.selectedOperator.length === 0 ||
          this.selectedOperator.every((operator: any) =>
            service['Service Name'].includes(operator.item_text)
          )) &&
        // Repeat the pattern for other filters (country, regions, vessels, alliances, subtrade, traderoute)
        true // Add other conditions as needed
      );
    });
    // newww
    console.log(this.filteredServices);
    console.log(this.filter);
  }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }
  export(reportType: string){
    
    const year = this.searchByFilters?.get('year')?.value;
    const month = this.searchByFilters?.get('month')?.value;
    let ports = this.selectedPort.map((item:any) => item.port_name);    
    ports = ports.toString();  
    let operators = this.selectedOperator.map((item:any) => item.operator_name);
    operators = operators.toString();

    let regions = this.selectedRegions.map((item:any) => item.region_name);
    regions = regions.toString();

    let countries = this.selectedCountry.map((item:any) => item.country_name);
    countries = countries.toString();

    let vessels = this.selectedVessels.map((item:any) => item.vessel_name);
    vessels = vessels.toString();

    let trades = this.selectedSubtrade.map((item:any) => item.trade_name);
    trades = trades.toString();

    let alliances = this.selectedAlliances.map((item:any) => item.alliance_name);
    alliances = alliances.toString();

    let routes = this.selectedTraderoute.map((item:any) => item.trade_route_name);
    routes = routes.toString()
    this.api.getSearchExport('excel-export-for-filters',{
      Year: year,
      Month: month,
      ports,
      operators,
      regions,
      countries,
      vessels,
      trades,
      alliances,
      routes,
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
  downloadExcel(response: any, fileName: string) {
    // Doing it this way allows you to name the file
    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    fileName = fileName || response.headers.get('content-disposition').split(';')[0];
    const file = new File([blob], fileName, { type: response.headers.get('content-type') });
    saveAs(file);
  }

  onChangeYear() {
    if (this.searchByFilters.valid) {
      const year = this.searchByFilters?.get('year')?.value;
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
  onChangeMonth() {
    if (this.searchByFilters.valid) {
      this.showLoader();
      const year = this.searchByFilters?.get('year')?.value;
      const month = this.searchByFilters?.get('month')?.value;

      let ports = '';
      let operators = '';
      let regions = '';
      let countries = '';
      let vessels = '';
      let trades = '';
      let alliances = '';
      let routes = '';

      this.selectedPort = [];
      this.selectedOperator = [];
      this.selectedCountry = [];
      this.selectedRegions = [];
      this.selectedVessels = [];
      this.selectedAlliances = [];
      this.selectedTraderoute = [];
      this.selectedSubtrade = [];
      
      this.searchByFilters.controls['port'].setValue('');
      this.searchByFilters.controls['operator'].setValue('');
      this.searchByFilters.controls['country'].setValue('');
      this.searchByFilters.controls['region'].setValue('');
      this.searchByFilters.controls['vessel'].setValue('');
      this.searchByFilters.controls['alliance'].setValue('');
      this.searchByFilters.controls['subTrade'].setValue('');
      this.searchByFilters.controls['route'].setValue('');

      const payLoad  = {
        Year: year,
        Month: month,
        ports,
        operators,
        regions,
        countries,
        vessels,
        trades,
        alliances,
        routes,
        limit: this.limit,
        page: this.currentPage,
       };
      this.api
      .getSearch('get-all-services', payLoad)
      .subscribe({
        next: (response: any) => {
          
          this.showContent = true;
          
          this.servicesList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };

          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.totalShips = 0;
          this.activeShips = 0;
          this.maxShipTeu =0
          this.missedShips = 0;
          this.totalShipTeu = 0;
          this.averageCapacity = 0;
          this.averageActiveCapacity = 0;
          
          this.totalShips = response.totalShips;
                    
          this.activeShips = response.activeShips;
          this.missedShips = response.missedShips;

          this.totalShipTeu = response.totalTeuCapacity;
          this.maxShipTeu = response.maxTeuCapacity;
          this.averageCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.totalShips) : 0;
          
          this.averageActiveCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.activeShips) : 0;

          this.api
            .getSearch('get-date-port', payLoad)
            .subscribe({
              next: (response: any) => {
                this.portList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-operator', payLoad)
            .subscribe({
              next: (response: any) => {
                this.operatorList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-country', payLoad)
            .subscribe({
              next: (response: any) => {
                this.countryList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-region', payLoad)
            .subscribe({
              next: (response: any) => {
                this.regionsList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-vessel', payLoad)
            .subscribe({
              next: (response: any) => {
                this.vesselsList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-alliance', payLoad)
            .subscribe({
              next: (response: any) => {
                this.alliancesList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-subTrade', payLoad)
            .subscribe({
              next: (response: any) => {
                this.subtradeList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-trade', payLoad)
            .subscribe({
              next: (response: any) => {
                this.traderouteList = response.data;
                this.hideLoader();
              },
              error: (error: any) => {
                this.hideLoader();
              },
            });
        },
        error: (error: any) => {},
      });
    }
  }
  onChangeFilter() {
    if (this.searchByFilters.valid) {
      this.showLoader();
      const year = this.searchByFilters?.get('year')?.value;
      const month = this.searchByFilters?.get('month')?.value;

      let ports = this.selectedPort.map((item:any) => item.port_name);    
      ports = ports.toString();  
      if(ports.length){
        const tempPort = this.portList.filter( (item:any) => ports.includes(item.port_name) );
        this.portNameWithRegion = tempPort.map((item:any) => {
          const {
            port_name,
            region_name
          } = item;
          return ' '+ port_name + '-' + region_name;
        });  
      }  

      let operators = this.selectedOperator.map((item:any) => item.operator_name);
      operators = operators.toString();

      let regions = this.selectedRegions.map((item:any) => item.region_name);
      regions = regions.toString();

      let countries = this.selectedCountry.map((item:any) => item.country_name);
      countries = countries.toString();

      let vessels = this.selectedVessels.map((item:any) => item.vessel_name);
      vessels = vessels.toString();

      let trades = this.selectedSubtrade.map((item:any) => item.trade_name);
      trades = trades.toString();

      let alliances = this.selectedAlliances.map((item:any) => item.alliance_name);
      alliances = alliances.toString();

      let routes = this.selectedTraderoute.map((item:any) => item.trade_route_name);
      routes = routes.toString()
      const payLoad  = {
        Year: year,
        Month: month,
        ports,
        operators,
        regions,
        countries,
        vessels,
        trades,
        alliances,
        routes,
        limit: this.limit,
        page: this.currentPage,
       };
      this.api
      .getSearch('get-all-services', payLoad)
      .subscribe({
        next: (response: any) => {
          
          this.showContent = true;
          
          this.servicesList = response.data.data;
          this.pagination = response.data.links;
          this.fromStart = {
            from: response.data.from,
            current_page: response.data.current_page,
          };

          this.per_page = response.data.per_page;
          this.total = response.data.total;
          this.totalShips = 0;
          this.activeShips = 0;
          this.maxShipTeu =0
          this.missedShips = 0;
          this.totalShipTeu = 0;
          this.averageCapacity = 0;
          this.averageActiveCapacity = 0;
          
          this.totalShips = response.totalShips;
                    
          this.activeShips = response.activeShips;
          this.missedShips = response.missedShips;

          this.totalShipTeu = response.totalTeuCapacity;
          this.maxShipTeu = response.maxTeuCapacity;
          this.averageCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.totalShips) : 0;
          
          this.averageActiveCapacity = this.totalShipTeu > 0 ? Math.round(this.totalShipTeu/this.activeShips) : 0;

          this.api
            .getSearch('get-date-port', payLoad)
            .subscribe({
              next: (response: any) => {
                this.portList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-operator', payLoad)
            .subscribe({
              next: (response: any) => {
                this.operatorList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-country', payLoad)
            .subscribe({
              next: (response: any) => {
                this.countryList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-region', payLoad)
            .subscribe({
              next: (response: any) => {
                this.regionsList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-vessel', payLoad)
            .subscribe({
              next: (response: any) => {
                this.vesselsList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-alliance', payLoad)
            .subscribe({
              next: (response: any) => {
                this.alliancesList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-subTrade', payLoad)
            .subscribe({
              next: (response: any) => {
                this.subtradeList = response.data;
              },
              error: (error: any) => {},
            });

          this.api
            .getSearch('get-date-trade', payLoad)
            .subscribe({
              next: (response: any) => {
                this.traderouteList = response.data;
                this.hideLoader();
              },
              error: (error: any) => {
                this.hideLoader();
              },
            });
        },
        error: (error: any) => {},
      });
    }
  }

  onSubmit() {}

  clear() {

    this.selectedPort = [];
    this.selectedOperator = [];
    this.selectedCountry = [];
    this.selectedRegions = [];
    this.selectedVessels = [];
    this.selectedAlliances = [];
    this.selectedTraderoute = [];
    this.selectedSubtrade = [];
    this.months = [];
    this.searchByFilters.reset();
    this.searchByFilters.controls['year'].setValue('');
    this.searchByFilters.controls['month'].setValue('');
  }

  onItemSelectPort(item: any) {
    // console.log(item)
    this.selectedPort.push(item);
    this.onChangeFilter();
  }

  onDeselectPort(item: any) {
    this.selectedPort = this.selectedPort.filter(
      (it: { port_name: any }) => it.port_name != item.port_name
    ).filter(
      (it: { port_name: any }) =>  it.port_name != item
    );
    this.onChangeFilter();
  }
  onSelectAllPort(items: any) {
    this.selectedPort = items;
    this.onChangeFilter();
  }
  
  // For Operator
  onItemSelectOperator(item: any) {
    this.selectedOperator.push(item);
    this.onChangeFilter();
  }

  onDeselectOperator(item: any) {
    this.selectedOperator = this.selectedOperator.filter(
      (it: { operator_name: any }) => it.operator_name != item.operator_name
    ).filter(
      (it: { operator_name: any }) =>  it.operator_name != item
    );
    this.onChangeFilter();
  }

  onSelectAllOperator(items: any) {
    // console.log(items);
    this.selectedOperator = items;
    this.onChangeFilter();
  }

  // For Country
  onItemSelectCountry(item: any) {
    this.selectedCountry.push(item);
    this.onChangeFilter();
    // console.log(this.selectedCountry);
  }

  onDeselectCountry(item: any) {
    this.selectedCountry = this.selectedCountry.filter(
      (it: { country_name: any }) => it.country_name != item.country_name
    ).filter(
      (it: { country_name: any }) =>  it.country_name != item
    );
    this.onChangeFilter();
    // console.log(this.selectedCountry);
  }

  onSelectAllCountry(items: any) {
    // console.log(items);
    this.selectedCountry = items;
    this.onChangeFilter();
  }

  // Repeat the pattern for other lists (regionsList, vesselsList, alliancesList, subtradeList, traderouteList)

  // For Regions
  onItemSelectRegions(item: any) {
    this.selectedRegions.push(item);
    // console.log(this.selectedRegions);
    this.onChangeFilter();
  }

  onDeselectRegions(item: any) {
    this.selectedRegions = this.selectedRegions.filter(
      (it: { region_name: any }) => it.region_name != item.region_name 
    ).filter(
      (it: { region_name: any }) =>  it.region_name != item
    );
    this.onChangeFilter();
  }

  onSelectAllRegions(items: any) {
    // console.log(items);
    this.selectedRegions = items;
    this.onChangeFilter();
  }

  // For Vessels
  onItemSelectVessels(item: any) {
    this.selectedVessels.push(item);
    this.onChangeFilter();
    // console.log(this.selectedVessels);
  }

  onDeselectVessels(item: any) {
    this.selectedVessels = this.selectedVessels.filter(
      (it: { vessel_name: any }) => it.vessel_name != item.vessel_name
    ).filter(
      (it: { vessel_name: any }) =>  it.vessel_name != item
    );
    this.onChangeFilter();
    // console.log(this.selectedVessels);
  }

  onSelectAllVessels(items: any) {
    // console.log(items);
    this.selectedVessels = items;
    this.onChangeFilter();
  }

  // For Alliances
  onItemSelectAlliances(item: any) {
    this.selectedAlliances.push(item);
    
    this.onChangeFilter();
    // console.log(this.selectedAlliances);
  }

  onDeselectAlliances(item: any) {
    this.selectedAlliances = this.selectedAlliances.filter(
      (it: { alliance_name: any }) => it.alliance_name != item.alliance_name
    ).filter(
      (it: { alliance_name: any }) =>  it.alliance_name != item
    );
    
    
    this.onChangeFilter();
    // console.log(this.selectedAlliances);
  }

  onSelectAllAlliances(items: any) {
    // console.log(items);
    this.selectedAlliances = items;
    
    
    this.onChangeFilter();
  }

  // For Subtrade
  onItemSelectSubtrade(item: any) {
    this.selectedSubtrade.push(item);
    this.onChangeFilter();
    // console.log(this.selectedSubtrade);
  }

  onDeselectSubtrade(item: any) {
    this.selectedSubtrade = this.selectedSubtrade.filter(
      (it: { trade_name: any }) => it.trade_name != item.trade_name
    ).filter(
      (it: { trade_name: any }) =>  it.trade_name != item
    );
    this.onChangeFilter();
    // console.log(this.selectedSubtrade);
  }

  onSelectAllSubtrade(items: any) {
    // console.log(items);
    this.selectedSubtrade = items;
    this.onChangeFilter();
  }

  // For Traderoute
  onItemSelectTraderoute(item: any) {
    this.selectedTraderoute.push(item);   
    
    this.onChangeFilter();
    // console.log(this.selectedTraderoute);
  }

  onDeselectTraderoute(item: any) {
    this.selectedTraderoute = this.selectedTraderoute.filter(
      (it: { trade_route_name: any }) => it.trade_route_name != item.trade_route_name
    ).filter(
      (it: { trade_route_name: any }) =>  it.trade_route_name != item
    ); 
    this.onChangeFilter();
    // console.log(this.selectedTraderoute);
  }

  onSelectAllTraderoute(items: any) {
    // console.log(items);
    this.selectedTraderoute = items;    
    this.onChangeFilter();
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
    this.api.getWithPerPage('get-all-services', '', allParams, true).subscribe({
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
  
}
