import { Component } from '@angular/core';

@Component({
  selector: 'app-port-report',
  templateUrl: './port-report.component.html',
  styleUrls: ['./port-report.component.scss']
})
export class PortReportComponent {

  showContent: boolean = false;

  toggleContent() {
    this.showContent = !this.showContent;
  }


}
