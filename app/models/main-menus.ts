export class MainMenus {

    id: number;
    modulename: string;
    dateadded: string;
    addedby: string;
    isactive: boolean;
    modifiedby: string;
    reason: string;
    menupath: string;


    constructor() {
        this.id = 0;
        this.modulename = "";
        this.dateadded = "";
        this.addedby = "";
        this.isactive = false;
        this.modifiedby = "";
        this.reason = "";
        this.menupath = "";
    }
}
