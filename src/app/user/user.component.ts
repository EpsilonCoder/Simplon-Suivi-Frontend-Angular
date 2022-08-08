import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as Chart from 'chart.js';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { NotificationType } from '../enum/notification-type.enum';
import { Role } from '../enum/role.enum';
import { CustomHttpResponse } from '../model/custom-http-response';
import { FileuploadStatus } from '../model/file-upload.status';
import { Promo } from '../model/promo';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Profile');
  public titleAction$ = this.titleSubject.asObservable();
  public users!: User[];
  public refreshing: boolean | undefined;
  private subcriptions: Subscription[] = [];
  selectedUser: User | any;
  fileName: string | undefined;
  public profileImage!: File | any;
  public editUser = new User();
  private currentUsername!: string;
  public fileStatus = new FileuploadStatus();
  user: any;
  fabrique: any;
  eps!: User[];
  promo: any;
  constructor(private router: Router, private userService: UserService, private authenticationService: AuthenticationService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
    this.user = this.authenticationService.getUserFromLocalCache();

    var p = this.userService.getUsersAlafabrique().subscribe(
      data => {
        this.fabrique = data
        console.log(this.fabrique[0])
        var myChart = new Chart("myChart", {
          type: 'doughnut',
          data: {
            labels: ['Apprenant a la fabrique', 'Apprenant en entreprise', 'Compte Active', 'Compte bloqué'],
            datasets: [{
              label: 'Statistique de l application',
              data: [this.fabrique[1], this.fabrique[0], this.fabrique[2], (this.fabrique[0] + this.fabrique[1]) - this.fabrique[2]],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)'
              ]
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart = new Chart("myChart1", {
          type: 'polarArea',
          data: {
            labels: ['Apprenant a la fabrique', 'Apprenant en entreprise', 'Compte Active', 'Compte bloqué'],
            datasets: [{
              label: 'Statistique de l application',
              data: [this.fabrique[1], this.fabrique[0], this.fabrique[2], (this.fabrique[0] + this.fabrique[1]) - this.fabrique[2]],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)'
              ]
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        var myChart = new Chart("myChart2", {
          type: 'bar',
          data: {
            labels: ['Apprenant a la fabrique', 'Apprenant en entreprise', 'Compte Active', 'Compte bloqué'],
            datasets: [{
              label: 'Statistique de l application',
              data: [this.fabrique[1], this.fabrique[0], this.fabrique[2], (this.fabrique[0] + this.fabrique[1]) - this.fabrique[2]],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)'
              ]
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      }
    );





    this.getUsers(true);

  }

  public changeTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getUsers(showNotification: boolean): void {
    this.refreshing = true;
    this.subcriptions.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.addUsersToLocalCache(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} utilisateurs chargés avec Succes`);
          }
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
        }
      )
    )
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

  //fonction permettant d'avoir les details de l'utilisateurs selectionée.

  public onSelectUser(selectedUser: User): void {

    this.selectedUser = selectedUser;

  }


  onProfileImageChange(event: Event): void {
    const target = (event.target as HTMLInputElement);
    this.fileName = target.files![0].name;
    this.profileImage = target.files![0];
  }


  saveNewUser() {
    this.clickButton('new-user-save');
  }

  public onAddNewUser(userForm: NgForm): void {
    const formData = this.userService.createUserFromData("", userForm.value, this.profileImage);
    this.subcriptions.push(
      this.userService.addUser(formData).subscribe(
        (response: User) => {
          console.log(userForm.value);
          this.clickButton('new-user-close');
          this.getUsers(false);
          this.fileName = '';
          this.profileImage = null;
          userForm.reset();
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} a été ajouté avec succes`);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
  }




  clickButton(buttonId: string): void {
    document.getElementById(buttonId)?.click();
  }

  public searchUsers(searchTerm: string): void {
    console.log(searchTerm);
    const results: User[] = [];
    for (const user of this.userService.getUsersFromLocalCache() || []) {
      if (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        // user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.telephone.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
        user.userId.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        results.push(user);
      }
    }
    this.users = results;
    if (results.length == 0 || !searchTerm) {
      this.users = this.userService.getUsersFromLocalCache() || [];

    }
  }

  public onEditUser(editUser: User): void {
    this.editUser = editUser;
    this.currentUsername = this.editUser.username;
    this.clickButton('openUserEdit');


  }

  public onUpdateUser(): void {
    const formData = this.userService.createUserFromData(this.currentUsername, this.editUser, this.profileImage);
    this.subcriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.clickButton('closeEditUserModalButton');
          this.getUsers(false);
          this.fileName = '';
          this.profileImage = null;
          this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} La mise a jour a été effectué avec succés`);
          this.router.navigateByUrl('/')
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.profileImage = null;
        }
      )
    );
  }

  public async onDeleteUser(username: User): Promise<void> {

    this.subcriptions.push(
      this.userService.deleteUser(username.username).subscribe(
        (response: CustomHttpResponse) => {
          Swal.fire({
            title: 'Etes vous sure?',
            text: "Voulez vous  vraiment supprimer cet utilisateur!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OUI, supprimer!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Supprimé!',
                'Cet utilisateur a été supprimé avec succes',
                'success'
              )
            }
          });
          this.router.navigateByUrl('/user/management')
          //this.sendNotification(NotificationType.SUCCESS, "L'utilisateur a bien été supprimée");
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, error.error.message);
        }
      )
    );
  }



  public onResetPassword(emailForm: NgForm): void {

    this.refreshing = true;
    const emailAddress = emailForm.value['reset-password-email'];
    this.subcriptions.push(

      this.userService.resetPassword(emailAddress).subscribe(
        (response: CustomHttpResponse) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Le mot de passe de l utilisateur a bien été mis a jour",
            showConfirmButton: false,
            timer: 3000
          });
          this.refreshing = false;
          emailForm.resetForm();
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotificationType.INFO, error.error.message);
          emailForm.resetForm();
          this.refreshing = true;
        },

      )
    )
  }
  onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: "A plutard !! Merci d'avoir été sur Simplon Suivi",
      showConfirmButton: false,
      timer: 4000
    });
    // this.sendNotification(NotificationType.SUCCESS, `A plutard !! Merci d'avoir été sur Simplon Suivi`);
  }

  public onUpdateCurrentUser(user: User): void {
    this.refreshing = true;
    this.currentUsername = this.authenticationService.getUserFromLocalCache().username;
    const formData: FormData = this.userService.createUserFromData(this.currentUsername, user, this.profileImage!);
    this.subcriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToLocalCache(response);
          this.getUsers(false);
          this.fileName = '';
          this.profileImage = null;
          Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: `${response.firstName} ${response.lastName} La mise a jour a été effectué avec succés `,
            showConfirmButton: false,
            timer: 4000
          });
          //this.sendNotification(NotificationType.SUCCESS, `${response.firstName} ${response.lastName} La mise a jour a été effectué avec succés `);
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
          this.profileImage = null;
        }
      )
    );

  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage!);
    const updateProfileImageSubscription = this.userService.updateProfileImage(formData)
      .subscribe({
        next: (event: HttpEvent<any>) => {
          this.reportUploadProgress(event);
        },
        error: (err: HttpErrorResponse) => {
          this.sendNotification(NotificationType.ERROR, err.error.message);
          this.fileStatus.status = 'done';
        }
      });

    this.subcriptions.push(updateProfileImageSubscription);
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(event.loaded / event.total! * 100);
        this.fileStatus.status = 'chargement';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          console.log('User: ', event.body);
          //pour le changement automatique de l image sans recharger la pge
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.sendNotification(NotificationType.SUCCESS, `${event.body.firstName} votre photo de profile a bien été mis a jour`);
          this.fileStatus.status = 'Terminé';
        } else {
          this.sendNotification(NotificationType.ERROR, `Impossible de charger l 'image , veuillez réessayer s'il vous plait`);
        }
        break;
      default:
        console.log(`Terminé`);
        break;
    }
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


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }


}
