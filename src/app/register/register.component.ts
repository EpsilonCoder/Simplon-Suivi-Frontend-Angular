import { User } from '../model/user';
import { NotificationType } from '../enum/notification-type.enum';

import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../service/notification.service';
import { AuthenticationService } from '../service/authentication.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Promo } from '../model/promo';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  showLoading: boolean | undefined;
  private subscriptions: Subscription[] = [];
  promo!: Promo[];

  constructor(private router: Router,public userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }

    this.getPromo(true);
  }

  public onRegister(user: User, form: NgForm): void {
    console.log(user);
    this.showLoading = true;
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.showLoading = false;
          this.sendNotification(NotificationType.SUCCESS, `Un nouveau compte vient d'etre créer pour ${response.firstName}.
                                      Veuillez consulter votre Email pour récuperer votre mot de passe d'acces`);
          console.log(response);
          form.reset();

          this.router.navigateByUrl('/login');
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.showLoading = false;
          form.reset();
        }
      )
    );
  }

  public getPromo(showNotification: boolean): void {
    this.userService.getPromo()
      .subscribe
      ((data: Promo[]) => {
        this.promo = data;
      }, err => {
        // this.sendNotification(NotificationType.ERROR, `Une erreur c est produit lors de l ajout de votre promotion`);
      })
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
