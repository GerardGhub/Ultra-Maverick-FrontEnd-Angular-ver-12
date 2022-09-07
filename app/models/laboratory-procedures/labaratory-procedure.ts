export class LabaratoryProcedure {
  lab_id:number;
  lab_description:string;
  is_active_status:string;
  created_at:string;
  created_by:string;
  updated_at:string;
  updated_by:string;

  constructor()
  {
      this.lab_id = null;
      this.lab_description = null;
      this.is_active_status = null;
      this.created_at = null;
      this.created_by = null;
      // this.updated_at = null;
      // this.updated_by = null;
  }
}
