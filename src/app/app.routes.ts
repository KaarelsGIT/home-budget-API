import { Routes } from '@angular/router';
import {HomeComponent} from './components/pages/home/home.component';
import {DashboardComponent} from './components/pages/dashboard/dashboard.component';
import {IncomesComponent} from './components/pages/incomes/incomes.component';
import {ExpensesComponent} from './components/pages/expenses/expenses.component';
import {SettingsComponent} from './components/pages/settings/settings.component';
import {AboutComponent} from './components/pages/about/about.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'summary', component: DashboardComponent },
  { path: 'incomes', component: IncomesComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent }
];
