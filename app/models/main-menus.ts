export class MainMenus {

    id: number;
    modulename: string;
    dateadded: string;
    addedby: string;
    isactive: boolean;
    modifiedby: string;
    reason: string;
    menupath: string;
    isactivereference: string;

    constructor() {
        this.id = null;
        this.modulename = null;
        this.dateadded = null;
        this.addedby = null;
        // this.isactive = null;
        this.isactivereference = null;
        this.modifiedby = null;
        this.reason = null;
        this.menupath = null;
    }
}
