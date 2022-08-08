import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { Annonce } from '../model/annonce';
import { CustomHttpResponse } from '../model/custom-http-response';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-annonce',
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})
export class AnnonceComponent implements OnInit {
  annonce: any;
  subcriptions: any;

  constructor(private router: Router, public userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAnnonce(true);
  }

  private getUserRole(): string {
    return this.authenticationService.getUserFromLocalCache().role;
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN || this.getUserRole() === Role.SUPER_ADMIN;
  }

  public get isManager(): boolean {
    return this.isAdmin || this.getUserRole() === Role.MANAGER;
  }

  public get isAdminOrManager(): boolean {
    return this.isAdmin || this.isManager;
  }


  public getAnnonce(showNotification: boolean): void {
    this.userService.getAnnonce()
      .subscribe
      ((data: Annonce[]) => {
        this.annonce = data;
      }, err => {
        this.sendNotification(NotificationType.ERROR, `Une erreur c est produit lors de l ajout de votre promotion`);
      })
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'Une erreur c est produit veuillez réessayer , s il vou plait');
    }
  }

  public onAddNewAnnonce(data: any) {
    console.warn(data)
    this.userService.addAnnonce(data).subscribe((result: any) => {
      console.warn(result);
      this.clickButton('closePromoModalButton');
      this.getAnnonce(true)
      Swal.fire(
        'Nouvelle Annonce',
        'L annonce vient d etre partagé aux apprenants',
        'success'
      )
    },
      (error: HttpErrorResponse) => {
        Swal.fire(
          'Attention',
          'Quelque chose s est mal passé',
          'error'
        )
      })
  }

  saveNewAnnonce() {
    this.clickButton('new-promo-save');
  }

  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  public async onDeleteAnnonce(id: Annonce): Promise<void> {


    this.userService.deleteAnnonce(id.id).subscribe(
      (response: CustomHttpResponse) => {
        Swal.fire(
          'Supprimé!',
          'Cet utilisateur a été supprimé avec succes',
          'success'
        )
        this.sendNotification(NotificationType.SUCCESS, "La promotion a bien été supprimée");
        this.getAnnonce(true);
      },
      (error: HttpErrorResponse) => {
        this.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )

  }
}


