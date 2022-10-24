import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { LabaratoryProcedure } from '../../../models/laboratory-procedures/labaratory-procedure';
import { LabTestProcedureService } from '../../../services/labtest-procedures-service/lab-test-procedure.service';
import { SystemCapabilityStatusService } from '../../../services/system-capability-status.service';
import Swal from 'sweetalert2';
import * as $ from "jquery";
import { SystemCapabilityStatus } from '../../../models/system-capability-status';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { MainMenusService } from '../../../services/main-menus.service';
import { MainMenus } from '../../../models/main-menus';

@Component({
  selector: 'app-parent-main-modules',
  templateUrl: './parent-main-modules.component.html',
  styleUrls: ['./parent-main-modules.component.scss']
})
export class ParentMainModulesComponent implements OnInit {

//Objects for Holding Model Data
labTestProcedures: LabaratoryProcedure[] = [];
mainMenus: MainMenus[] = [];
showLoading: boolean = true;

//Objects for Delete
deleteRejectStatus: LabaratoryProcedure = new LabaratoryProcedure();
editIndex: number = 0;
deleteIndex: number = 0;

//Properties for Searching
searchBy: string = "lab_description";
searchText: string = "";

//Properties for Paging
currentPageIndex: number = 0;
pages: any[] = [];
pageSize: number = 7;

//Properties for Sorting
sortBy: string = "lab_description";
sortOrder: string = "ASC";

//Reactive Forms
newForm: FormGroup;
editForm: FormGroup;

activeUser: string = "";


//Autofocus TextBoxes
@ViewChild("defaultTextBox_New") defaultTextBox_New: ElementRef;
@ViewChild("defaultTextBox_Edit") defaultTextBox_Edit: ElementRef;


//Sample for Testing Status
samples: Observable<SystemCapabilityStatus[]>;
loginUserName: string = "";


constructor(private fb: FormBuilder, public loginService : LoginService, private labTestProceduresedureService: LabTestProcedureService, private formBuilder: FormBuilder, private systemCapabilityStatusService: SystemCapabilityStatusService,
  private toastr: ToastrService, private mainMenusService : MainMenusService) {}


ngOnInit() {
  //Get data from database
    // this.loginService.detectIfAlreadyLoggedIn();
    this.loginUserName = this.loginService.currentUserName;

    this.getSubRemarksLists();

    // newForm
    this.newForm = this.formBuilder.group({
      // lab_id: this.formBuilder.control(null),
      modulename: this.formBuilder.control(null, [Validators.required]),
    addedby: this.formBuilder.control(null, [Validators.required]),
      // isactive: this.formBuilder.control(null, [Validators.required]),
      // created_at: this.formBuilder.control(null, [Validators.required]),
      // created_by: this.formBuilder.control(null, [Validators.required])

    });

    // editForm
    this.editForm = this.formBuilder.group({
      lab_id: this.formBuilder.control(null),
      lab_description: this.formBuilder.control(null, [Validators.required]),
      is_active_status: this.formBuilder.control(null, [Validators.required]),
      // created_at: this.formBuilder.control(null, [Validators.required]),
      // created_by: this.formBuilder.control(null, [Validators.required])
    });
    
  // Here
  this.samples = this.systemCapabilityStatusService.getSystemCapabilityStatus();

}

@ViewChild("LabTestProcedureDesc") LabTestProcedureDesc: ElementRef;
@ViewChild("DeleteLabTestProcedureDesc") DeleteLabTestProcedureDesc: ElementRef;
@ViewChild("UpdateLabTestProcedureDesc") UpdateLabTestProcedureDesc: ElementRef;

getSubRemarksLists(){
  this.mainMenusService.getMainMenus().subscribe(
    (response: MainMenus[]) => {
      this.mainMenus = response;
      this.showLoading = false;
      this.calculateNoOfPages();
    }
  );
}

calculateNoOfPages() {
  //Get no. of Pages
  let filterPipe = new FilterPipe();
  var noOfPages = Math.ceil(filterPipe.transform(this.labTestProcedures, this.searchBy, this.searchText).length / this.pageSize);
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
  //reset the newForm
  this.newForm.reset({ id: 0 });
  setTimeout(() => {
    //Focus the ClientLocation textbox in newForm
    this.defaultTextBox_New.nativeElement.focus();
    this.activeUser = this.loginUserName;

   
  }, 100);
}

onSaveClick() {
  if (this.newForm.valid) {
    //Start
    var StatusofReject = this.LabTestProcedureDesc.nativeElement.value;
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
       
        this.mainMenusService.insertNewData(this.newForm.value).subscribe((response) => {
          var p: MainMenus = new MainMenus();
          p.id = response.id;
          p.modulename = response.modulename;
          // p.isactive = response.isactive;
          // p.dateadded = response.dateadded;
          p.addedby = this.loginUserName;
          this.mainMenus.push(p);

          console.warn(MainMenus);
          //Reset the newForm
          this.newForm.reset();

          $("#newLabTestProcedureCancelModal").trigger("click");
          this.calculateNoOfPages();

          Swal.fire(
            'Append!',
            'Your data is Saved on production',
            'success'
          )


        }, (error) => {
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

FieldOutRequiredField() {
  this.toastr.warning('Field out the required fields!', 'Notifications');
}

onEditClick(event, RejectedStatusParam: LabaratoryProcedure) {
  //Reset the editForm
  this.editForm.reset();
  setTimeout(() => {
    //Set data into editForm
    this.editForm.patchValue(RejectedStatusParam);
    this.editIndex = this.labTestProcedures.indexOf(RejectedStatusParam);

    //Focus the ClientLocation textbox in editForm
    this.defaultTextBox_Edit.nativeElement.focus();
  }, 100);
}

onUpdateClick() {
  if (this.editForm.valid) {
    var Status = this.UpdateLabTestProcedureDesc.nativeElement.value;
    Swal.fire({
      title: 'Are you sure that you want to modify the status?',
      text: Status,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {

        //Invoke the REST-API call
        this.labTestProceduresedureService.updateDataStatus(this.editForm.value).subscribe((response: LabaratoryProcedure) => {
        //Update the response in Grid
        this.labTestProcedures[this.editIndex] = response;

          //Reset the editForm
          this.editForm.reset();
          $("#editLabTestProcedureCancelModal").trigger("click");
        },
          (error) => {
            console.log(error);
          });

        Swal.fire(
          'Updated!',
          'your data on production has been modified',
          'success'
        )
      }
    })



  }
}

onDeleteClick(event, CancelledPOTransactionStatus: LabaratoryProcedure) {
  //Set data into deleteClientLocation
  this.deleteRejectStatus.lab_id = CancelledPOTransactionStatus.lab_id;
  this.deleteRejectStatus.lab_description = CancelledPOTransactionStatus.lab_description;
  this.deleteIndex = this.labTestProcedures.indexOf(CancelledPOTransactionStatus);
}

onDeleteConfirmClick() {
  var StatusofRm = this.DeleteLabTestProcedureDesc.nativeElement.value;
  Swal.fire({
    title: 'Are you sure that you want to delete the status?',
    text: StatusofRm,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes'
  }).then((result) => {
    if (result.isConfirmed) {

      //Invoke the REST-API call
      this.labTestProceduresedureService.deleteDataStatus(this.deleteRejectStatus.lab_id).subscribe(
        (response) => {
          //Delete object in Grid
          this.labTestProcedures.splice(this.deleteIndex, 1);

          //Clear deleteCountry
          this.deleteRejectStatus.lab_id = 0;
          this.deleteRejectStatus.lab_description = "";
          this.deleteRejectStatus.is_active_status = "";
          //Recall the calculateNoOfPages
          this.calculateNoOfPages();
        },
        (error) => {
          console.log(error);
        });
      Swal.fire(
        'Deleted!',
        'data has been removed on production.',
        'success'
      )

    }
  })
}

onSearchTextChange(event) {
  this.calculateNoOfPages();
}

onFilterStatus(val) {
  if(!val){
    this.getSubRemarksLists();
  }else{
    const status = this.labTestProcedures.filter(status => status.is_active_status === val);
    this.labTestProcedures = status;
    // this.showLoading = false;
    this.calculateNoOfPages();
  }

}

}
