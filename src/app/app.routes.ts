import { Routes } from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {IncomesComponent} from './components/pages/incomes/incomes.component';
import {ExpensesComponent} from './components/pages/expenses/expenses.component';
import {SettingsComponent} from './components/pages/settings/settings.component';
import {AboutComponent} from './components/pages/about/about.component';
import {CategoryManagerComponent} from './components/pages/category-manager/category-manager.component';
import {AuthGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'summary', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'incomes', component: IncomesComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'categories', component: CategoryManagerComponent },
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]
  },
  { path: 'about', component: AboutComponent }
];
