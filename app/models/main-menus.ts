export class MainMenus {

    id: number;
    mainmodulename: string;
    dateadded: string;
    addedby: string;
    isactive: boolean;
    modifiedby: string;
    reason: string;
    menupath: string;
    isactivereference: string;

    constructor() {
        this.id = 0;
        this.mainmodulename = "";
        this.dateadded = "";
        this.addedby = "";
        // this.isactive = null;
        this.isactivereference = "";
        this.modifiedby = "";
        this.reason = "";
        this.menupath = "";
    }
}
