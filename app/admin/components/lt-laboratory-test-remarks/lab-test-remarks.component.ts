import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LabTestRemarks } from 'src/app/models/labtest-remarks/lab-test-remarks';
import { SystemCapabilityStatus } from 'src/app/models/system-capability-status';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { LabtestRemarksService } from 'src/app/services/labtest-remarks-service/labtest-remarks.service';
import { SystemCapabilityStatusService } from 'src/app/services/system-capability-status.service';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-lab-test-remarks',
  templateUrl: './lab-test-remarks.component.html',
  styleUrls: ['./lab-test-remarks.component.scss']
})
export class LabTestRemarksComponent implements OnInit {

  //Objects for Holding Model Data
  labTestRemarks: LabTestRemarks[] = [];
  showLoading: boolean = true;

  //Objects for Delete
  deleteRejectStatus: LabTestRemarks = new LabTestRemarks();
  editIndex: number = null;
  deleteIndex: number = null;

  //Properties for Searching
  searchBy: string = "lab_remarks_description";
  searchText: string = "";

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = "lab_remarks_description";
  sortOrder: string = "ASC";

  //Reactive Forms
  newForm: FormGroup;
  editForm: FormGroup;

  activeVal: string = "";

  //Autofocus TextBoxes
  @ViewChild("defaultTextBox_New") defaultTextBox_New: ElementRef;
  @ViewChild("defaultTextBox_Edit") defaultTextBox_Edit: ElementRef;


  //Sample for Testing Status
  samples: Observable<SystemCapabilityStatus[]>;
  loginUserName: string = "";


  constructor(private fb: FormBuilder, private labtestRemarksService: LabtestRemarksService, private formBuilder: FormBuilder, private systemCapabilityStatusService: SystemCapabilityStatusService,
    private toastr: ToastrService) {}


  ngOnInit() {
    //Get data from database
      this.getSubRemarksLists();

      // newForm
      this.newForm = this.formBuilder.group({
        // lab_remarks_id: this.formBuilder.control(null),
        lab_remarks_description: this.formBuilder.control(null, [Validators.required]),
        lab_test_remarks_active_status: this.formBuilder.control(null, [Validators.required]),
        // created_at: this.formBuilder.control(null, [Validators.required]),
        // created_by: this.formBuilder.control(null, [Validators.required])

      });

      // editForm
      this.editForm = this.formBuilder.group({
        lab_remarks_id: this.formBuilder.control(null),
        lab_remarks_description: this.formBuilder.control(null, [Validators.required]),
        lab_test_remarks_active_status: this.formBuilder.control(null, [Validators.required]),
        // created_at: this.formBuilder.control(null, [Validators.required]),
        // created_by: this.formBuilder.control(null, [Validators.required])
      });

    // Here
    this.samples = this.systemCapabilityStatusService.getSystemCapabilityStatus();
  }

  @ViewChild("RejectStatusDescription") RejectStatusDescription: ElementRef;
  @ViewChild("DeleteRejectStatusDescription") DeleteRejectStatusDescription: ElementRef;
  @ViewChild("UpdateRejectStatusDescription") UpdateRejectStatusDescription: ElementRef;

  getSubRemarksLists(){
    this.labtestRemarksService.getListOfStatusOfData().subscribe(
      (response: LabTestRemarks[]) => {
        this.labTestRemarks = response;
        this.showLoading = false;
        this.calculateNoOfPages();
      }
    );
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.labTestRemarks, this.searchBy, this.searchText).length / this.pageSize);
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
      this.activeVal = "Active";
    }, 100);
  }

  onSaveClick() {
    if (this.newForm.valid) {
      //Start
      var StatusofReject = this.RejectStatusDescription.nativeElement.value;
      Swal.fire({
        title: 'Are you sure that you want to append new status?',
        text: StatusofReject,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.labtestRemarksService.insertDataStatus(this.newForm.value).subscribe((response) => {
            var p: LabTestRemarks = new LabTestRemarks();
            p.lab_remarks_id = response.lab_remarks_id;
            p.lab_remarks_description = response.lab_remarks_description;
            p.lab_test_remarks_active_status = response.lab_test_remarks_active_status;
            p.created_at = response.created_at;
            p.created_by = response.created_by;
            this.labTestRemarks.push(p);

            //Reset the newForm
            this.newForm.reset();

            $("#newLabTestRemarksCancelModal").trigger("click");
            this.calculateNoOfPages();
          }, (error) => {
            console.log(error);
          });

          Swal.fire(
            'Append!',
            'Your data is Saved on production',
            'success'
          )
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

  onEditClick(event, RejectedStatusParam: LabTestRemarks) {
    //Reset the editForm
    this.editForm.reset();
    setTimeout(() => {
      //Set data into editForm
      this.editForm.patchValue(RejectedStatusParam);
      this.editIndex = this.labTestRemarks.indexOf(RejectedStatusParam);

      //Focus the ClientLocation textbox in editForm
      this.defaultTextBox_Edit.nativeElement.focus();
    }, 100);
  }

  onUpdateClick() {
    if (this.editForm.valid) {
      var Status = this.UpdateRejectStatusDescription.nativeElement.value;
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
          this.labtestRemarksService.updateDataStatus(this.editForm.value).subscribe((response: LabTestRemarks) => {
          //Update the response in Grid
          this.labTestRemarks[this.editIndex] = response;

            //Reset the editForm
            this.editForm.reset();
            $("#editLabTestRemarksCancelModal").trigger("click");
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

  onDeleteClick(event, deleteLabTestRemarks: LabTestRemarks) {
    //Set data into deleteClientLocation
    this.deleteRejectStatus.lab_remarks_id = deleteLabTestRemarks.lab_remarks_id;
    this.deleteRejectStatus.lab_remarks_description = deleteLabTestRemarks.lab_remarks_description;
    this.deleteIndex = this.labTestRemarks.indexOf(deleteLabTestRemarks);
  }

  onDeleteConfirmClick() {
    var StatusofRm = this.DeleteRejectStatusDescription.nativeElement.value;
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
        this.labtestRemarksService.deleteDataStatus(this.deleteRejectStatus.lab_remarks_id).subscribe(
          (response) => {
            //Delete object in Grid
            this.labTestRemarks.splice(this.deleteIndex, 1);

            //Clear deleteCountry
            this.deleteRejectStatus.lab_remarks_id = null;
            this.deleteRejectStatus.lab_remarks_description = null;
            this.deleteRejectStatus.lab_test_remarks_active_status = null;
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
      const status = this.labTestRemarks.filter(status => status.lab_test_remarks_active_status === val);
      this.labTestRemarks = status;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }

  }

}
