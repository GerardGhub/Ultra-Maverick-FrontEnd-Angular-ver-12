export class UserAccount {
  userInfo: any;
  map(arg0: (item: any) => void) {
    throw new Error('Method not implemented.');
  }
  id: string;
  employee_number:number;
  firstName:string;
  lastName:string;
  gender: string;

  department_id:number;
  unit_id: number;

  location:string;
  userrole:string;
  username:string;
  password:string;

  approver:boolean;
  requestor:boolean;

  first_approver_name:string;
  first_approver_id:string;

  second_approver_name:string;
  second_approver_id:string;
  third_approver_name:string;
  third_approver_id:string;

  fourth_approver_name:string;
  fourth_approver_id:string;
  user_identity: number;
  // is_active:string;
   is_active: boolean;
  constructor()
  {
    this.id = "",
    this.employee_number = 0;
    this.firstName = "";
    this.lastName = "";
    this.gender = "";

    this.department_id = null;
    this.unit_id = null;
    this.location = null;

    this.userrole = null;
    this.username = null;
    this.password = null;

    this.approver = null;
    this.requestor = null;
    this.first_approver_name = null;
    this.first_approver_id = null;

    this.second_approver_name = null;
    this.second_approver_id = null;
    this.third_approver_name = null;
    this.third_approver_id = null;

    this.fourth_approver_name = null;
    this.fourth_approver_id = null;

    this.is_active = null;
  }
}

