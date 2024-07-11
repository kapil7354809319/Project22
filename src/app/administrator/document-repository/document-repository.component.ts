import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
declare var $: any;

@Component({
  selector: 'app-document-repository',
  templateUrl: './document-repository.component.html',
  styleUrls: ['./document-repository.component.scss']
})
export class DocumentRepositoryComponent {
  documentRepForm !: FormGroup;
  constructor(public cdr: ChangeDetectorRef, public dialog: MatDialog, private fb: FormBuilder, private router: Router, private api: ApiService, private toasterService: ToasterService) { }
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
    this.documentRepForm = this.fb.group({
      country_name: ['', [Validators.required]],
      routing: ['', Validators.required],
      id: [''],
    });
  }



  onSubmit() {

  }

  resetForm() {

  }


}
