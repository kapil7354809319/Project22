import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.scss'],
})
export class NewsDetailsComponent {
  newsId!: number;
  newsData: any;
  servicesArray: any;
  operatorArray: any;
  tradesArray: any;
  portsArray: any;
  regionsArray: any;
  latestNews: any;
  imageBasePath: any;
  fileImage!: string;
  defaultImages: { [key: string]: string } = {
    bmp: 'assets/images/default/bmp.png',
    txt: 'assets/images/default/txt.png',
    pdf: 'assets/images/default/pdf.png',
    doc: 'assets/images/default/doc.png',
    docx: 'assets/images/default/docx.png',
    ppt: 'assets/images/default/ppt.png',
    pptx: 'assets/images/default/pptx.png',
    xls: 'assets/images/default/xls.png',
    xlsx: 'assets/images/default/xlsx.png',
  };
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    private http: HttpClient
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

  ngOnInit() {
    this.showLoader();
    this.imageBasePath = environment.ImageBasePath;
    this.route.params.subscribe((params: Params) => {
      this.newsId = +params['id'];
      this.api.get('get-details-news/' + this.newsId).subscribe({
        next: (response: any) => {
          this.newsData = response.data;
          this.latestNews = response.latest;
          var filePath = this.newsData[0].image;
          if (filePath != '') {
            var splitValues = filePath.split('.');
            var fileExtension = splitValues[splitValues.length - 1];
            const DocTypes = [
              'bmp',
              'txt',
              'pdf',
              'doc',
              'docx',
              'ppt',
              'pptx',
              'xls',
              'xlsx',
            ];
            if (fileExtension) {
              if (DocTypes.includes(fileExtension)) {
                this.fileImage = this.defaultImages[fileExtension];
              }
            }
          }
          this.hideLoader();
          if (this.newsData[0].services == '') {
            this.servicesArray = [];
          } else {
            this.servicesArray = this.newsData[0].services.split(',');
          }
          if (this.newsData[0].operator == '') {
            this.operatorArray = [];
          } else {
            this.operatorArray = this.newsData[0].operators.split(',');
          }
          if (this.newsData[0].trades == '') {
            this.tradesArray = [];
          } else {
            this.tradesArray = this.newsData[0].trades.split(',');
          }
          if (this.newsData[0].ports == '') {
            this.portsArray = [];
          } else {
            this.portsArray = this.newsData[0].ports.split(',');
          }
          if (this.newsData[0].regions == '') {
            this.regionsArray = [];
          } else {
            this.regionsArray = this.newsData[0].regions.split(',');
          }
        },
        error: (error: any) => {
          this.hideLoader();
        },
        complete: () => {},
      });
    });
  }

  downloadFile(path: string) {
    const fileUrl = environment.ImageBasePath + '' + path;
    const fileName = this.getFileNameFromUrl(fileUrl);

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl); // Clean up the blob URL
      })
      .catch((error) => console.error('Error fetching file:', error));
  }

  private getFileNameFromUrl(url: string): string {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart;
  }
}
