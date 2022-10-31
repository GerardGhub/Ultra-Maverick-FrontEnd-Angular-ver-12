import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterPipe } from '../../../pipes/filter.pipe';
import * as $ from "jquery";
import { Observable } from 'rxjs';
import { SystemCapabilityStatusService } from '../../../services/system-capability-status.service';
import { SystemCapabilityStatus } from '../../../models/system-capability-status';
import { ToastrService } from 'ngx-toastr';
import { AspNetRolesService } from '../../../services/asp-net-roles.service';
import { AspNetRoles } from '../../../models/asp-net-roles';
import { LoginService } from '../../../services/login.service';
import Swal from 'sweetalert2';
import { MainMenus } from '../../../models/main-menus';
import { MainMenusService } from '../../../services/main-menus.service';
import { UserAccountService } from '../../../services/user-account.service';
import { RoleModules } from '../../../models/rolemodules';


@Component({
  selector: 'app-asp-net-roles',
  templateUrl: './asp-net-roles.component.html',
  styleUrls: ['./asp-net-roles.component.scss']
})
export class AspNetRolesComponent implements OnInit {

  //Objects for Holding Model Data
  UserRole: AspNetRoles[] = [];
  RoleModule: RoleModules[] = [];
  MainMenu: Observable<MainMenus[]>;
  RoleModuleUnTagged: RoleModules[] = [];
  showLoading: boolean = true;

  //Objects for Delete
  deleteRejectStatus: AspNetRoles = new AspNetRoles();
  editIndex: number = 0;
  deleteIndex: number = 0;

  //Properties for Searching
  searchBy: string = "Name";
  searchText: string = "";

  //Properties for Paging
  currentPageIndex: number = 0;
  currentPageIndexModuleTagged: number = 0;
  currentPageIndexModuleUntagged: number = 0;
  pages: any[] = [];
  pagesUnTagged: any[] = [];
  pagesTagged: any[] = [];
  pageSize: number = 7;


  //Properties for Sorting
  sortBy: string = "Name";
  sortOrder: string = "ASC";

  //Reactive Forms
  newForm: FormGroup;
  editForm: FormGroup;
  editFormTaggedModule: FormGroup;

  activeUser: string = "";
  errorMessageFromResponse: string = '';
  //Combo Box for User Role Binding
  activeModuleId: string = "";
  totalRoleModulesUntaggedNewRowCount: number = 0;
  totalRoleModulesTaggedRowCount: number = 0
  //Autofocus TextBoxes
  @ViewChild("defaultTextBox_New") defaultTextBox_New: ElementRef;
  @ViewChild("defaultTextBox_Edit") defaultTextBox_Edit: ElementRef;

  //Sample for Testing Status
  samples: Observable<SystemCapabilityStatus[]>;

  constructor(
    private aspNetRolesService: AspNetRolesService,
    private formBuilder: FormBuilder,
    private systemCapabilityStatusService: SystemCapabilityStatusService,
    private toastr: ToastrService,
    public loginService: LoginService,
    private mainMenusService: MainMenusService,
    private userAccountService: UserAccountService) {

  }
  ngOnInit() {
    //Get data from database
    this.getUserRole();


    //Create newForm
    this.newForm = this.formBuilder.group({
      // id: this.formBuilder.control(null),
      name: this.formBuilder.control(null, [Validators.required]),
      addedby: this.formBuilder.control(null, [Validators.required])
    });

    // editForm
    this.editForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      name: this.formBuilder.control(null, [Validators.required]),
      isactive: this.formBuilder.control(null, [Validators.required]),
      modifiedby: this.formBuilder.control(null, [Validators.required]),
      isactivereference: this.formBuilder.control(null, [Validators.required]),
    });

    this.editFormTaggedModule = this.formBuilder.group({
      id: this.formBuilder.control(null),
      moduleId: this.formBuilder.control(null),
      modifiedby: this.formBuilder.control(null),
      RoleId: this.formBuilder.control(null),
      mainmoduleidentity: this.formBuilder.control(null)

    });

    // Here
    this.samples = this.systemCapabilityStatusService.getSystemCapabilityStatus();
    this.MainMenu = this.mainMenusService.getMainMenus();
  }

  @ViewChild("Description") Description: ElementRef;
  @ViewChild("DescriptionUpdate") DescriptionUpdate: ElementRef;
  @ViewChild("RoleId") RoleId: ElementRef;

  getUserRole() {
    this.aspNetRolesService.getListOfRole().subscribe(
      (response: AspNetRoles[]) => {
        this.UserRole = response;
        this.showLoading = false;
        this.calculateNoOfPages();
      }
    );
  }

  getUserRoleModules() {
    // alert(this.RoleId.nativeElement.value);
    this.userAccountService.getUserRoleListById(this.RoleId.nativeElement.value, Number(this.activeModuleId)).subscribe(

      (response: RoleModules[]) => {
        if (response) {
          this.RoleModule = response;
          // console.error(response);
          this.getModulesUntagged();
        }
      });
  }



  getModulesUntagged() {
    const untaggedData = this.RoleModule.filter(status => status.isactive === false);
    this.RoleModuleUnTagged = untaggedData;
    this.totalRoleModulesTaggedRowCount = untaggedData.length;
    this.calculateNoOfPagesUntagged();


    const taggedData = this.RoleModule.filter(status => status.isactive === true);
    this.RoleModule = taggedData;
    this.totalRoleModulesUntaggedNewRowCount = taggedData.length;
    this.calculateNoOfPagesTagged();
//    if (this.totalRoleModulesTaggedRowCount == 0 && this.totalRoleModulesUntaggedNewRowCount == 0)
    if (this.totalRoleModulesUntaggedNewRowCount == 0)
     {


      this.userAccountService.getUserRoleByAdminId(this.RoleId.nativeElement.value, Number(this.activeModuleId)).subscribe(

        (response: RoleModules[]) => {

          if (response) {
            this.RoleModule = response;

            const taggedData = this.RoleModule.filter(status => status.isactive === false);

         
            for( var i=taggedData.length - 1; i>=0; i--){
              for( var j=0; j<untaggedData.length; j++){
                  if(taggedData[i] && (taggedData[i].moduleid === untaggedData[j].moduleid)){
                      taggedData.splice(i, 1);
                  }
              }
          }

  console.log(taggedData);


            this.RoleModule = taggedData;
            this.totalRoleModulesUntaggedNewRowCount = taggedData.length;
            this.calculateNoOfPagesTagged();
          }
        });

    }

  }


  getNewFourthApproverId(roleid) {


    this.activeModuleId = roleid;
    this.getUserRoleModules();

    // if (typeof (id) == "string") {
    //   this.fourth_approver_name = "";
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.UserRole, this.searchBy, this.searchText).length / this.pageSize);
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }

    this.currentPageIndex = 0;
  }

  calculateNoOfPagesUntagged() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.RoleModuleUnTagged, "submenuname", this.searchText).length / this.pageSize);
    this.pagesUnTagged = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesUnTagged.push({ pageIndex: i });
    }

    this.currentPageIndexModuleUntagged = 0;
  }


  calculateNoOfPagesTagged() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.RoleModule, "submenuname", this.searchText).length / this.pageSize);
    this.pagesTagged = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesTagged.push({ pageIndex: i });
    }

    this.currentPageIndexModuleTagged = 0;
  }



  onFilterStatus(val) {

    if (!val) {
      this.getUserRole();
    } else {


      if (val === "") {

      }
      else if (val === "true") {
        val = true;
      }
      else if (val === "false") {

        val = false;
      }

      const status = this.UserRole.filter(status => status.isactive === val);
      this.UserRole = status;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }

  }


  onPageIndexClicked(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  onPageIndexClickedModuleTagged(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndexModuleTagged = ind;
    }
  }


  onPageIndexClickedModuleUntagged(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndexModuleUntagged = ind;
    }
  }



  onNewClick(event) {
    //reset the newForm
    this.newForm.reset({ id: 0 });
    setTimeout(() => {
      //Focus the User role textbox in newForm
      this.activeUser = this.loginService.currentUserName;
      this.defaultTextBox_New.nativeElement.focus();



    }, 100);
  }

  onSaveClick() {

    if (this.newForm.valid) {
      //Start

      var StatusofReject = this.Description.nativeElement.value;
      Swal.fire({
        title: 'Are you sure that you want to append new data?',
        text: StatusofReject,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call


          this.aspNetRolesService.appendnewRole(this.newForm.value).subscribe((response) => {
            //Add Response to Grid
            var p: AspNetRoles = new AspNetRoles();
            p.Id = response.Id;
            p.name = response.name;
            p.normalizedname = response.normalizedname;
            p.concurrencystamp = response.concurrencystamp;
            p.discriminator = response.discriminator;
            this.UserRole.push(p);

            //Reset the newForm
            this.newForm.reset();

            $("#newModal1").trigger("click");
            setTimeout(() => {

              this.getUserRole();
            }, 400);

            // this.calculateNoOfPages();

            Swal.fire(
              'Append!',
              'Your data is Saved on production',
              'success'
            )


          }, (error) => {
            this.errorMessageFromResponse = error.error.message;
            this.errorToaster();
            console.log(error);
          });

        }

      })

      //End

    }
    else {
      this.FieldOutRequiredField();
    }
  }


  errorToaster() {

    this.toastr.error(this.errorMessageFromResponse, 'Message');
  }


  FieldOutRequiredField() {
    this.toastr.warning('Field out the required fields!', 'Notifications');
  }
  onEditClick(event, StatusParam: AspNetRoles) {

    //Reset the editForm
    this.editForm.reset();
    setTimeout(() => {
      //Set data into editForm
      this.editForm.patchValue(StatusParam);
      // console.log(this.editForm.value);
      this.editIndex = this.UserRole.indexOf(StatusParam);
      this.activeUser = this.loginService.currentUserName;
      //Focus the ClientLocation textbox in editForm
      this.defaultTextBox_Edit.nativeElement.focus();
    }, 100);
  }

  onUntaggedClick(event, StatusParam: RoleModules) {


    this.editFormTaggedModule.reset();
    setTimeout(() => {
      this.editFormTaggedModule.patchValue({
        moduleId: this.activeModuleId,
        id: StatusParam.id,
        modifiedby: this.loginService.currentUserName,
        RoleId: this.RoleId.nativeElement.value,
        mainmoduleidentity: this.activeModuleId
      });
      // console.warn(this.editFormTaggedModule.value);

      this.editIndex = this.RoleModule.indexOf(StatusParam);
      this.activeUser = this.loginService.currentUserName;

    }, 100);




    var Status = this.DescriptionUpdate.nativeElement.value;
    Swal.fire({
      title: 'Are you sure that you want to tag?',
      text: Status,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        //Invoke the REST-API call


        this.userAccountService.updateUserRoleListById(this.editFormTaggedModule.value).subscribe((response: RoleModules) => {
          setTimeout(() => {

            Swal.fire(
              'Updated!',
              'your data on production has been modified',
              'success'
            )
            this.getUserRoleModules();

          }, 300);

        },
          (error) => {
            console.log(error);
          });




      }
    })


  }



  onTaggedClick(event, StatusParam: RoleModules) {

    // this.editFormTaggedModule.reset();
    setTimeout(() => {
      this.editFormTaggedModule.reset();
      this.editFormTaggedModule.patchValue({
        moduleId: this.activeModuleId,
        id: StatusParam.id,
        modifiedby: this.loginService.currentUserName,
        RoleId: this.RoleId.nativeElement.value,
        mainmoduleidentity: this.activeModuleId
      });
      // console.warn(this.editFormTaggedModule.value);

      this.editIndex = this.RoleModule.indexOf(StatusParam);
      this.activeUser = this.loginService.currentUserName;

    }, 100);




    var Status = this.DescriptionUpdate.nativeElement.value;
    Swal.fire({
      title: 'Are you sure that you want to untagged?',
      text: Status,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        //Invoke the REST-API call


        this.userAccountService.updateUserRoleListByIdActivate(this.editFormTaggedModule.value).subscribe((response: RoleModules) => {
          setTimeout(() => {

            Swal.fire(
              'Updated!',
              'your data on production has been modified',
              'success'
            )
            this.getUserRoleModules();

          }, 300);

        },
          (error) => {
            console.log(error);
          });




      }
    })


  }



  onUpdateClick() {
    if (this.editForm.valid) {

      var Status = this.DescriptionUpdate.nativeElement.value;
      Swal.fire({
        title: 'Are you sure that you want to modify the user role?',
        text: Status,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.aspNetRolesService.modifyRole(this.editForm.value).subscribe((response: AspNetRoles) => {
            //Update the response in Grid
            this.UserRole[this.editIndex] = response;
            setTimeout(() => {
              //Reset the editForm
              this.editForm.reset();
              $("#editCancelModal").trigger("click");


              Swal.fire(
                'Updated!',
                'your data on production has been modified',
                'success'
              )
              this.getUserRole();
            }, 300);

          },
            (error) => {
              this.errorMessageFromResponse = error.error.message;
              this.errorToaster();
              console.log(error);
            });



        }
      })



    }
  }



  onSearchTextChange(event) {
    this.calculateNoOfPages();
  }


}
