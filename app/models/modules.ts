export class Modules {
    id: number;
    mainmenuid: number;
    submenuname: string;
    modulename: string;
    dateadded: string;
    isactive: boolean;
    modifiedby: string;
    reason: string;
    modulestatus: string;
    addedby: string;

    constructor()
    {
        this.id = 0;
        this.mainmenuid = 0;
        this.submenuname = "";
        this.modulename = "";
        this.dateadded = "";
        this.isactive = false;
        this.modifiedby = "";
        this.reason = "";
        this.modulestatus= "";
        this.addedby = "";

    }
    
}
