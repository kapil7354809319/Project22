import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './news-routing.module';
import { NewsFormComponent } from './components/news-form/news-form.component';
import { NewsListingsComponent } from './components/news-listings/news-listings.component';
import { NewsDetailsComponent } from './components/news-details/news-details.component';
import { RecentNewsComponent } from './components/recent-news/recent-news.component';
import { NewsBaseComponent } from './components/news-base/news-base.component';
import { NgxEditorModule } from 'ngx-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    NewsBaseComponent,
    NewsFormComponent,
    NewsListingsComponent,
    NewsDetailsComponent,
    RecentNewsComponent,
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    NgxEditorModule,
    NgMultiSelectDropDownModule.forRoot(),
    SharedModule
  ]
})
export class NewsModule { }
