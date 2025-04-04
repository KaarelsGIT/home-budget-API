import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { label: 'Users', path: '/settings/users' },
    { label: 'Categories', path: '/settings/categories' },
    { label: 'Preferences', path: '/settings/preferences' },
    { label: 'Notifications', path: '/settings/notifications' }
  ];
}
