export class ParamenterClass {
  cp_params_id: number;
  cp_gchild_key: string;
  cp_description: string;
  gc_description: string;
  cp_bool_status: boolean;
  is_active: boolean;

  constructor() {
    (this.cp_params_id = null),
      (this.cp_gchild_key = null),
      (this.cp_description = null),
      (this.gc_description = null);
    (this.cp_bool_status = null), (this.is_active = null);
  }
}
