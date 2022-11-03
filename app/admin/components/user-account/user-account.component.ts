import {
  Component,
  ElementRef,
  ModuleWithComponentFactories,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RejectedStatus } from '../../../models/rejected-status';
import { FilterPipe } from '../../../pipes/filter.pipe';
import * as $ from 'jquery';
import { Observable } from 'rxjs';
import { SystemCapabilityStatusService } from '../../../services/system-capability-status.service';
import { SystemCapabilityStatus } from '../../../models/system-capability-status';
import { UserAccount } from '../../../models/user-account';
import { UserAccountService } from '../../../services/user-account.service';
import { AspNetRolesService } from '../../../services/asp-net-roles.service';
import { AspNetRoles } from '../../../models/asp-net-roles';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  //Objects for Holding Model Data
  AspNetUsers: UserAccount[] = [];
  showLoading: boolean = true;
  systemModules: any[] = [];
  employees: any[] = [];
  approverList: any[] = [];
  positionList: AspNetRoles[] = [];

  //Objects for Delete
  deleteRejectStatus: RejectedStatus = new RejectedStatus();
  editIndex: number = null;
  deleteIndex: number = null;

  //Properties for Searching
  searchBy: string = 'lastName';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'lastName';
  sortOrder: string = 'ASC';

  //Reactive Forms
  registerUser: FormGroup;
  editUser: FormGroup;

  //search Employee
  employee_id: string = '';
  searched_emp: any[] = [];
  search_approver: any[] = [];
  userinfo: any = [];

  //set form value
  lastName: string = '';
  firstName: string = '';
  department: string = '';
  department_id: number;
  sub_unit: string = '';
  unit_id: number;
  employee_number: number;

  // approver name
  first_approver_name: string = '';
  second_approver_name: string = '';
  third_approver_name: string = '';
  fourth_approver_name: string = '';

  noDataFound: string = '';
  successMessage: string = '';
  errorMessageFromResponse: string = '';

  hide = true;

  approver = false;
  requestor = false;

  approverId1: number;

  checkboxes: any[] = [
    { name: 'cbApprover', value: 'APPROVER', checked: false },
    { name: 'cbRequestor', value: 'REQUESTOR', checked: false },
  ];

  checkedState: string = '';

  //Autofocus TextBoxes
  @ViewChild('defaultTextBox_New') defaultTextBox_New: ElementRef;
  @ViewChild('defaultTextBox_Edit') defaultTextBox_Edit: ElementRef;

  //Sample for Testing Status
  samples: Observable<SystemCapabilityStatus[]>;

  constructor(
    private userAccountService: UserAccountService,
    private formBuilder: FormBuilder,
    private systemCapabilityStatusService: SystemCapabilityStatusService,
    private aspNetRolesService: AspNetRolesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getLists();
    this.listOfModules();
    this.listOfPosition();
    this.getEmployeeList();
    this.getApproverList();
    this.reactiveForms();
    this.checkboxState();
    this.samples =
      this.systemCapabilityStatusService.getSystemCapabilityStatus();
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessageFromResponse, 'Message');
  }

  getLists() {
    this.userAccountService
      .getUserList()
      .subscribe((response: UserAccount[]) => {
        this.AspNetUsers = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        // console.log(response);
        // console.warn(response);
      });
  }

  getEmployeeList() {
    this.userAccountService.getEmployee().subscribe((data) => {
      this.employees = data;
      // console.log('data', data);
    });
  }

  getApproverList() {
    this.userAccountService.getApprover().subscribe((data) => {
      this.approverList = data;

    });
  }

  // Reactive Forms *********************************************************************
  reactiveForms() {
    this.registerUser = this.formBuilder.group({
      employee_number: this.formBuilder.control(null),
      firstName: this.formBuilder.control(null, [Validators.required]),
      lastName: this.formBuilder.control(null, [Validators.required]),
      gender: this.formBuilder.control(null, [Validators.required]),
      department: this.formBuilder.control(null, [Validators.required]),
      department_id: this.formBuilder.control(null, [Validators.required]),
      sub_unit: this.formBuilder.control(null, [Validators.required]),
      unit_id: this.formBuilder.control(null, [Validators.required]),
      location: this.formBuilder.control(null, [Validators.required]),
      userrole: this.formBuilder.control(null, [Validators.required]),
      username: this.formBuilder.control(null, [Validators.required]),
      password: this.formBuilder.control(null, [Validators.required]),
      approver: this.formBuilder.control(null),
      requestor: this.formBuilder.control(null),

      first_approver_name: this.formBuilder.control(null),
      first_approver_id: this.formBuilder.control(null),
      second_approver_name: this.formBuilder.control(null),
      second_approver_id: this.formBuilder.control(null),
      third_approver_name: this.formBuilder.control(null),
      third_approver_id: this.formBuilder.control(null),
      fourth_approver_name: this.formBuilder.control(null),
      fourth_approver_id: this.formBuilder.control(null),
      // isActive: this.formBuilder.control(null, [Validators.required])
    });

    this.editUser = this.formBuilder.group({
      id: this.formBuilder.control(null),
      employee_number: this.formBuilder.control(null),
      firstName: this.formBuilder.control(null, [Validators.required]),
      lastName: this.formBuilder.control(null, [Validators.required]),
      gender: this.formBuilder.control(null, [Validators.required]),
      department_Name: this.formBuilder.control(null, [Validators.required]),
      department_id: this.formBuilder.control(null, [Validators.required]),
      departmentUnit_Name: this.formBuilder.control(null, [
        Validators.required,
      ]),
      unit_id: this.formBuilder.control(null, [Validators.required]),
      location: this.formBuilder.control(null, [Validators.required]),
      userRole: this.formBuilder.control(null, [Validators.required]),
      Approver: this.formBuilder.control(null),
      Requestor: this.formBuilder.control(null),

      first_approver_name: this.formBuilder.control(null),
      first_approver_id: this.formBuilder.control(null),
      second_approver_name: this.formBuilder.control(null),
      second_approver_id: this.formBuilder.control(null),
      third_approver_name: this.formBuilder.control(null),
      third_approver_id: this.formBuilder.control(null),
      fourth_approver_name: this.formBuilder.control(null),
      fourth_approver_id: this.formBuilder.control(null),
    });
  }

  resetForm() {
    this.registerUser.patchValue({
      employee_number: '',
      firstName: '',
      lastName: '',
      gender: '',
      department: '',
      department_id: '',
      sub_unit: '',
      unit_id: '',
      location: '',
      userrole: '',
      username: '',
      password: '',
      Approver: '',
      Requestor: '',

      first_approver_name: '',
      first_approver_id: '',
      second_approver_name: '',
      second_approver_id: '',
      third_approver_name: '',
      third_approver_id: '',
      fourth_approver_name: '',
      fourth_approver_id: '',
    });
  }

  listOfModules() {
    const systmodules = [
      {
        id: 1,
        description: 'Dashboard',
      },
      {
        id: 2,
        description: 'QC Recieving',
      },
      {
        id: 3,
        description: 'WH Recieving',
      },
      {
        id: 4,
        description: 'Approvals',
      },
      {
        id: 5,
        description: 'Labtest',
      },
      {
        id: 6,
        description: 'Preparation',
      },
      {
        id: 7,
        description: 'Online MRS',
      },
      {
        id: 8,
        description: 'Set Up',
      },
    ];

    this.systemModules = systmodules;
  }

  listOfPosition() {
    this.aspNetRolesService
      .getListOfRole()
      .subscribe((response: AspNetRoles[]) => {
        this.positionList = response;

      });
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.AspNetUsers, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }

    this.currentPageIndex = 0;
  }

  onPageIndexClicked(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  onNewClick(event) {
    //reset the registerUser
    this.registerUser.reset({ id: 0 });
    setTimeout(() => {
      //Focus the ClientLocation textbox in registerUser
      this.defaultTextBox_New.nativeElement.focus();
    }, 100);
  }

  onEditClick(event, userInfo: UserAccount) {
    this.editUser.reset();
    this.editUser.patchValue(userInfo);
 
    this.validateReqAndApproveIfBoolean(event, userInfo);
    this.validatetagApprovedOnEdit(event, userInfo);
    this.validateifApproverOrNot(event, userInfo);

    this.userinfo = userInfo;

  }
validateReqAndApproveIfBoolean(event, userInfo: UserAccount) {
  if (typeof (userInfo.approver.valueOf) == "boolean") {
  
  } else {
 
      this.editUser.patchValue({
        Approver: false
      });
  }

  if (typeof (userInfo.requestor.valueOf) == "boolean") {
  
  } else {
 
      this.editUser.patchValue({
        Requestor: false
      });
  }
}


  validateifApproverOrNot(event, userInfo: UserAccount) {


    if (userInfo.requestor == true) {
      this.editUser.patchValue({
        Requestor: true
      });
    }
    if (userInfo.approver == true) {
      this.editUser.patchValue({
        Approver: true
      });
    }
  }

  validatetagApprovedOnEdit(event, userInfo: UserAccount) {
    if (userInfo.first_approver_id == "0") {
      this.editUser.patchValue({
        first_approver_name: ""
      });
    }
    if (userInfo.second_approver_id == "0") {
      this.editUser.patchValue({
        second_approver_name: ""
      });
    }
    if (userInfo.third_approver_id == "0") {
      this.editUser.patchValue({
        third_approver_name: ""
      });
    }
    if (userInfo.fourth_approver_id == "0") {
      this.editUser.patchValue({
        fourth_approver_name: ""
      });
    }
  }



  onSearchTextChange(event) {

    this.calculateNoOfPages();
  }

  onFilterStatus(val) {

    if (!val) {
      this.getLists();

    } else {


      if (val === "") {

      }
      else if (val === "true") {
        val = true;
      }
      else if (val === "false") {

        val = false;
      }
      const status = this.AspNetUsers.filter(status => status.is_active === val);
      this.AspNetUsers = status;
      // console.log(this.AspNetUsers);
      this.showLoading = false;
      this.calculateNoOfPages();
    }


  }



  searchEmployee() {
    const result = this.employees.filter(
      (employee) => employee.emp_id == this.employee_id
    );
    this.searched_emp = result;

    if (result.length == 0) {
      this.noDataFound = 'No Data Found!';
      this.firstName = '';
      this.lastName = '';
      this.department = '';
      this.sub_unit = '';
    } else {
      this.noDataFound = '';
      result.forEach((employee) => {
        this.firstName = employee.first_name;
        this.lastName = employee.last_name;
        this.department = employee.department;
        this.department_id = employee.department_id;
        this.sub_unit = employee.sub_unit;
        this.unit_id = employee.departmentUnit_id;
        this.employee_id = employee.emp_id;
        this.employee_number = employee.emp_id;
      });

      this.registerUser.patchValue({
        firstName: this.firstName,
        lastName: this.lastName,
        department: this.department,
        department_id: this.department_id,
        sub_unit: this.sub_unit,
        unit_id: this.unit_id,
        // isActive: "Active",
        employee_number: this.employee_number,
        gender: 'Male',
      });
    }
  }

  CheckAllOptions() {


    if (this.checkboxes.every((val) => val.checked == true)) {
      this.checkboxes.forEach((val) => {
        val.checked = false;
      });
    } else {
      this.checkboxes.forEach((val) => {
        val.checked = true;
      });
    }
  }

  checkboxState() {
    if (this.approver == true && this.requestor == true) {
      this.checkedState = '';
      // alert(this.approver);
      // alert(this.requestor);
    } else if (this.approver == true && this.requestor == false) {
      this.checkedState = '';
      // alert(this.approver);
      // alert(this.requestor);
    } else if (this.approver == false && this.requestor == false) {
      this.checkedState = 'show';
      // alert(this.approver);
      // alert(this.requestor);
    } else {
      this.checkedState = 'show';
      // alert(this.approver);
      // alert(this.requestor);
    }
  }

  // Active or InActive *******************************************************************
  onClickDeActivate(userInfo: UserAccount) {
    // alert('Deactivated');

    this.editUser.reset();

    this.editUser.patchValue({
      Approver: this.approver = false,
      Requestor: this.requestor = false
    });

    this.editUser.patchValue(userInfo);

    this.userinfo = userInfo;


    if (this.editUser.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Deactivate?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userAccountService.deactivateUser(this.editUser.value).subscribe(
            (response: UserAccount) => {
              this.AspNetUsers[this.editIndex] = response;
              this.successMessage = 'Updated Successfully!';

              this.editUser.reset();

              // $('#closeActivateUpdateModal').trigger('click');
              this.successToaster();
              this.getLists();
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    }






  }

  onClickActivate(userInfo: UserAccount) {
    // alert('Activated 1');
    // onClickActivate(item: any)

    this.editUser.reset();

    this.editUser.patchValue({
      Approver: this.approver = false,
      Requestor: this.requestor = false
    });

    this.editUser.patchValue(userInfo);

    this.userinfo = userInfo;
    this.onSubmitActivateUser();

  }

  validateRejectedStatus(event: any) {
    alert(event);
  }


  // add user approver method
  getNewFirstApproverId(id) {

    if (typeof (id) == "string") {
      this.first_approver_name = "";
    }
    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.first_approver_name = approver.firstName + ' ' + approver.lastName;

    });

    this.registerUser.patchValue({
      first_approver_name: this.first_approver_name,
    });
  }

  getNewSecondApproverId(id) {

    if (typeof (id) == "string") {
      this.second_approver_name = "";
    }

    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.second_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.registerUser.patchValue({
      second_approver_name: this.second_approver_name,
    });
  }

  getNewThirdApproverId(id) {

    if (typeof (id) == "string") {
      this.third_approver_name = "";
    }

    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.third_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.registerUser.patchValue({
      third_approver_name: this.third_approver_name,
    });
  }

  getNewFourthApproverId(id) {

    if (typeof (id) == "string") {
      this.fourth_approver_name = "";
    }

    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.fourth_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.registerUser.patchValue({
      fourth_approver_name: this.fourth_approver_name,
    });
  }

  // edituser approver method
  getFirstApproverId(id) {
    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.first_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.editUser.patchValue({
      first_approver_name: this.first_approver_name,
    });

    if (typeof (id.valueOf) == "string") {
      this.first_approver_name = "";
    }
  }

  getSecondApproverId(id) {
    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.second_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.editUser.patchValue({
      second_approver_name: this.second_approver_name,
    });

    if (typeof (id) == "string") {
      this.second_approver_name = "";
    }
  }

  getThirdApproverId(id) {
    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;


    result.forEach((approver) => {
      this.third_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.editUser.patchValue({
      third_approver_name: this.third_approver_name,
    });

    if (typeof (id) == "string") {
      this.third_approver_name = "";
    }
  }

  getFourthApproverId(id) {
    const result = this.approverList.filter(
      (approver) => approver.user_identity == id
    );
    this.search_approver = result;

    result.forEach((approver) => {
      this.fourth_approver_name = approver.firstName + ' ' + approver.lastName;
    });

    this.editUser.patchValue({
      fourth_approver_name: this.fourth_approver_name,
    });

    if (typeof (id) == "string") {
      this.fourth_approver_name = "";
    }
  }

  // Crud *******************************************************************************
  onSubmitEditUser() {
    if (this.editUser.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Update?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userAccountService.updateUser(this.editUser.value).subscribe(
            (response: UserAccount) => {
              this.AspNetUsers[this.editIndex] = response;
              this.successMessage = 'Updated Successfully!';
              this.editUser.reset();
              $('#closeUpdateModal').trigger('click');
              this.successToaster();
              this.getLists();
            },
            (error) => {
              console.log(error);
              this.errorMessageFromResponse = error.error.message;
              this.toastr.error(this.errorMessageFromResponse, 'Message');
            }
          );
        }
      });
    }
  }

  //Activate A User
  onSubmitActivateUser() {
    if (this.editUser.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Activate?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userAccountService.activateUser(this.editUser.value).subscribe(
            (response: UserAccount) => {
              this.AspNetUsers[this.editIndex] = response;
              this.successMessage = 'Updated Successfully!';

              this.editUser.reset();

              $('#closeActivateUpdateModal').trigger('click');
              this.successToaster();
              this.getLists();
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    }
  }

  onSubmitRegistration() {
    if (this.registerUser.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Register?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userAccountService
            .registerUser(this.registerUser.value)
            .subscribe(
              (response: UserAccount) => {
                this.AspNetUsers[this.editIndex] = response;
                this.successMessage = 'Registered Successfully!';
                this.registerUser.reset();

                console.log(response);

                $('#closeRegistrationModal').trigger('click');
                this.successToaster();
              },
              (error) => {
                this.errorMessageFromResponse = error.error.message;
                console.log(this.errorMessageFromResponse);
                this.toastr.error(this.errorMessageFromResponse, 'Message');
              }
            );
        }
      });
    }
  }
}
