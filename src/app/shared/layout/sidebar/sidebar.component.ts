import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToasterService } from '../../../services/toaster.service';
import { UserCookiesService } from '../../../services/user-cookies.service';
import { environment } from '../../../../environments/environment';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  userrolename: any;
  Level1: string | undefined;
  Level2: string | undefined;
  username: any;
  isActive = false;
  currentDropdown: string | null = null;
  constructor(
    private renderer: Renderer2,
    private auth: AuthService,
    private sidebarService: SidebarService,
    public router: Router,
    private toasterService: ToasterService,
    public userCookies: UserCookiesService
  ) {}

  ngOnInit() {
    this.Level1 = environment.Level1; //define Level1 = Level 5
    this.Level2 = environment.Level2; //define Level2 = Level 2
    this.userrolename = this.userCookies.getCookie('CurrentUser').userRolename;
    this.username = this.userCookies.getCookie('CurrentUser').first_name;
    this.sidebarService.getCurrentDropdown().subscribe((dropdown) => {
      this.currentDropdown = dropdown;
    });
  }

  ngAfterViewInit(): void {
    this.loadScript();
  }

  toggleDropdown(dropdownId: string) {
    if (this.currentDropdown === dropdownId) {
      this.sidebarService.closeDropdown();
    } else {
      this.sidebarService.setCurrentDropdown(dropdownId);
    }
  }

  loadScript() {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', 'assets/js/sidebar.js');
    this.renderer.appendChild(document.head, script);
  }

  removeScript() {
    const scriptToRemove = document.querySelector(
      'script[src="assets/js/sidebar.js"]'
    );
    if (scriptToRemove) {
      this.renderer.removeChild(document.head, scriptToRemove);
    }
  }

  logoutUser() {
    this.userCookies.deleteCookieAll();
    this.router.navigateByUrl('login');
    this.toasterService.info(
      environment.LOGOUTMESSAGE,
      environment.LOGOUTTITLEMESSAGE
    );
  }

  ngOnDestroy() {
    this.removeScript();
  }
}
