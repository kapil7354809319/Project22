import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-news-base',
  templateUrl: './news-base.component.html',
  styleUrls: ['./news-base.component.css']
})
export class NewsBaseComponent implements OnInit {
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

  constructor() { }
  ngOnInit() {
    // this.showLoader();
  }


  onLoaderEvent(event: boolean) {
    if (event) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

}
