import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsBaseComponent } from './components/news-base/news-base.component';
import { NewsDetailsComponent } from './components/news-details/news-details.component';

const routes: Routes = [
  {
    path: '',
    component: NewsBaseComponent,
  },
  {
    path: 'news-detail/:id',
    component: NewsDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
