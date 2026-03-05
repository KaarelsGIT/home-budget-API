import { Component } from '@angular/core';
import {SidebarComponent} from '../../../layout/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
