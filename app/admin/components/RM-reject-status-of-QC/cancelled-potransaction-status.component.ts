import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RejectedStatus } from 'src/app/models/rejected-status';
import { SystemCapabilityStatus } from 'src/app/models/system-capability-status';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { RejectedStatusService } from 'src/app/services/rejected-status.service';
import { SystemCapabilityStatusService } from 'src/app/services/system-capability-status.service';
import * as $ from "jquery";
import { CancelledPOTransactionStatusService } from 'src/app/services/cancelled-potransaction-status.service';
import { CancelledPOTransactionStatus } from 'src/app/models/cancelled-potransaction-status';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancelled-potransaction-status',
  templateUrl: './cancelled-potransaction-status.component.html',
  styleUrls: ['./cancelled-potransaction-status.component.scss']
})
export class CancelledPOTransactionStatusComponent implements OnInit {

  //Objects for Holding Model Data
  rmRejectedStatusOfQC: CancelledPOTransactionStatus[] = [];
  showLoading: boolean = true;

  //Objects for Delete
  deleteRejectStatus: CancelledPOTransactionStatus = new CancelledPOTransactionStatus();
  editIndex: number = null;
  deleteIndex: number = null;

  //Properties for Searching
  searchBy: string = "status_name";
  searchText: string = "";

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = "status_name";
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

  constructor(private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService, private formBuilder: FormBuilder, private systemCapabilityStatusService: SystemCapabilityStatusService,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    //Get data from database
    this.getLists();

    //Create newForm
    this.newForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      status_name: this.formBuilder.control(null, [Validators.required]),
      is_active: this.formBuilder.control(null, [Validators.required])
    });

    //Create editForm
    this.editForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      status_name: this.formBuilder.control(null, [Validators.required]),
      is_active: this.formBuilder.control(null, [Validators.required])
    });

    // Here
    this.samples = this.systemCapabilityStatusService.getSystemCapabilityStatus();
  }

  @ViewChild("RejectStatusQCDescription") RejectStatusQCDescription: ElementRef;
  @ViewChild("DeleteRejectStatusQCDescription") DeleteRejectStatusQCDescription: ElementRef;
  @ViewChild("UpdateRejectStatusQCDescription") UpdateRejectStatusQCDescription: ElementRef;

  getLists(){
    this.cancelledPOTransactionStatusService.getListOfStatusOfData().subscribe(
      (response: CancelledPOTransactionStatus[]) => {
        this.rmRejectedStatusOfQC = response;
        this.showLoading = false;
        this.calculateNoOfPages();
      }
    );
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.rmRejectedStatusOfQC, this.searchBy, this.searchText).length / this.pageSize);
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
      var StatusofReject = this.RejectStatusQCDescription.nativeElement.value;
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
          this.cancelledPOTransactionStatusService.insertDataStatus(this.newForm.value).subscribe((response) => {
            //Add Response to Grid
            var p: CancelledPOTransactionStatus = new CancelledPOTransactionStatus();
            p.id = response.id;
            p.status_name = response.status_name;
            p.is_active = response.is_active;
            this.rmRejectedStatusOfQC.push(p);

            //Reset the newForm
            this.newForm.reset();
            $("#newRejectedStatusQCCancelModal").trigger("click");


            this.calculateNoOfPages();
          }, (error) => {
            console.log(error);
          });


          Swal.fire(
            'Append!',
            'Your data is updated on production',
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

  onEditClick(event, RejectedStatusParam: CancelledPOTransactionStatus) {
    //Reset the editForm
    this.editForm.reset();
    setTimeout(() => {
      //Set data into editForm
      this.editForm.patchValue(RejectedStatusParam);
      this.editIndex = this.rmRejectedStatusOfQC.indexOf(RejectedStatusParam);

      //Focus the ClientLocation textbox in editForm
      this.defaultTextBox_Edit.nativeElement.focus();
    }, 100);
  }

  onUpdateClick() {
    if (this.editForm.valid) {
      var Status = this.UpdateRejectStatusQCDescription.nativeElement.value;
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
          this.cancelledPOTransactionStatusService.updateDataStatus(this.editForm.value).subscribe((response: CancelledPOTransactionStatus) => {
            //Update the response in Grid
            this.rmRejectedStatusOfQC[this.editIndex] = response;

            //Reset the editForm
            this.editForm.reset();
            $("#editRejectedStatusQCCancelModal").trigger("click");
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

  onDeleteClick(event, CancelledPOTransactionStatus: CancelledPOTransactionStatus) {
    //Set data into deleteClientLocation
    this.deleteRejectStatus.id = CancelledPOTransactionStatus.id;
    this.deleteRejectStatus.status_name = CancelledPOTransactionStatus.status_name;
    this.deleteIndex = this.rmRejectedStatusOfQC.indexOf(CancelledPOTransactionStatus);
  }

  onDeleteConfirmClick() {
    var StatusofRm = this.DeleteRejectStatusQCDescription.nativeElement.value;
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
        this.cancelledPOTransactionStatusService.deleteDataStatus(this.deleteRejectStatus.id).subscribe(
          (response) => {
            //Delete object in Grid
            this.rmRejectedStatusOfQC.splice(this.deleteIndex, 1);

            //Clear deleteCountry
            this.deleteRejectStatus.id = null;
            this.deleteRejectStatus.status_name = null;
            this.deleteRejectStatus.is_active = null;

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
      this.getLists();
    }else{
      const status = this.rmRejectedStatusOfQC.filter(status => status.is_active === val);
      this.rmRejectedStatusOfQC = status;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }

  }

}
