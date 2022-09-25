export class Entreprise {
    public id: any;
    public raisonSocial: string;
    public nomPersonneContat: string;
    public prenomPersonneContact: string;
    public telephone: string;
    public email: string;
    constructor() {
        this.id = '',
            this.raisonSocial = '',
            this.nomPersonneContat = '',
            this.prenomPersonneContact = '',
            this.telephone = '';
        this.email = '';
    }

}
