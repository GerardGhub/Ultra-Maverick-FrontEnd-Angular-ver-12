export class ForLabtest {

  id:number;
  lab_access_code:string;
  index_id_partial:number;
  item_code:string;
  item_description:string;
  category:string;
  uom:string;
  qty_received:string;
  historical_lab_transact_count:string;

  lab_status:string;
  expiry_days_aging:string;
  client_requestor:string;
  lab_request_date:string;
  lab_request_by:string;
  po_number: number;
  is_active: boolean;
  qa_approval_status:string;

  qa_approval_by:string;
  qa_approval_date:string;
  lab_result_released_by: string;
  lab_result_released_date: string;
  lab_result_remarks:string;
  lab_sub_remarks:string;

  lab_exp_date_extension: string;
  lab_approval_aging_days: string;
  laboratory_procedure: string;
  supplier: string;
  po_date: string;
  pr_no: number;
  pr_date: string;

  fk_receiving_id: string;


  constructor () {
    this.id = null;
    this.lab_access_code = null;
    this.index_id_partial = null;
    this.item_code = null;
    this.item_description = null;
    this.category = null;
    this.uom = null;
    this.qty_received = null;
    this.historical_lab_transact_count = null;

    this.lab_status = null;
    this.expiry_days_aging = null;
    this.client_requestor = null;
    this.lab_request_date = null;
    this.lab_request_by = null;
    this.po_number = null;
    this.is_active = null;
    this.qa_approval_status = null;

    this.qa_approval_by = null;
    this.qa_approval_date = null;
    this.lab_result_released_by = null;
    this.lab_result_released_date = null;
    this.lab_result_remarks = null;
    this.lab_sub_remarks = null;

    this.lab_exp_date_extension = null;
    this.lab_approval_aging_days = null;
    this.laboratory_procedure = null;
    this.supplier = null;
    this.po_date = null;
    this.pr_no = null;
    this.pr_date = null;

    this.fk_receiving_id = null;

  }
}
