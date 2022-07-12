import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnonceComponent } from './annonce/annonce.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { PromotionComponent } from './promotion/promotion.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] },
  { path: 'annonce', component: AnnonceComponent, canActivate: [AuthenticationGuard] },
  { path: 'entreprise', component: EntrepriseComponent, canActivate: [AuthenticationGuard] },
  { path: 'promotion', component: PromotionComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
