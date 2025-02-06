import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {IncomesComponent} from './pages/incomes/incomes.component';
import {ExpensesComponent} from './pages/expenses/expenses.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {AboutComponent} from './pages/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'summary', component: DashboardComponent },
  { path: 'incomes', component: IncomesComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent }
];
