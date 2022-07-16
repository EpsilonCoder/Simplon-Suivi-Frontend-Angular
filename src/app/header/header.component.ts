import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SubSink } from 'subsink';
import { Role } from '../enum/role.enum';

import { FileuploadStatus } from '../model/file-upload.status';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private subs = new SubSink();
  private titleSubject = new BehaviorSubject<string>('Profile');
  public titleAction$ = this.titleSubject.asObservable();

  public users!: User[];
  public refreshing: boolean | undefined;
  selectedUser: User | undefined;
  fileName: string | undefined;
  public profileImage!: File | any;
  public editUser = new User();
  public fileStatus = new FileuploadStatus();
  user: any;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }

    this.user = this.authenticationService.getUserFromLocalCache();

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
