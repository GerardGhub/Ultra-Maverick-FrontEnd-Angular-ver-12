import { OnChanges, ViewChild, Input, OnInit, ElementRef, Component, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from "../../../services/projects.service";
import { ClientLocation } from '../../../models/client-location';
import { ClientLocationsService } from '../../../services/client-locations.service';
import { NgForm } from '@angular/forms';
import * as $ from "jquery";
import { FilterPipe } from '../../../../app/pipes/filter.pipe';
import { Observable } from 'rxjs';
import { Project } from '../../../../app/models/project';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { LoginService } from '../../../../app/services/login.service';
import { RejectedStatus } from '../../../../app/models/rejected-status';
import { RejectedStatusService } from '../../../../app/services/rejected-status.service';
import { AllowablePercentage } from '../../../../app/models/allowable-percentage';
import { AllowablePercentageService } from '../../../../app/services/allowable-percentage.service';
import { CancelledPOTransactionStatus } from '../../../../app/models/cancelled-potransaction-status';
import { ReturnedPOTransactionStatusService } from '../../../../app/services/returned-potransaction-status.service';
import { ProjectComponent } from '../project/project.component';


@Component({
  selector: 'app-projects-cancelled-po',
  templateUrl: './projects-cancelled-po.component.html',
  styleUrls: ['./projects-cancelled-po.component.scss']
})
export class ProjectsCancelledPoComponent implements OnInit, OnChanges {
  @Input() child_id;
  @Output()
  uploaded = new EventEmitter<string>();


  projects: Project[] = [];
  cancelledPOlist: Project[] = [];
  clientLocations: Observable<ClientLocation[]>;
  showLoading: boolean = true;



  newProject: Project = new Project();
  editProject: Project = new Project();
  editIndex: number = null;
  deleteProject: Project = new Project();
  deleteIndex: number = null;
  searchBy: string = "ProjectName";
  searchText: string = "";
  ToDay: Date;
  ToDayforMaxDate: Date;

  activeUser: string = "";

  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;


  totalPoRowCount: number;

  totalCancelledPoRowCount: number = null;

  @ViewChild("newForm") newForm: NgForm;
  @ViewChild("editForm") editForm: NgForm;


  //sample
  msgrejectremarksno1: number = 0;
  msgrejectremarksno2: number = 0;
  msgrejectremarksno3: number = 0;

  totalRejectMaterial: string = null;
  //Calculator for Reject

  secondInput: number = 10;
  Deactivator: string = "0";
  Activator: string = "1";
  //FormGroup
  // ReceivijkForm: FormGroup;
  //date-picker

  // minDate: Date = new Date("2021-05-01");
  minDate = moment(new Date()).format('YYYY-MM-DD');
  maxDate = moment(new Date()).format('YYYY-MM-DD');

  // maxDate: Date = new Date("2010-12-31");


  dateHint: string = "Choose date of birth";
  startDate: Date = new Date("2002-01-01");

  //Sorting
  sortBy: string = "countryName";
  sortOrder: string = "ASC"; //ASC | DESC

  //Sample for Testing Status
  RejectStatuses: Observable<RejectedStatus[]>;

  CancelPoSummary: Observable<CancelledPOTransactionStatus[]>;
  //Objects for Holding Model Data

  AllowablePercentages: Observable<AllowablePercentage[]>;
  dateFilter(date) {
    return date && date.getDay() !== 0 && date.getDay() !== 6;
  }

  onDateChange() {
    // if (this.formGroup.value.dateOfBirth)
    // {
    //   let date = new Date(this.formGroup.value.dateOfBirth);
    //   this.dateHint = `You born on ${date.toString().substr(0, date.toString().indexOf(" "))}`;
    // }
    // else
    // {
    //   this.dateHint = "Choose date of birth";
    // }

  }




  constructor(private projectsService: ProjectsService, private clientLocationsService: ClientLocationsService, private toastr: ToastrService, public loginService: LoginService,
    private rejectedStatusService: RejectedStatusService, private allowablePercentageService: AllowablePercentageService,
    private returnedPOTransactionStatusService: ReturnedPOTransactionStatusService,
    private projectComponent: ProjectComponent) {
  }

  ngOnChanges() {
    // create header using child_id
    console.log(this.child_id);
    console.log("Child");

    this.getPOcancelledList();

  }
  any(event: any) {
    alert("Hello There");
    this.uploaded.emit('complete');
  }


  ngOnInit() {

    this.getPOcancelledList();
    this.getPOrecievingList();
    this.loginService.detectIfAlreadyLoggedIn(); //detect already Login
    this.ToDay = new Date();
    this.activeUser = this.loginService.currentUserName;
    // debugger;


    this.clientLocations = this.clientLocationsService.getClientLocations();

    //

    // Here
    this.RejectStatuses = this.rejectedStatusService.getListOfStatusOfReject();
    // Here
    this.CancelPoSummary = this.returnedPOTransactionStatusService.getListOfStatusOfData();
    //

    this.HideRejectRowUsingJquery();


    //Call the PercentaGE aLLOWABLE
    this.AllowablePercentages = this.allowablePercentageService.getAllAlowablePercentage();



  }

  getPOcancelledList() {
    this.projectsService.getAllProjectsCancelView()
      .subscribe(
        (response: Project[]) => {
          // debugger;

          this.cancelledPOlist = response;

          this.showLoading = false;
          this.calculateNoOfPages();
          this.totalCancelledPoRowCount = response.length;
        }
      );
  }

  getPOrecievingList() {
    this.projectsService.getAllProjects()
      .subscribe(
        (response: Project[]) => {
          // debugger;
          this.projects = response;
          this.showLoading = false;
          this.calculateNoOfPages();
          this.totalPoRowCount = response.length;
        }
      );
  }

  poRecievingTabforRefresh(val) {
    this.getPOcancelledList();
    this.getPOrecievingList();

  }


  jqueryClearanceTextBox() {
    $("rejectRow1").val("");
    $("rejectRow2").val("");
    $("rejectRow3").val("");
  }
  HideRejectRowUsingJquery() {
  }

  @ViewChild("prjID") prjID: ElementRef;
  @ViewChild("IsActivated") IsActivated: ElementRef;
  @ViewChild("received_by") received_by: ElementRef;
  //Rejection Children
  @ViewChild("rejectNo1") rejectNo1: ElementRef;
  @ViewChild("rejectNo2") rejectNo2: ElementRef;
  @ViewChild("rejectNo3") rejectNo3: ElementRef;
  @ViewChild("confirmReject") confirmReject: ElementRef;
  @ViewChild("rejectIsnotMactchSpanTag") rejectIsnotMactchSpanTag: ElementRef;
  @ViewChild("totalofReject") totalofReject: ElementRef;
  @ViewChild("rejectedStatusElementNo3") rejectedStatusElementNo3: ElementRef;
  //Percentage Computation
  @ViewChild("ActiveAllowablePercentage") ActiveAllowablePercentage: ElementRef;
  @ViewChild("TotalAllowablePercentage") TotalAllowablePercentage: ElementRef;
  @ViewChild("ExpectedDeliveryActual") ExpectedDeliveryActual: ElementRef;
  //Expiry Date
  @ViewChild("ExpiryDateChild") ExpiryDateChild: ElementRef;
  //Actual Delivery
  @ViewChild("ActualDeliveryChild") ActualDeliveryChild: ElementRef;
  //Rejected Status Remarks
  @ViewChild("RejectedStatus1") RejectedStatus1: ElementRef;
  @ViewChild("RejectedStatus2") RejectedStatus2: ElementRef;
  @ViewChild("RejectedStatus3") RejectedStatus3: ElementRef;
  //Item Code & Item Description
  @ViewChild("ItemDescription") ItemDescription: ElementRef;
  @ViewChild("PONumber") PONumber: ElementRef;

  //Reason Selected
  //  @ViewChild("ReasonSelected") ReasonSelected : ElementRef;

  showLimitonAddingRejection() {
    this.toastr.info('You already reached the limit!', 'Notifications');
  }
  HideSearchBtn(event: any) {
    $("#SearchBtnDetailed").show();

  }
  onSearchTextKeyup(event) {
    this.calculateNoOfPages();
  }
  onPageIndexClicked(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

  selectExpiryDate(event: any) {
    // JavaScript program to illustrate
    // calculation of no. of days between two date

    // To set two dates to two variables
    var date1 = new Date($('#txtEditReceivingDate').val());
    var date2 = new Date($('#txtEditexpiration_date').val());

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    //To display the final no. of days (result)
    // document.write("Total number of days between dates  <br>"
    //                + date1 + "<br> and <br>"
    //                + date2 + " is: <br> "
    //                + Difference_In_Days);




    if (Difference_In_Days < 30) {

      Swal.fire({
        title: 'Are you sure you want to update the details item expiry at ' + Difference_In_Days + ' Days?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ExpiryDateChild.nativeElement.value = "";
          this.ExpiryDateChild.nativeElement.focus();
          // if (this.editForm.valid)
          // {
          //     this.UpdateClickDetails();
          // }
          // else
          // {
          //   this.FieldOutRequiredField();
          // }

          // Swal.fire(
          //   'Updated!',
          //   'Your data has been updated.',
          //   'success'
          // )
        }
      })
    }
    else {

    }
  }


  CancelledPoDetails() {

    var Item = this.ItemDescription.nativeElement.value;
    var PoNumero = this.PONumber.nativeElement.value;

    Swal.fire({
      title: 'Are you sure you want to return the PO Number ' + PoNumero + '?',
      text: Item,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateDeactivatedTransactions();
      }
    })
  }

  UpdateDeactivatedTransactions() {

    this.projectsService.updateProject(this.editProject).subscribe((response: Project) => {
      var p: Project = new Project();
      p.projectID = response.projectID;
      p.projectName = response.projectName;
      p.dateOfStart = response.dateOfStart;
      p.teamSize = response.teamSize;
      p.clientLocation = response.clientLocation;
      p.active = response.active;
      p.clientLocationID = response.clientLocationID;
      p.status = response.status;
      p.supplier = response.supplier;
      p.item_code = response.item_code;
      p.item_description = response.item_description;
      p.po_number = response.po_number;
      p.po_date = response.po_date;
      p.pr_number = response.pr_number;
      p.pr_date = response.pr_date;
      p.qty_order = response.qty_order;
      p.qty_uom = response.qty_uom;
      p.mfg_date = response.mfg_date;
      p.expiration_date = response.expiration_date;
      p.expected_delivery = response.expected_delivery;
      p.actual_delivery = response.actual_delivery;
      p.expected_delivery = response.expected_delivery;
      p.actual_remaining_receiving = response.actual_remaining_receiving;
      p.status_of_reject_one = response.status_of_reject_one;
      p.status_of_reject_two = response.status_of_reject_two;
      p.status_of_reject_three = response.status_of_reject_three;
      p.count_of_reject_one = response.count_of_reject_one;
      p.count_of_reject_two = response.count_of_reject_two;
      p.count_of_reject_three = response.count_of_reject_three;
      p.total_of_reject_mat = response.total_of_reject_mat;
      this.projects[this.editIndex] = p;
      this.editProject.projectID = 0;
      this.editProject.projectName = "";
      this.editProject.dateOfStart = "";
      this.editProject.teamSize = 0;
      this.editProject.supplier = "";
      this.editProject.active = false;
      this.editProject.clientLocationID = 0;
      this.editProject.status = "";
      this.editProject.item_code = "";
      this.editProject.item_description = "";
      this.editProject.po_number = "";
      this.editProject.po_date = "";
      this.editProject.pr_number = "";
      this.editProject.pr_date = "";
      this.editProject.qty_order = "";
      this.editProject.qty_uom = "";
      this.editProject.mfg_date = "";
      this.editProject.expiration_date = "";
      this.editProject.expected_delivery = "";
      this.editProject.actual_delivery = "";
      this.editProject.actual_remaining_receiving = 0;
      this.editProject.received_by_QA = "";
      this.editProject.is_activated = "";
      this.editProject.status_of_reject_one = "";
      this.editProject.status_of_reject_two = "";
      this.editProject.status_of_reject_three = "";
      this.editProject.count_of_reject_one = "";
      this.editProject.count_of_reject_two = "";
      this.editProject.count_of_reject_three = "";
      this.editProject.total_of_reject_mat = "";
      this.editProject.returned_date = null;

      //  this.showDeactivatedSuccess();
      this.getPOcancelledList();

      this.showReturnedSuccess();
      this.getPOrecievingList();
      //
      this.uploaded.emit('complete');

      // this.ngOnInit();
      $("#editFormCancel").trigger("click");
    },
      (error) => {
        console.log(error);
      });

  }

  onCancelClick(event, index: number) {
    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.currentUserName;

    //first
    this.projectsService.getAllProjectsCancelView()
      .subscribe(
        (response: Project[]) => {
          // debugger;

          this.projects = response;

        }
      );
    //Last
    setTimeout(() => {
      this.editProject.projectID = this.projects[index].projectID;
      this.editProject.projectName = this.projects[index].projectName;
      this.editProject.dateOfStart = this.projects[index].dateOfStart.split("/").reverse().join("-"); //yyyy-MM-dd
      this.editProject.teamSize = this.projects[index].teamSize;
      this.editProject.active = this.projects[index].active;
      this.editProject.clientLocationID = this.projects[index].clientLocationID;
      this.editProject.clientLocation = this.projects[index].clientLocation;
      this.editProject.status = this.projects[index].status;
      this.editProject.supplier = this.projects[index].supplier;
      this.editProject.item_code = this.projects[index].item_code;
      this.editProject.item_description = this.projects[index].item_description;
      this.editProject.po_number = this.projects[index].po_number;
      this.editProject.po_date = this.projects[index].po_date;
      this.editProject.pr_number = this.projects[index].pr_number;
      this.editProject.pr_date = this.projects[index].pr_date;
      this.editProject.qty_order = this.projects[index].qty_order;
      this.editProject.qty_uom = this.projects[index].qty_uom;
      this.editProject.mfg_date = this.projects[index].mfg_date;
      this.editProject.expiration_date = this.projects[index].expiration_date;
      this.editProject.expected_delivery = this.projects[index].expected_delivery;
      this.editProject.actual_delivery = this.projects[index].actual_delivery;
      this.editProject.actual_remaining_receiving = this.projects[index].actual_remaining_receiving;
      this.editProject.is_activated = this.Activator;
      this.editProject.returned_date = this.ToDay;
      this.editProject.returned_by = this.activeUser;
      this.editProject.received_by_QA = this.projects[index].received_by_QA;
      this.editProject.cancelled_date = this.projects[index].cancelled_date;
      this.editProject.canceled_by = this.projects[index].canceled_by;
      this.editProject.cancelled_reason = this.projects[index].cancelled_reason;
      this.editProject.status_of_reject_one = this.projects[index].status_of_reject_one;
      this.editProject.status_of_reject_two = this.projects[index].status_of_reject_two;
      this.editProject.status_of_reject_three = this.projects[index].status_of_reject_three;
      this.editProject.count_of_reject_one = this.projects[index].count_of_reject_one;
      this.editProject.count_of_reject_two = this.projects[index].count_of_reject_two;
      this.editProject.count_of_reject_three = this.projects[index].count_of_reject_three;
      this.editProject.total_of_reject_mat = this.projects[index].total_of_reject_mat;
      this.editIndex = index;

    }, 100);
  }


  onEditClick(event, index: Project) {
    // this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.currentUserName;

    //first
    this.projectsService.getAllProjectsCancelView()
      .subscribe(
        (response: Project[]) => {
          this.projects = response;
        }
      );
    //Last
    setTimeout(() => {
      this.editProject.projectID = index.projectID;
      this.editProject.projectName = index.projectName;
      this.editProject.dateOfStart = index.dateOfStart.split("/").reverse().join("-"); //yyyy-MM-dd
      this.editProject.teamSize = index.teamSize;
      this.editProject.active = index.active;
      this.editProject.clientLocationID = index.clientLocationID;
      this.editProject.clientLocation = index.clientLocation;
      this.editProject.status = index.status;
      this.editProject.supplier = index.supplier;
      this.editProject.item_code = index.item_code;
      this.editProject.item_description = index.item_description;
      this.editProject.po_number = index.po_number;
      this.editProject.po_date = index.po_date;
      this.editProject.pr_number = index.pr_number;
      this.editProject.pr_date = index.pr_date;
      this.editProject.qty_order = index.qty_order;
      this.editProject.qty_uom = index.qty_uom;
      this.editProject.mfg_date = index.mfg_date;
      this.editProject.expiration_date = index.expiration_date;
      this.editProject.expected_delivery = index.expected_delivery;
      this.editProject.actual_delivery = index.actual_delivery;
      this.editProject.actual_remaining_receiving = index.actual_remaining_receiving;
  

      this.editProject.received_by_QA = index.received_by_QA;

      this.editProject.status_of_reject_one = index.status_of_reject_one;
      this.editProject.status_of_reject_two = index.status_of_reject_two;
      this.editProject.status_of_reject_three = index.status_of_reject_three;

      this.editProject.count_of_reject_one = index.count_of_reject_one;
      this.editProject.count_of_reject_two = index.count_of_reject_two;
      this.editProject.count_of_reject_three = index.count_of_reject_three;
      this.editProject.total_of_reject_mat = index.total_of_reject_mat;
 

      this.totalRejectMaterial = index.total_of_reject_mat;
      // this.editIndex = index;

    }, 100);
  }


  onAddAdditionalRejectRow(event: any) {


    if ($("#rejectionrow1").is(":visible")) {
      // alert("The paragraph  is visible.");

      if ($("#rejectionrow2").is(":visible")) {
        // alert("The paragraph  is visible.");
        if ($("#rejectionrow3").is(":visible")) {
          // alert("The paragraph  is visible.");
          // alert("Limit  is exceed!");
          this.showLimitonAddingRejection();
        }
        else {
          // alert("The paragraph  is hidden.");
          $("#rejectionrow3").show();
          $("#rejectionrow32").show();
          $("#total-reject").show();
          $("#total-confirm-reject").show();
          $("#AddRejectBtn").hide();
        }


      }
      else {
        // alert("The paragraph  is hidden.");
        $("#rejectionrow2").show();
        $("#rejectionrow22").show();
        $("#total-reject").show();
        $("#total-confirm-reject").show()

      }



    }
    else {
      // alert("The paragraph  is hidden.");
      $("#rejectionrow1").show();
      $("#rejectionrow12").show();
      $("#remove-remarks-button").show();
      $("#total-reject").show();
      $("#total-confirm-reject").show()
    }


  }


  onRemoveAdditionalRejectRow(event: any) {

    if ($("#rejectionrow3").is(":visible")) {
      // alert("The paragraph  is visible.");
      $("#rejectionrow3").hide();
      $("#rejectionrow32").hide();
    }
    else {
      // alert("The paragraph  is hidden.");

      if ($("#rejectionrow2").is(":visible")) {
        // alert("The paragraph  is visible.");
        $("#rejectionrow2").hide();
        $("#rejectionrow22").hide();
        $("#remove-remarks-button").show();


      }
      else {
        // alert("The paragraph  is hidden.");
        if ($("#rejectionrow1").is(":visible")) {
          // alert("The paragraph  is visible.");
          $("#rejectionrow1").hide();
          $("#rejectionrow12").hide();
          $("#remove-remarks-button").hide();
          $("#total-reject").hide();
          $("#total-confirm-reject").hide();


        }
        else {
          // alert("The paragraph  is hidden.");

        }

      }


    }
    //Reloading Add Button
    if ($("#AddRejectBtn").is(":visible")) {

    }
    else {
      $("#AddRejectBtn").show();
    }

  }

  onChangeEventReject3(event: any) {

    if (this.rejectNo3.nativeElement.value == "") {
      this.rejectNo3.nativeElement.value = "0";
      console.warn("Empty Quantity in the textInput! ")
    }

    console.log(event.target.value);
    const a = this.rejectNo1.nativeElement.value;
    const b = this.rejectNo2.nativeElement.value;
    const c = this.rejectNo3.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const TotalReject = this.totalofReject.nativeElement.value;
    const summary = +a + +b + +c;
    console.log(summary);
    this.totalofReject.nativeElement.value = summary;
    // alert("You change a value 3");

    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {
      // alert("A");
    }
    else {
      this.RejectionGreaterThanReceiving();
    }

  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }

  }

  showUpdatingSuccess() {
    this.toastr.success('Successfully Updated!', 'Notifications');
  }
  FieldOutRequiredField() {
    this.toastr.warning('Field out the required fields!', 'Notifications');
  }
  totalRejectConfirmationField() {
    this.toastr.warning('Confirm the total number of reject!', 'Notifications');
  }

  showDeletedSuccess() {
    this.toastr.success('Successfully Deleted!', 'Notifications');
  }
  showDeactivatedSuccess() {
    this.toastr.success('Successfully Deactivated!', 'Notifications');
  }
  showReturnedSuccess() {
    this.toastr.success('Successfully Returned!', 'Notifications');
  }

  AllowablePercentageExceed() {
    this.toastr.warning('Allowable Percentage Exceed!', 'Notifications');
  }
  MultipleSelectionOfRejectionStatus() {
    this.toastr.warning('Allowable Rejection Status Exceed!', 'Notifications');
  }
  RejectionGreaterThanReceiving() {
    this.toastr.warning('Rejection Qty Greather than Actual Receiving!', 'Notifications');
  }

  ConfirmNoofReject(event: any) {
    // alert("You Press a key in the Keyboard");

    if (this.confirmReject.nativeElement.value == "") {
      this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "";
    }
    else {
      if (this.totalofReject.nativeElement.value == this.confirmReject.nativeElement.value) {
        // this.rejectNo3.nativeElement.value="0";
        // this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "Pexa Marian";
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "";
      }
      else {
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "No. of reject is not match";
      }
    }

  }


  AllowablePercentageComputation(event: any) {
    // Allowable Percentage Computation
    const ExpectedDelivery = this.ExpectedDeliveryActual.nativeElement.value;
    const ActivatedAllowablePercentage = this.ActiveAllowablePercentage.nativeElement.value;

    if (this.ActiveAllowablePercentage.nativeElement.value == "10") {
      const summary = ExpectedDelivery * 1.10;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    }
    else if (this.ActiveAllowablePercentage.nativeElement.value == "20") {
      const summary = ExpectedDelivery * 1.20;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    }
    else if (this.ActiveAllowablePercentage.nativeElement.value == "30") {
      const summary = ExpectedDelivery * 1.30;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    }
    else if (this.ActiveAllowablePercentage.nativeElement.value == "40") {
      const summary = ExpectedDelivery * 1.40;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    }
    else if (this.ActiveAllowablePercentage.nativeElement.value == "50") {
      const summary = ExpectedDelivery * 1.50;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    }
    else {

    }

  }


  ActualDeliveryComputation(event: any) {
    // Allowable Percentage Computation
    const TotalAllowablePercentage = this.TotalAllowablePercentage.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;

    if (ActualDelivered > TotalAllowablePercentage) {
      this.AllowablePercentageExceed();
    }
  }
  onChangeEventReject1(event: any) {

    if (this.rejectNo1.nativeElement.value == "") {
      this.rejectNo1.nativeElement.value = "0";
    }
    // console.log(event.target.value);
    const a = this.rejectNo1.nativeElement.value;
    const b = this.rejectNo2.nativeElement.value;
    const c = this.rejectNo3.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const TotalReject = this.totalofReject.nativeElement.value;
    const summary = +a + +b + +c;
    // console.log(summary);
    this.totalofReject.nativeElement.value = summary;
    // alert("You change a value 1");

    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {
      // alert("A");
    }
    else {
      this.RejectionGreaterThanReceiving();
    }

  }


  onChangeEventReject2(event: any) {

    if (this.rejectNo2.nativeElement.value == "") {
      this.rejectNo2.nativeElement.value = "0";
      console.warn("Empty Quantity in the textInput! ")
    }

    console.log(event.target.value);
    const a = this.rejectNo1.nativeElement.value;
    const b = this.rejectNo2.nativeElement.value;
    const c = this.rejectNo3.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const TotalReject = this.totalofReject.nativeElement.value;
    const summary = +a + +b + +c;
    console.log(summary);
    this.totalofReject.nativeElement.value = summary;
    // alert("You change a value 2");

    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {
      // alert("A");
    }
    else {
      this.RejectionGreaterThanReceiving();
    }

  }

  
  Alerto() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultProjects = filterPipe.transform
      (this.projects, this.searchBy, this.searchText);
    var noOfPages = Math.ceil(resultProjects.length / this.pageSize);

    this.pages = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }



}

