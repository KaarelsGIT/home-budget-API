import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgForOf,
    RouterLink
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
