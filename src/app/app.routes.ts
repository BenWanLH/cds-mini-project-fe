import { Routes } from '@angular/router';
import { AuthenticationGuard } from './guards/authentication.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RoomComponent } from './pages/room/room.component';


export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticationGuard],
    children: [{
      path: ":id",
      component: RoomComponent
    }
    ]
  },
  { path: 'room/:id', component: RoomComponent },
  { path: '**', redirectTo: '/login' }
];
