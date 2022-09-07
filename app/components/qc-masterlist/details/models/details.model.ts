export class DetailsClass{
  cc_id:number;
  cc_parent_key: number;
  cc_description: string;
  cc_added_by: string;
  is_active: boolean;

  constructor(){
    this.cc_id = null,
    this.cc_parent_key = null,
    this.cc_description = null,
    this.cc_added_by = null,
    this.is_active = null
  }
}
