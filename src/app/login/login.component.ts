import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { UserCookiesService } from '../services/user-cookies.service';
import { environment } from '../../environments/environment';
import { ToasterService } from '../services/toaster.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loginForm!: FormGroup;
  constructor(
    public api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public CookieService: UserCookiesService,
    private toasterService: ToasterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  get loading() {
    return this.loadingSubject.asObservable();
  }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.showLoader(); // Show loader before making the API call
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: async (response: any) => {
            if (response.status === true) {
              const applications = response.applications;
              if (applications && applications.length > 0) {
                const applicationNames = applications.map((app: any) => app.applicationname);
                if (applicationNames.includes(environment.applicationname)) {
                  const userRolename = applications.find((app: any) =>
                    app.applicationname === environment.applicationname).rolename;
                  try {
                    const respon: any = await this.api.post('login', {
                      username: this.loginForm.value.username,
                      password: this.loginForm.value.password,
                      display_name: response.user_details.first_name,
                    }).toPromise();
                    if (respon.status === true) {
                      const currentUserInfo = {
                        ...response.user_details,
                        userRolename: userRolename,
                        token: respon.data.token
                      };
                      await this.CookieService.setCookie('CurrentUser', currentUserInfo);
                      await this.router.navigate(['/administrator']);
                      this.toasterService.success(response.description, environment.LOGINTITLEMESSAGE);
                    } else {
                      this.handleError(environment.LoginError);
                    }
                  } catch (error:any) {
                    this.handleError(error);
                  }
                } else {
                  this.handleError(environment.NoAccessRCD);
                }
              } else {
                this.handleError(environment.NoAccessAPP);
              }
            } else {
              this.handleError(response.description);
            }
          },
          error: (error: any) => {
            this.handleError(error);
          }
        });
    }
  }
  
  private handleError(errorMessage: string) {
    this.toasterService.error(errorMessage, '');
    this.router.navigate(['/']);
    this.hideLoader();
  }
  
}
