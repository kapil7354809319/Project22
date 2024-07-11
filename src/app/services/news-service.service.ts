import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsServiceService {
  private newsAdded = new Subject<void>();
  newsAdded$ = this.newsAdded.asObservable();
  announceNewsAdded() {
    this.newsAdded.next();
  }

  private newsSearch = new Subject<void>();
  newsSearch$ = this.newsSearch.asObservable();
  announceNewsSearch(param: any) {
    this.newsSearch.next(param);
  }

  private newsModel = new Subject<void>();
  newsModel$ = this.newsModel.asObservable();
  announceNewsModel(id: any) {
    this.newsModel.next(id);
  }

}
