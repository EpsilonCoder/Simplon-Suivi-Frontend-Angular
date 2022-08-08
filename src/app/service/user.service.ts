import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';
import { CustomHttpResponse } from '../model/custom-http-response';
import { Promo } from '../model/promo';
import { Annonce } from '../model/annonce';
import { entreprise } from '../model/entreprise';


@Injectable({ providedIn: 'root' })
export class UserService {
  public host = environment.apiUrl;

  constructor(public http: HttpClient) { }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/list`);
  }

  public getUsersAlafabrique(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/Alafabrique`);
  }

  public getUsersEnEntreprise(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/user/EnEntreprise`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/user/update`, formData);
  }

  public resetPassword(email: string): Observable<CustomHttpResponse> {
    return this.http.get<CustomHttpResponse>(`${this.host}/user/reset-password/${email}`);
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> {
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData,
      {
        reportProgress: true,
        observe: 'events'
      });
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsersFromLocalCache(): User[] | null {
    return localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')!) : null;
  }

  createUserFromData(loggedInUsername: string, user: User, profileImage: File): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('telephone', user.telephone);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNotLocked', JSON.stringify(user.isNotLocked));
    formData.append('situations', JSON.stringify(user.situations));
    formData.append('entretien', JSON.stringify(user.entretien));
    return formData;
  }


  /**
   * Service pour la  gestion des promotions
   * 
   * **/


  public addPromo(formData: FormData): Observable<Promo> {
    return this.http.post<any>(`${this.host}/promoes`, formData);
  }
  public getPromo(): Observable<Promo[]> {
    return this.http.get<Promo[]>(`${this.host}/promoes`);
  }

  public updatePromo(formData: FormData): Observable<Promo> {
    return this.http.post<any>(`${this.host}/promoes`, formData);
  }

  public deletePromo(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/promoes/${id}`);
  }

  createPromoFromData(id: number, promo: Promo): FormData {
    const formData = new FormData();
    formData.append('id', promo.id);
    formData.append('libelle', promo.libelle);
    return formData;
  }

  /**
  * Service pour la  gestion des annonces 
  * **/
  public addAnnonce(formData: FormData): Observable<Annonce> {
    return this.http.post<any>(`${this.host}/annonces`, formData);
  }

  public getAnnonce(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.host}/annonces`);
  }

  public updateAnnonce(formData: FormData): Observable<Annonce> {
    return this.http.post<any>(`${this.host}/annonces`, formData);
  }

  public deleteAnnonce(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/annonces/${id}`);
  }

  createAnnonceFromData(id: number, annonce: Annonce): FormData {
    const formData = new FormData();
    formData.append('id', annonce.id);
    formData.append('description', annonce.description);
    formData.append('libelle', annonce.libelle);
    formData.append('lien', annonce.lien);
    formData.append('cible', annonce.cible);
    return formData;
  }

  /** 
  * Service pour la  gestion des entreprises
  **/
  public addentreprise(formData: FormData): Observable<entreprise> {
    return this.http.post<any>(`${this.host}/entrepriseAcceuils`, formData);
  }

  public getEntreprise(): Observable<entreprise[]> {
    return this.http.get<entreprise[]>(`${this.host}/entrepriseAcceuils`);
  }

  public updateEntreprise(formData: FormData): Observable<entreprise> {
    return this.http.post<any>(`${this.host}/entrepriseAcceuils`, formData);
  }

  public deleteEntreprise(id: number): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/entrepriseAcceuils/${id}`);
  }

  createEntrepriseFromData(id: number, entreprise: entreprise): FormData {
    const formData = new FormData();
    formData.append('id', entreprise.id);
    formData.append('raisonSocial', entreprise.raisonSocial);
    formData.append('nomPersonneContat', entreprise.nomPersonneContat);
    formData.append('prenomPersonneContact', entreprise.prenomPersonneContact);
    formData.append('telephone', entreprise.telephone);
    return formData;
  }


}
