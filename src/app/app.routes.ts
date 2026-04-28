import { Routes } from '@angular/router';
import { AuthGuard } from './components/interceptos/auth.guard';
import { AppMainViewComponent } from './components/view/app.main.view/app.main.view.component';
import { LoginComponent } from './components/view/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', canActivate: [AuthGuard], component: AppMainViewComponent },
    { path: 'login',  component: LoginComponent }
]