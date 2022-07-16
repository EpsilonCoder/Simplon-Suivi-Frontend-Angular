import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NotificationType } from '../enum/notification-type.enum';
import { Promo } from '../model/promo';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
  private subcriptions: Subscription[] = [];
  public promo: any;

  constructor(private router: Router, public userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getPromo(true);
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }
  public getPromo(showNotification: boolean): void {
    this.userService.getPromo()
      .subscribe
      ((data: Promo[]) => {
        this.promo = data;
        Swal.fire(
          'Promotion!',
          'Liste des promotions chargés avec succes!',
          'success'
        )
      }, err => {
        this.sendNotification(NotificationType.ERROR, `Une erreur c est produit lors de l ajout de votre promotion`);
      })
  }


  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  saveNewPromo() {
    this.clickButton('new-promo-save');
  }

  public onAddNewPromo(promoForm: NgForm): void {
    const formData = this.userService.createPromoFromData(promoForm.value);
    this.subcriptions.push(
      this.userService.addPromo(formData).subscribe(
        (response: Promo) => {
          console.log(promoForm.value);
          this.clickButton('new-user-close');
          this.getPromo(false);

          promoForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.libelle} a été ajouté avec succes`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);

        }
      )
    );
  }

}
