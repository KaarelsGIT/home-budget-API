import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {UserDropdownComponent} from '../components/user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    UserDropdownComponent
  ],
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css'
})
export class HeaderComponent {

}
