export class DescriptionClass {
  gc_id: number;
  gc_child_key: number;
  gc_description: string;
  is_active: boolean;
  is_manual: string;

  constructor() {
    (this.gc_id = null),
      (this.gc_child_key = null),
      (this.gc_description = null),
      (this.is_active = null),
      (this.is_manual = null);
  }
}
