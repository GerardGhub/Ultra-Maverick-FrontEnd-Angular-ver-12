export class AspNetRoles {

    Id:string;
    name:string;
    normalizedname:string;
    concurrencystamp:string;
    discriminator:string;
    isactive:string;

    constructor()
    {
        this.Id = "";
        this.name = "";
        this.normalizedname = "";
        this.concurrencystamp = "";
        this.discriminator = "";
        this.isactive ="";
    }
}
