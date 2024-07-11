import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DataLoaderComponent } from '../administrator/data-loader/data-loader.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidebarComponent, FooterComponent, DataLoaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    DatePipe,
  ],
  exports: [SidebarComponent, ReactiveFormsModule, FormsModule, FooterComponent, ButtonModule, MatDialogModule, MatNativeDateModule, MatDatepickerModule, MatInputModule, DataLoaderComponent]
})
export class SharedModule { }
