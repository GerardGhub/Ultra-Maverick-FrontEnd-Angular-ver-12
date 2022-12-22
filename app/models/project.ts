import { ClientLocation } from "./client-location";


export class Project
{
    projectID: number;
    primaryID: number;
    is_return_in_qc: number;
    projectName: string;
    dateOfStart: string;
    teamSize: number;
    active: boolean;
    status: string;
    is_activated: string;
    supplier: string;
    item_code: string;
    item_description: string;
    po_number: string;
    po_date: string;
    pr_date: string;
    pr_number: string;
    qty_order: string;
    qty_uom: string;
    mfg_date: string;
    expiration_date: string;
    expected_delivery: string;
    actual_delivery: string;
    actual_remaining_receiving: number;
    received_by_QA: string;
    clientLocationID: number;
    clientLocation: ClientLocation;
    status_of_reject_one: string;
    status_of_reject_two: string;
    status_of_reject_three: string;
    count_of_reject_one: string;
    count_of_reject_two: string;
    count_of_reject_three: string;
    total_of_reject_mat: string;


    //Cancelled Reason transactional
    cancelled_date:Date;
    canceled_by:string;
    cancelled_reason:string;
    //Returnd Po
    returned_date:Date;
    returned_by:string;
    returned_reason:string;
    //QC Receiving Date
    qcReceivingDate:Date;
    //Expiry Days  Partial
    // daysBeforeExpired : number;
    days_expiry_setup : number;
    is_expired : string;
    //Approval
    is_approved_XP : string;
    is_approved_by : string;
    is_approved_date : Date;
    //RM Left Join
    item_class : string;
    item_type : string;
    major_category : string;
    sub_category : string;
    is_expirable : string;
    //Rejection Approval of QCV Supervisor
    is_wh_reject_approval : string;
    is_wh_reject_approval_by : string;
    is_wh_reject_approval_date : Date;
    //Rejection
    is_wh_reject : string;
    unit_price  : string;

// expiration_date_string : Date;
    constructor()
    {
        this.projectID = null;
        this.primaryID = null;
        this.projectName = null;
        this.dateOfStart = null;
        this.teamSize = null;
        this.active = true;
        this.status = null;
        this.is_activated = null;
        this.supplier = null;
        this.item_code = null;
        this.item_description = null;
        this.po_number = null;
        this.po_date = null;
        this.pr_number = null;
        this.pr_date = null;
        this.qty_order = null;
        this.qty_uom = null;
        this.mfg_date = null;
        this.expiration_date = null;
        this.expected_delivery = null;
        this.actual_delivery = null;
        this.actual_remaining_receiving = null;
        this.received_by_QA = null;
        this.clientLocationID = null;
        this.clientLocation = new ClientLocation();
        this.status_of_reject_one = null;
        this.status_of_reject_two = null;
        this.status_of_reject_three = null;
        this.count_of_reject_one = null;
        this.count_of_reject_two = null;
        this.count_of_reject_three = null;
        this.total_of_reject_mat = null;
        //Section 11
        //A
  
        //Cancelled
        this.cancelled_date  = null;
        this.canceled_by  = null;
        this.cancelled_reason = null;
        //Returned
        this.returned_date = null;
        this.returned_by = null;
        this.returned_reason = null;
        //Receiving Date
        this.qcReceivingDate = null;
        //Nearly Expiry
        // this.daysBeforeExpired = null;
        this.days_expiry_setup = null;
        this.is_expired = null;
        //Aproval
        this.is_approved_XP = null;
        this.is_approved_by = null;
        this.is_approved_date = null;
        //RM Left Join
        this.item_class = null;
        this.item_type = null;
        this.major_category = null;
        this.sub_category = null;
        this.is_expirable = null;
        //Rejection Approval of QCV Supervisor
        this.is_wh_reject_approval = "";
        this.is_wh_reject_approval_by = "";
        this.is_wh_reject_approval_date = null;
        //Addtitional reject
        this.is_wh_reject = "";

        this.unit_price = "";

    }
}
