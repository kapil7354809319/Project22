import { Component, Renderer2 } from '@angular/core';
import { UserCookiesService } from '../../services/user-cookies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  searchBox!: FormGroup;

  constructor(private renderer: Renderer2, public userCookies: UserCookiesService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.searchBox = this.fb.group({
      searching: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.loadScript();
  }

  search() {
    if (this.searchBox.valid) {
      this.router.navigate(['/administrator/service'], { queryParams: { service: this.searchBox.get('searching')?.value } });
    }
  }

  loadScript() {
    const script2 = this.renderer.createElement('script');
    this.renderer.setAttribute(script2, 'src', 'https://code.highcharts.com/highcharts.js');
    this.renderer.appendChild(document.head, script2);

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', 'assets/js/main.js');
    this.renderer.appendChild(document.head, script);
  }

  removeScript() {
    const scriptToRemove = document.querySelector('script[src="assets/js/main.js"]');
    if (scriptToRemove) {
      this.renderer.removeChild(document.head, scriptToRemove);
    }
    const scriptToRemove1 = document.querySelector('script[src="https://code.highcharts.com/highcharts.js"]');
    if (scriptToRemove) {
      this.renderer.removeChild(document.head, scriptToRemove1);
    }
  }

  ngOnDestroy() {
    this.removeScript();
  }

}
