import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private notificationService: NotificationService, private authenticationService: AuthenticationService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }

  //Verification de l'authentification de l'utilisateur
  private isUserLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    //redirection vers la page d'authentification
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, `Simplon :joystick: vous devez etre connecté pour avoir acces a ce contenue`.toUpperCase());
    //send notification to user
    return false
  }
}
