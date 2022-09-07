export class ChecklistClass {
  parent_chck_id: number;
  parent_chck_details: string;
  Parent_chck_added_by: string;
  is_active: boolean;

  constructor(){
    this.parent_chck_id = null,
    this.parent_chck_details = null,
    this.Parent_chck_added_by = null,
    this.is_active = null
  }
}
