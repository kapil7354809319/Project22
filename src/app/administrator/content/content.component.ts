import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToasterService } from '../../services/toaster.service';
import { Editor } from 'ngx-editor';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NewsServiceService } from '../../services/news-service.service';
import { BehaviorSubject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {
  @Output() loaderEvent = new EventEmitter<boolean>();
  contentHomeForm!: FormGroup;
  methodologyForm!: FormGroup;
  analystForm!: FormGroup;
  editor!: Editor;
  editor0!: Editor;
  editor1!: Editor;
  editor2!: Editor;
  editor3!: Editor;
  editor4!: Editor;
  editor5!: Editor;
  editor6!: Editor;
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
  selectedImage!: string | ArrayBuffer | null;
  selectedImageShow!: string | ArrayBuffer | null;
  defaultImages: { [key: string]: string } = {
    '.bmp': 'assets/images/default/bmp.png',
    '.txt': 'assets/images/default/pdf.png',
    '.pdf': 'assets/images/default/pdf.png',
    '.doc': 'assets/images/default/doc.png',
    '.docx': 'assets/images/default/docx.png',
    '.ppt': 'assets/images/default/ppt.png',
    '.pptx': 'assets/images/default/pptx.png',
    '.xls': 'assets/images/default/xls.png',
    '.xlsx': 'assets/images/default/xlsx.png',
  };
  contentList: any;
  imageBasePath!: string;

  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private toasterService: ToasterService,
    private newsService: NewsServiceService
  ) {}

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
    this.imageBasePath = environment.ImageBasePath;
    this.editor = new Editor();
    this.editor0 = new Editor();
    this.editor1 = new Editor();
    this.editor2 = new Editor();
    this.editor3 = new Editor();
    this.editor4 = new Editor();
    this.editor5 = new Editor();
    this.editor6 = new Editor();

    this.contentHomeForm = this.fb.group({
      home_description: [''],
      image: [''],
    });
    this.methodologyForm = this.fb.group({
      methodology_description: [''],
      files: [''],
    });
    this.analystForm = this.fb.group({
      analyst_name: [''],
      analyst_text: [''],
      research_analyst_designation: [''],
      research_analyst_text: [''],
      analyst_designation: [''],
      research_analyst_name: [''],
      files: [''],
    });
    this.loadData();
  }

  loadData() {
    this.showLoader();
    this.api.get('get-content-home').subscribe({
      next: (response: any) => {
        this.contentList = response.data;
        this.hideLoader();
      },
      error: (error: any) => {
        this.hideLoader();
      },
      complete: () => {},
    });
  }

  onSubmit() {}

  onUpdateHome() {
    if (this.contentHomeForm.valid) {
      this.showLoader();
      if (this.selectedImage != '') {
        this.contentHomeForm.addControl(
          'imageblob',
          this.fb.control(this.selectedImage)
        );
        this.contentHomeForm.get('imageblob')?.setValue(this.selectedImage);
      }
      this.api.update('content-home', this.contentHomeForm.value).subscribe({
        next: (response: any) => {
          if (response.status === true) {
            this.toasterService.success(
              environment.DATAUPDATEMESSAGE,
              environment.DATAUPDATETITLEMESSAGE
            );
            this.loadData();
            this.hideLoader();
            this.resetHomeForm();
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

  resetHomeForm() {
    this.contentHomeForm.get('image')?.reset();
    this.contentHomeForm.get('imageblob')?.reset();
    this.selectedImage = '';
  }

  onUpdateMethodology() {
    if (this.methodologyForm.valid) {
      this.showLoader();
      if (this.selectedImageShow != '') {
        this.methodologyForm.addControl(
          'imageblob',
          this.fb.control(this.selectedImageShow)
        );
        this.methodologyForm.get('imageblob')?.setValue(this.selectedImageShow);
      }
      this.api
        .update('content-methodology', this.methodologyForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.status === true) {
              this.toasterService.success(
                environment.DATAUPDATEMESSAGE,
                environment.DATAUPDATETITLEMESSAGE
              );
              this.loadData();
              this.hideLoader();
              this.resetMethodologyForm();
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

  resetMethodologyForm() {
    this.contentHomeForm.get('files')?.reset();
    this.contentHomeForm.get('imageblob')?.reset();
    this.selectedImageShow = '';
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileTypeAllowed(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedImageShow = reader.result;
        };
      } else {
        this.toasterService.error(
          'Unsupported file type. Please select a valid image file.',
          'Sorry'
        );
        this.methodologyForm.get('files')?.setValue(null);
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (this.isFileTypeAllowed(file)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.selectedImage = reader.result;
        };
      } else {
        this.toasterService.error(
          'Unsupported file type. Please select a valid image file.',
          'Sorry'
        );
        this.contentHomeForm.get('image')?.setValue(null);
      }
    }
  }

  isFileTypeAllowed(file: File): boolean {
    const allowedTypes = ['.jpeg', '.jpg', '.png', '.gif'];
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
}
