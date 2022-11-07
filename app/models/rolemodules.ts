export class RoleModules {

    id:number;
    roleid:string;
    moduleid:number;
    isactive: boolean;
    submenuname:string;
    modulename: string;
    mainmodulename: string;
    isparent: string;

    constructor()
    {
        this.id = 0;
        this.roleid = "";
        this.moduleid = 0;
        this.isactive = false;
        this.submenuname = "";
        this.modulename = "";
        this.mainmodulename = "";
        this.isparent = "";
    }
}
