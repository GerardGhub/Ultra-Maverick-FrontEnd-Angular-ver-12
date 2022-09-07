export class LabtestApproval {
  lab_req_id:number;
  item_code:string;
  item_desc:number;
  category:string;
  item_description:string;
  qty_received:string;
  remaining_qty:string;

  days_to_expired:string;
  lab_status:string;
  historical:string;
  aging:string;
  remarks:string;

  fk_receiving_id:string;
  is_active:string;
  added_by:string;

  date_added:string;
  qa_approval_by:string;
  qa_approval_status:string;
  qa_approval_date:string;
  lab_result_released_by:string;

  lab_result_released_date:string;
  lab_result_remarks:string;
  lab_sub_remarks:string;
  lab_exp_date_extension:string;
  laboratory_procedure:string;

  lab_request_date:string;
  lab_result_received_by:string;
  lab_result_received_date:string;
  lab_request_by:string;
  is_received_status:string;
  po_number:number;
  pr_number:number;
  po_date:string;
  pr_date:string;

  lab_access_code:string;
  bbd: string;
  client_requestor: string;
  supplier: string;
  lab_approval_aging_days: string;
  qa_supervisor_is_approve_status:boolean;

  qa_supervisor_is_approve_by: string;
  qa_supervisor_is_approve_date: string;
  qa_supervisor_is_cancelled_status: string;
  qa_supervisor_is_cancelled_by: string;
  qa_supervisor_is_cancelled_date: string;
  qa_supervisor_cancelled_remarks: string;


  constructor () {
    this.lab_req_id = null;
    this.item_code = null;
    this.item_desc = null;
    this.category = null;
    this.item_description = null;
    this.qty_received = null;
    this.remaining_qty = null;

    this.days_to_expired = null;
    this.lab_status = null;
    this.historical = null;
    this.aging = null;
    this.remarks = null;

    this.fk_receiving_id = null;
    this.is_active = null;
    this.added_by = null;

    this.date_added = null;
    this.qa_approval_by = null;
    this.qa_approval_status = null;
    this.qa_approval_date = null;
    this.lab_result_released_by = null;

    this.lab_result_released_date = null;
    this.lab_result_remarks = null;
    this.lab_sub_remarks = null;
    this.lab_exp_date_extension = null;
    this.laboratory_procedure = null;

    this.lab_request_date = null;
    this.lab_result_received_by = null;
    this.lab_result_received_date = null;
    this.lab_request_by = null;
    this.is_received_status = null;
    this.po_number = null;
    this.pr_number = null;
    this.po_date = null;
    this.pr_date = null;

    this.lab_access_code = null;
    this.bbd = null;
    this.client_requestor = null;
    this.supplier = null;
    this.lab_approval_aging_days = null;
    this.qa_supervisor_is_approve_status = null;

    this.qa_supervisor_is_approve_by = null;
    this.qa_supervisor_is_approve_date = null;
    this.qa_supervisor_is_cancelled_status = null;
    this.qa_supervisor_is_cancelled_by = null;
    this.qa_supervisor_is_cancelled_date = null;
    this.qa_supervisor_cancelled_remarks = null;


  }
}
