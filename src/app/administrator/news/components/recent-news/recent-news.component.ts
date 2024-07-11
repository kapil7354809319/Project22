import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-news',
  templateUrl: './recent-news.component.html',
  styleUrls: ['./recent-news.component.scss']
})
export class RecentNewsComponent {
  @Input() recentNewsData: any;

}
