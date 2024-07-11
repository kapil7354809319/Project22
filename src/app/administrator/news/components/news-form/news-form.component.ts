import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ApiService } from '../../../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ToasterService } from '../../../../services/toaster.service';
import { Editor } from 'ngx-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NewsServiceService } from '../../../../services/news-service.service';
declare var $: any;

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent {
  @Output() loaderEvent = new EventEmitter<boolean>();
  newsForm!: FormGroup;
  newsSearchForm!: FormGroup;
  editor!: Editor;
  editor1!: Editor;
  html = '';
  servicesTags: any;
  operatorTags: any;
  tradeTags: any;
  portTags: any;
  regionTags: any;
  servicesTagsSettings: IDropdownSettings = {};
  operatorTagsSettings: IDropdownSettings = {};
  tradeTagsSettings: IDropdownSettings = {};
  portTagsSettings: IDropdownSettings = {};
  regionTagsSettings: IDropdownSettings = {};
  /**search form0 */
  servicesTagsSetting: IDropdownSettings = {};
  operatorTagsSetting: IDropdownSettings = {};
  tradeTagsSetting: IDropdownSettings = {};
  portTagsSetting: IDropdownSettings = {};
  regionTagsSetting: IDropdownSettings = {};

  selectedImage!: string | ArrayBuffer | null;
  defaultImages: { [key: string]: string } = {
    '.bmp': 'assets/images/default/bmp.png',
    '.txt': 'assets/images/default/txt.png',
    '.pdf': 'assets/images/default/pdf.png',
    '.doc': 'assets/images/default/doc.png',
    '.docx': 'assets/images/default/docx.png',
    '.ppt': 'assets/images/default/ppt.png',
    '.pptx': 'assets/images/default/pptx.png',
    '.xls': 'assets/images/default/xls.png',
    '.xlsx': 'assets/images/default/xlsx.png',
  };
  editListData: any;
  searchApply: boolean = false;
  selectedImageData!: string | ArrayBuffer | null;
  fileExtension!: string;
  tabActive: string = 'Add';

  constructor(
    public cdr: ChangeDetectorRef,
    public api: ApiService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private newsService: NewsServiceService
  ) {}

  showLoader() {
    this.loaderEvent.emit(true);
  }

  hideLoader() {
    this.loaderEvent.emit(false);
  }

  tabChange(tab: string) {
    this.tabActive = tab;
    // this.newsService.announceNewsTabChange();
  }

  ngOnInit(): void {
    this.newsService.newsModel$.subscribe((newsid: any) => {
      this.editSelect(newsid);
    });

    this.editor = new Editor();
    this.editor1 = new Editor();
    this.newsForm = this.fb.group({
      title: ['', [Validators.required]],
      source: [''],
      source_link: [''],
      target_date: [''],
      region: [''],
      port: [''],
      trade_route: [''],
      service: [''],
      operator: [''],
      files: [''],
      status: ['Pending'],
      description: [''],
      oldFile: [''],
      id: [''],
    });

    this.newsSearchForm = this.fb.group({
      region: [''],
      port: [''],
      trade_route: [''],
      service: [''],
      operator: [''],
      to: [''],
      from: [''],
      search: [1],
    });

    this.loadData();
  }

  loadData() {
    this.api.get('get-tags').subscribe({
      next: (response: any) => {
        this.servicesTags = response.data.services;
        this.operatorTags = response.data.operator;
        this.tradeTags = response.data.trade;
        this.portTags = response.data.port;
        this.regionTags = response.data.region;
      },
      error: (error: any) => {},
      complete: () => {},
    });

    this.servicesTagsSettings = {
      idField: 'service_name',
      textField: 'service_name',
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.operatorTagsSettings = {
      idField: 'operator_name',
      textField: 'operator_name',
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.tradeTagsSettings = {
      idField: 'trade_name',
      textField: 'trade_name',
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.portTagsSettings = {
      idField: 'port_name',
      textField: 'port_name',
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.regionTagsSettings = {
      idField: 'region_name',
      textField: 'region_name',
      singleSelection: false,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    /******search form********/
    this.servicesTagsSetting = {
      idField: 'service_name',
      textField: 'service_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.operatorTagsSetting = {
      idField: 'operator_name',
      textField: 'operator_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.tradeTagsSetting = {
      idField: 'trade_name',
      textField: 'trade_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.portTagsSetting = {
      idField: 'port_name',
      textField: 'port_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
    this.regionTagsSetting = {
      idField: 'region_name',
      textField: 'region_name',
      singleSelection: true,
      enableCheckAll: false,
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };
  }

  setToDateMin() {
    this.newsSearchForm
      .get('to')
      ?.setValidators([
        Validators.required,
        Validators.min(this.newsSearchForm.get('from')?.value),
      ]);
    this.newsSearchForm?.get('to')?.updateValueAndValidity();
  }

  editSelect(id: number) {
    this.api.get('edit-get-news/' + id).subscribe({
      next: (response: any) => {
        this.editListData = response.data;
        const serviceArray = response.data[0].services
          .split(',')
          .map((item: any) => item.trim());
        if (serviceArray != '') {
          const serviceObjects = serviceArray.map((service: any) => ({
            service_name: service,
          }));
          if (serviceObjects.length > 0) {
            this.newsForm.controls['service'].setValue(serviceObjects);
          }
        }
        const operatorsArray = response.data[0].operators
          .split(',')
          .map((item: any) => item.trim());
        if (operatorsArray != '') {
          const operatorObjects = operatorsArray.map((operator: any) => ({
            operator_name: operator,
          }));
          if (operatorObjects.length > 0) {
            this.newsForm.controls['operator'].setValue(operatorObjects);
          }
        }
        const tradesArray = response.data[0].trades
          .split(',')
          .map((item: any) => item.trim());

        if (tradesArray != '') {
          const tradeObjects = tradesArray.map((trade: any) => ({
            trade_name: trade,
          }));
          if (tradeObjects.length > 0) {
            this.newsForm.controls['trade_route'].setValue(tradeObjects);
          }
        }
        const portsArray = response.data[0].ports
          .split(',')
          .map((item: any) => item.trim());
        if (portsArray != '') {
          const portObjects = portsArray.map((port: any) => ({
            port_name: port,
          }));
          if (portObjects.length > 0) {
            this.newsForm.controls['port'].setValue(portObjects);
          }
        }
        const regionsArray = response.data[0].regions
          .split(',')
          .map((item: any) => item.trim());
        if (regionsArray != '') {
          const regionObjects = regionsArray.map((region: any) => ({
            region_name: region,
          }));
          if (regionObjects.length > 0) {
            this.newsForm.controls['region'].setValue(regionObjects);
          }
        }

        this.cdr.detectChanges();
        $('#myModal').modal('show');
      },
      error: (error: any) => {},
      complete: () => {},
    });
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.showLoader();
      if (this.selectedImageData != '') {
        this.newsForm.addControl(
          'imageblob',
          this.fb.control(this.selectedImageData)
        );
        this.newsForm.addControl(
          'fileExtension',
          this.fb.control(this.fileExtension)
        );
        this.newsForm.get('fileExtension')?.setValue(this.fileExtension);
        this.newsForm.get('imageblob')?.setValue(this.selectedImageData);
      }
      this.api.post('news', this.newsForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAINSERTMESSAGE,
              environment.DATAINSERTTITLEMESSAGE
            );
            this.resetForm();
            this.hideLoader();
          } else {
            this.toasterService.error(response.error, '');
            this.hideLoader();
          }
          this.newsService.announceNewsAdded();
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
      this.newsForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.newsForm.valid) {
      this.cdr.detectChanges();
      this.showLoader();
      if (this.selectedImageData != '') {
        this.newsForm.addControl(
          'imageblob',
          this.fb.control(this.selectedImageData)
        );

        this.newsForm.addControl(
          'fileExtension',
          this.fb.control(this.fileExtension)
        );
        this.newsForm.get('fileExtension')?.setValue(this.fileExtension);
        this.newsForm.get('imageblob')?.setValue(this.selectedImageData);
      }
      this.api.update('news', this.newsForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.closeModal();
            this.newsService.announceNewsAdded();
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

  resetForm() {
    this.newsForm.reset();
    this.newsForm.patchValue({
      status: 'Pending',
      service: '',
      region: '',
      port: '',
      operator: '',
      trade_route: '',
      from: '',
      to: '',
      files: '',
    });
    this.selectedImage = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Check if the selected file type is allowed
      if (this.isFileTypeAllowed(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const fileExtension = this.getFileExtension(event.target.value);
          const DocTypes = [
            '.bmp',
            '.txt',
            '.pdf',
            '.doc',
            '.docx',
            '.ppt',
            '.pptx',
            '.xls',
            '.xlsx',
          ];
          if (fileExtension) {
            if (DocTypes.includes(fileExtension)) {
              this.selectedImage = this.defaultImages[fileExtension];
              this.selectedImageData = reader.result;
              this.fileExtension = fileExtension;
            } else {
              this.selectedImage = reader.result;
              this.selectedImageData = reader.result;
              this.fileExtension = fileExtension;
            }
          }
        };
      } else {
        this.toasterService.error(
          'Unsupported file type. Please select a valid image or document file.',
          'Sorry'
        );
        this.newsForm.get('files')?.setValue(null);
      }
    }
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedTypes = [
      '.jpeg',
      '.jpg',
      '.png',
      '.gif',
      '.bmp',
      '.txt',
      '.pdf',
      '.doc',
      '.docx',
      '.ppt',
      '.pptx',
      '.xls',
      '.xlsx',
    ];
    const fileType = `.${file.name.split('.').pop()}`;
    return allowedTypes.includes(fileType.toLowerCase());
  }

  getFileExtension(fileName: string): string | null {
    const parts = fileName.split('.');
    if (parts.length > 1) {
      return `.${parts.pop()}`;
    }
    return null;
  }

  closeModal() {
    $('#myModal').modal('hide');
    setTimeout(() => {
      this.resetForm();
    }, 10);
  }

  onSearch() {
    if (this.newsSearchForm.valid) {
      const newsSearchdata = {
        service: JSON.stringify(this.newsSearchForm?.get('service')?.value),
        region: JSON.stringify(this.newsSearchForm?.get('region')?.value),
        port: JSON.stringify(this.newsSearchForm?.get('port')?.value),
        operator: JSON.stringify(this.newsSearchForm?.get('operator')?.value),
        trade_route: JSON.stringify(
          this.newsSearchForm?.get('trade_route')?.value
        ),
        from: this.newsSearchForm?.get('from')?.value,
        to: this.newsSearchForm?.get('to')?.value,
        search: 1,
      };
      this.newsService.announceNewsSearch(newsSearchdata);
    }
  }

  resetSearchForm() {
    this.newsSearchForm.patchValue({
      service: '',
      region: '',
      port: '',
      operator: '',
      trade_route: '',
      from: '',
      to: '',
    });
    this.newsService.announceNewsAdded();
    this.searchApply = false;
  }
}
