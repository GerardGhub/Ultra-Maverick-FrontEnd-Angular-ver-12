import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AllowablePercentage } from 'src/app/models/allowable-percentage';
import { CancelledPOTransactionStatus } from 'src/app/models/cancelled-potransaction-status';
import { Project } from 'src/app/models/project';
import { RejectedStatus } from 'src/app/models/rejected-status';
import { AllowablePercentageService } from 'src/app/services/allowable-percentage.service';
import { CancelledPOTransactionStatusService } from 'src/app/services/cancelled-potransaction-status.service';
import { ClientLocationsService } from 'src/app/services/client-locations.service';
import { LoginService } from 'src/app/services/login.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { RejectedStatusService } from 'src/app/services/rejected-status.service';
import * as $ from 'jquery';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ProjectComponent } from '../project/project.component';
import Swal from 'sweetalert2';
import { ClientLocation } from 'src/app/models/client-location';
import { ProjetPONearlyExpiryApprovalService } from 'src/app/services/projet-ponearly-expiry-approval.service';
import { PartialPoService } from '../projects-partial-po/services/partialPOmodule.service';
import { NearlyExpiryService } from './services/nearly-expiry.service';
// import { POINT_CONVERSION_COMPRESSED } from 'constants';

@Component({
  selector: 'app-projet-ponearly-expiry-approval',
  templateUrl: './projet-ponearly-expiry-approval.component.html',
  styleUrls: ['./projet-ponearly-expiry-approval.component.scss'],
})
export class ProjetPONearlyExpiryApprovalComponent implements OnInit {

  constructor(
    private projectsService: ProjectsService,
    private clientLocationsService: ClientLocationsService,
    private toastr: ToastrService,
    public loginService: LoginService,
    private rejectedStatusService: RejectedStatusService,
    private allowablePercentageService: AllowablePercentageService,
    private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService,
    private projetPONearlyExpiryApprovalService: ProjetPONearlyExpiryApprovalService,
    private partialPOService : PartialPoService,
    private nearlyExpiryService : NearlyExpiryService,
    private formBuilder: FormBuilder,
  ) {}


  projects: any = [];
  ChecklistViewing: any = [];
  clientLocations: Observable<ClientLocation[]>;
  showLoading: boolean = true;

  newProject: Project = new Project();
  editProject: Project = new Project();
  editIndex: number = null;
  deleteProject: Project = new Project();
  deleteIndex: number = null;
  searchBy: string = 'ProjectName';
  searchText: string = '';
  ToDay: Date;
  ToDayforMaxDate: Date;

  activeUser: string = '';
  PoNumberBinding: string = '';
  NullableEmptyString: string = '';

  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  totalPoRowCount: number = null;

  @ViewChild('newForm') newForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;
  viewForm: FormGroup;

  //sample
  msgrejectremarksno1: number = 0;
  msgrejectremarksno2: number = 0;
  msgrejectremarksno3: number = 0;

  //Boolean Que Selector
  Selector: number = 0;
  //Calculator for Reject

  secondInput: number = 10;
  Deactivator: string = '0';
  Activator: string = '1';
  ActualRemaining: number = 0;
  //FormGroup
  // ReceivijkForm: FormGroup;
  //date-picker

  // minDate: Date = new Date("2021-05-01");
  minDate = moment(new Date()).format('YYYY-MM-DD');
  maxDate = moment(new Date()).format('YYYY-MM-DD');

  // maxDate: Date = new Date("2010-12-31");

  dateHint: string = 'Choose date of birth';
  startDate: Date = new Date('2002-01-01');

  //Sorting
  sortBy: string = 'countryName';
  sortOrder: string = 'ASC'; //ASC | DESC

  //Sample for Testing Status
  RejectStatuses: Observable<RejectedStatus[]>;

  CancelPoSummary: Observable<CancelledPOTransactionStatus[]>;
  //Objects for Holding Model Data

  AllowablePercentages: Observable<AllowablePercentage[]>;

  ProjectsAllowableQty: Observable<Project[]>;
  isAllChecked: boolean = false;
  fullName: string = '';
  totalRejectMaterial: string = null;





  @ViewChildren('prj') projs: QueryList<ProjectComponent>;
  @ViewChild('prjID') prjID: ElementRef;
  @ViewChild('IsActivated') IsActivated: ElementRef;
  @ViewChild('received_by') received_by: ElementRef;
  //Rejection Children
  @ViewChild('rejectNo1') rejectNo1: ElementRef;
  @ViewChild('rejectNo2') rejectNo2: ElementRef;
  @ViewChild('rejectNo3') rejectNo3: ElementRef;
  @ViewChild('confirmReject') confirmReject: ElementRef;
  @ViewChild('rejectIsnotMactchSpanTag') rejectIsnotMactchSpanTag: ElementRef;
  @ViewChild('totalofReject') totalofReject: ElementRef;
  @ViewChild('rejectedStatusElementNo3') rejectedStatusElementNo3: ElementRef;
  //Percentage Computation
  @ViewChild('ActiveAllowablePercentage') ActiveAllowablePercentage: ElementRef;
  @ViewChild('TotalAllowablePercentage') TotalAllowablePercentage: ElementRef;
  @ViewChild('ExpectedDeliveryActual') ExpectedDeliveryActual: ElementRef;
  //Expiry Date
  @ViewChild('ExpiryDateChild') ExpiryDateChild: ElementRef;
  //Actual Delivery
  @ViewChild('ActualDeliveryChild') ActualDeliveryChild: ElementRef;
  //Rejected Status Remarks
  @ViewChild('RejectedStatus1') RejectedStatus1: ElementRef;
  @ViewChild('RejectedStatus2') RejectedStatus2: ElementRef;
  @ViewChild('RejectedStatus3') RejectedStatus3: ElementRef;
  //Remaing Computation

  @ViewChild('QtyOrdered') QtyOrdered: ElementRef;
  //Dream
  @ViewChild('ActualRemainingReceiving') ActualRemainingReceiving: ElementRef;
  //PO  Number
  @ViewChild('PoNumberChild') PoNumberChild: ElementRef;
  //Item Description
  @ViewChild('ItemDesc') ItemDesc: ElementRef;
  //Expiry
  @ViewChild('DaystoExpiry') DaystoExpiry: ElementRef;


  ngOnInit() {
    this.getList();
    this.reactiveForms();

    this.ToDay = new Date();
    this.activeUser = this.loginService.currentUserName;
    this.fullName = this.loginService.fullName;

    this.clientLocations = this.clientLocationsService.getClientLocations();
    this.RejectStatuses = this.rejectedStatusService.getListOfStatusOfReject();
    this.CancelPoSummary = this.cancelledPOTransactionStatusService.getListOfStatusOfData();
    this.AllowablePercentages = this.allowablePercentageService.getAllAlowablePercentage();
  }

  // REACTIVE FORMS ************************************************************************************************************
  reactiveForms(){
    this.viewForm = this.formBuilder.group({
      trans_ID: this.formBuilder.control(null, [Validators.required]),
      item_code: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),

      item_desc: this.formBuilder.control(null, [Validators.required]),
      supplier: this.formBuilder.control(null, [Validators.required]),
      po_number: this.formBuilder.control(null, [Validators.required]),

      pr_number: this.formBuilder.control(null, [Validators.required]),
      quantity_ordered: this.formBuilder.control(null, [Validators.required]),
      mftg_date: this.formBuilder.control(null, [Validators.required]),

      expected_delivery: this.formBuilder.control(null, [Validators.required]),
      remaining_needed: this.formBuilder.control(null, [Validators.required]),
      po_date: this.formBuilder.control(null, [Validators.required]),
      pr_date: this.formBuilder.control(null, [Validators.required]),

      uom: this.formBuilder.control(null, [Validators.required]),
      expiry_date: this.formBuilder.control(null, [Validators.required]),
      actual_delivered: this.formBuilder.control(null, [Validators.required]),
      total_reject: this.formBuilder.control(null, [Validators.required])
    });
  }

  // POPULATE FIELDS ***********************************************************************************************************
  onViewClick(item: any, index: number){

    this.totalRejectMaterial = item.total_of_reject_mat;

    this.viewForm.patchValue({
      trans_ID: item.projectID,
      item_code: item.item_code,
      recieving_date: item.dateOfStart,
      item_desc: item.projectName,
      supplier: item.supplier,

      po_number: item.po_number,
      pr_number: item.pr_number,
      quantity_ordered: item.qty_order,
      mftg_date: moment(new Date(item.mfg_date)).format('MM/DD/YYYY'),

      expected_delivery: item.expected_delivery,
      remaining_needed: item.actual_remaining_receiving,
      po_date:  moment(new Date(item.po_date)).format('MM/DD/YYYY'),
      pr_date: moment(new Date(item.pr_date )).format('MM/DD/YYYY'),

      uom: item.qty_uom,
      expiry_date: moment(new Date(item.expiration_date )).format('MM/DD/YYYY'),
      actual_delivered: item.actual_delivery,
      total_reject: item.total_of_reject_mat
    })

    this.partialPOService
      .viewPartialPoChecklist(item.projectID)
      .subscribe((response) => {
        this.ChecklistViewing = response;
      });
  }

  // CRUD **********************************************************************************************************************
  getList(){
    this.nearlyExpiryService.getList()
      .subscribe((response) => {
        if(response){
          this.projects = response;
          this.showLoading = false;
          this.calculateNoOfPages();
          this.totalPoRowCount = response.length;
        }
      });
  }



  dateFilter(date) {
    return date && date.getDay() !== 0 && date.getDay() !== 6;
  }

  jqueryClearanceTextBox() {
    $('rejectRow1').val('');
    $('rejectRow2').val('');
    $('rejectRow3').val('');
  }

  SelectionBindingCancel() {
    this.Selector = 1;
  }

  SelectionBindingApproval() {
    this.Selector = 2;
  }

  showLimitonAddingRejection() {
    this.toastr.info('You already reached the limit!', 'Notifications');
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
    this.toastr.success('Successfully Cancelled!', 'Notifications');
  }

  AllowablePercentageExceed() {
    this.toastr.warning('Allowable Percentage Exceed!', 'Notifications');
  }

  MultipleSelectionOfRejectionStatus() {
    this.toastr.warning('Allowable Rejection Status Exceed!', 'Notifications');
  }

  RejectionGreaterThanReceiving() {
    this.toastr.warning(
      'Rejection Qty Greather than Actual Receiving!',
      'Notifications'
    );
  }

  ExpiredItemValidation() {
    this.toastr.warning(
      'Cannot approve the item already expired!',
      'Notifications'
    );
  }

  Alerto() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultProjects = filterPipe.transform(
      this.projects,
      this.searchBy,
      this.searchText
    );
    var noOfPages = Math.ceil(resultProjects.length / this.pageSize);

    this.pages = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  isAllCheckedChange(event) {
    let proj = this.projs.toArray();
    for (let i = 0; i < proj.length; i++) {
      proj[i].isAllCheckedChange(this.isAllChecked);
    }
  }

  onNewClick(event) {
    this.newForm.resetForm();
    setTimeout(() => {
      this.received_by.nativeElement.value = this.loginService.currentUserName;
      this.IsActivated.nativeElement.value = '1';
      this.IsActivated.nativeElement.focus();
    }, 100);
  }

  onSaveClick() {
    if (this.newForm.valid) {
      this.newProject.clientLocation.clientLocationID = 0;
      this.newProject.is_activated = '1';
      this.projectsService.insertProject(this.newProject).subscribe(
        (response) => {
          //Add Project to Grid
          var p: Project = new Project();
          p.projectID = response.projectID;
          p.projectName = response.projectName;
          p.dateOfStart = response.dateOfStart;
          p.teamSize = response.teamSize;
          p.clientLocation = response.clientLocation;
          p.active = response.active;
          p.clientLocationID = response.clientLocationID;
          p.status = response.status;
          p.is_activated = response.is_activated;
          p.supplier = response.supplier;
          p.item_code = response.item_code;
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
          p.actual_remaining_receiving = response.actual_remaining_receiving;
          p.received_by_QA = response.received_by_QA;
          p.status_of_reject_one = response.status_of_reject_one;
          p.status_of_reject_two = response.status_of_reject_two;
          p.status_of_reject_three = response.status_of_reject_three;
          p.count_of_reject_one = response.count_of_reject_one;
          p.count_of_reject_two = response.count_of_reject_two;
          p.count_of_reject_three = response.count_of_reject_three;
          p.total_of_reject_mat = response.total_of_reject_mat;
          p.a_compliance = response.a_compliance;
          p.a_remarks = response.a_remarks;
          this.projects.push(p);

          //Clear New Project Dialog - TextBoxes

          this.newProject.projectName = null;
          this.newProject.dateOfStart = null;
          this.newProject.teamSize = null;
          this.newProject.active = false;
          this.newProject.clientLocationID = null;
          this.newProject.status = null;
          this.newProject.is_activated = null;
          this.newProject.supplier = null;
          this.newProject.item_code = null;
          this.newProject.po_number = null;
          this.newProject.po_date = null;
          this.newProject.pr_number = null;
          this.newProject.pr_date = null;
          this.newProject.qty_uom = null;
          this.newProject.qty_order = null;
          this.newProject.mfg_date = null;
          this.newProject.expiration_date = null;
          this.newProject.expected_delivery = null;
          this.newProject.actual_delivery = null;
          this.newProject.actual_remaining_receiving = null;
          this.newProject.received_by_QA = null;
          this.newProject.status_of_reject_one = null;
          this.newProject.status_of_reject_two = null;
          this.newProject.status_of_reject_three = null;
          this.newProject.count_of_reject_one = null;
          this.newProject.count_of_reject_two = null;
          this.newProject.count_of_reject_three = null;
          this.newProject.total_of_reject_mat = null;
          this.newProject.a_compliance = null;
          this.newProject.a_remarks = null;

          $('#newFormCancel').trigger('click');
          // this.ngOnInit();
          this.calculateNoOfPages();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  resetValueS() {
    this.rejectNo1.nativeElement.value = '0';
    this.rejectNo2.nativeElement.value = '0';
    this.rejectNo3.nativeElement.value = '0';
    this.confirmReject.nativeElement.value = '0';
    this.totalofReject.nativeElement.value = '0';
    this.jqueryClearanceTextBox();
  }

  onEditClick(event, index: number) {
    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.currentUserName;
    this.resetValueS();

    this.projetPONearlyExpiryApprovalService
      .getAllProjects()
      .subscribe((response: Project[]) => {
        this.projects = response;
      });

    setTimeout(() => {
      this.editProject.projectID = this.projects[index].projectID;
      this.editProject.projectName = this.projects[index].projectName;
      this.editProject.dateOfStart = this.projects[index].dateOfStart
        .split('/')
        .reverse()
        .join('-'); //yyyy-MM-dd

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
      this.editProject.is_activated = this.Activator;

      this.editProject.mfg_date = this.projects[index].mfg_date;
      this.editProject.expiration_date = this.projects[index].expiration_date;
      this.editProject.expected_delivery =
        this.projects[index].expected_delivery;

      this.editProject.actual_delivery = this.projects[index].actual_delivery;

      // this.editProject.actual_remaining_receiving = this.ActualRemaining;
      this.editProject.actual_remaining_receiving =
        this.projects[index].actual_remaining_receiving;
      this.editProject.received_by_QA = this.projects[index].received_by_QA;
      // this.editProject.total_of_reject_mat = this.totalofReject.nativeElement.

      // this.editProject.received_by_QA = this.projects[index].received_by_QA;




      //Days
      //  this.editProject.daysBeforeExpired = this.projects[index].daysBeforeExpired;
      //Cancel
      if (this.Selector == 1) {
        this.editProject.cancelled_date = this.ToDay;
        this.editProject.canceled_by = this.activeUser;
        this.editProject.cancelled_reason =
          this.projects[index].cancelled_reason;
        //aPproval to 1
        this.editProject.is_activated = this.Deactivator;
      } else {
        this.editProject.cancelled_date = this.projects[index].cancelled_date;
        this.editProject.canceled_by = this.projects[index].canceled_by;
        this.editProject.cancelled_reason =
          this.projects[index].cancelled_reason;
      }

      if (this.Selector == 2) {
        //Approval
        alert(this.editProject.projectID = this.projects[index].projectID);
        this.editProject.is_approved_date = this.ToDay;
        this.editProject.is_approved_by = this.activeUser;
        this.editProject.is_approved_XP = this.Activator;
      } else {
        this.editProject.is_approved_date =
          this.projects[index].is_approved_date;
        this.editProject.is_approved_by = this.projects[index].is_approved_by;
        this.editProject.is_approved_XP = this.projects[index].is_approved_XP;
      }

      //Calling The Projects for Qty Binding Servo IT Solutions
      this.PoNumberBinding = this.projects[index].po_number;
      // this.PoNumberChild.nativeElement.value;
      this.ProjectsAllowableQty = this.projectsService.SearchProjects(
        'Po_number',
        this.PoNumberBinding
      );
      this.editIndex = index;
    }, 100);
  }

  NearlyExpiryValidation() {
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
    document.write(
      'Total number of days between dates  <br>' +
        date1 +
        '<br> and <br>' +
        date2 +
        ' is: <br> ' +
        Difference_In_Days
    );

    return;
  }

  onUpdateClick() {
    // this.received_by.nativeElement.value=this.loginService.currentUserName;

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
      // alert(Difference_In_Days +"ss");

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Item Nearly Expiry at ' + Difference_In_Days + 'Days',
        showConfirmButton: false,
        timer: 6000,
      });
      // return;
    } else {
      // alert(Difference_In_Days);
    }

    //Laarnie
    if (
      this.totalofReject.nativeElement.value ==
      this.confirmReject.nativeElement.value
    ) {
    } else {
      this.totalRejectConfirmationField();
      this.rejectIsnotMactchSpanTag.nativeElement.innerHTML =
        'No. of reject is not match';
      this.confirmReject.nativeElement.focus();
      return;
    }

    // totalRejectConfirmationField();
    Swal.fire({
      title:
        'Are you sure you want to update the details item expiry at ' +
        Difference_In_Days +
        ' Days?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.editForm.valid) {
          this.UpdateClickDetails();
        } else {
          this.FieldOutRequiredField();
        }
      }
    });
  }

  //Computaion
  ComputeRemainingQty() {
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const QtyOrder = this.QtyOrdered.nativeElement.value;

    this.ActualRemaining = QtyOrder - ActualDelivered;
  }

  UpdateClickDetails() {
    if (this.editForm.valid) {
      //Additional Parse Data Master
      // this.ActualRemaining = 450;
      // this.ComputeRemainingQty();
      // this.editProject.actual_remaining_receiving = this.ActualRemaining;
      this.projetPONearlyExpiryApprovalService
        .updateProject(this.editProject)
        .subscribe(
          (response: Project) => {
            var p: Project = new Project();
            p.projectID = response.projectID;
            p.projectName = response.projectName;
            p.dateOfStart = response.dateOfStart;
            p.teamSize = response.teamSize;
            p.clientLocation = response.clientLocation;
            p.active = response.active;
            p.is_activated = response.is_activated;
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
            // this.ActualRemaining = response.actual_remaining_receiving;
            // p.received_by_QA = response.received_by_QA;
            // // this.activeUser = response.received_by_QA;
            p.status_of_reject_one = response.status_of_reject_one;
            p.status_of_reject_two = response.status_of_reject_two;
            p.status_of_reject_three = response.status_of_reject_three;
            p.count_of_reject_one = response.count_of_reject_one;
            p.count_of_reject_two = response.count_of_reject_two;
            p.count_of_reject_three = response.count_of_reject_three;
            p.total_of_reject_mat = response.total_of_reject_mat;
            //Section 1
            //A


            // this.received_by.nativeElement.value = this.loginService.currentUserName;
            this.projects[this.editIndex] = p;
            this.UpdateMasterTransactionsActualReceivingofCancel();
            // this.InsertANewPartialReceiving();
            this.editProject.projectID = null;
            this.editProject.projectName = null;
            this.editProject.dateOfStart = null;
            this.editProject.teamSize = null;
            this.editProject.supplier = null;
            this.editProject.active = false;
            this.editProject.clientLocationID = null;
            this.editProject.status = null;
            this.editProject.item_code = null;
            this.editProject.item_description = null;
            this.editProject.po_number = null;
            this.editProject.po_date = null;
            this.editProject.pr_number = null;
            this.editProject.pr_date = null;
            this.editProject.qty_order = null;
            this.editProject.qty_uom = null;
            this.editProject.mfg_date = null;
            this.editProject.expiration_date = null;
            this.editProject.expected_delivery = null;
            this.editProject.actual_delivery = null;
            this.editProject.actual_remaining_receiving = null;
            this.editProject.received_by_QA = null;
            this.editProject.status_of_reject_one = null;
            this.editProject.status_of_reject_two = null;
            this.editProject.status_of_reject_three = null;
            this.editProject.count_of_reject_one = null;
            this.editProject.count_of_reject_two = null;
            this.editProject.count_of_reject_three = null;
            this.editProject.total_of_reject_mat = null;
            //Section A
            //A

            //Add
            this.editProject.cancelled_date = null;
            this.editProject.canceled_by = null;
            this.editProject.cancelled_reason = null;
            this.showUpdatingSuccess();
            this.ngOnInit();
            $('#editFormCancel').trigger('click');
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  ApprovedClickDetails() {
    if (!this.editForm.valid) {

      this.editProject.is_activated = this.Activator;
      this.editProject.is_approved_XP = this.Activator;
      this.projetPONearlyExpiryApprovalService
        .updateProject(this.editProject)
        .subscribe(
          (response: Project) => {
            var p: Project = new Project();
        
            p.projectID = this.editProject.projectID    
            //Approval
            p.is_approved_XP = response.is_approved_XP;
            p.is_approved_by = response.is_approved_by;
            p.is_approved_date = response.is_approved_date;


            this.projects[this.editIndex] = p;
     
            this.editProject.projectID = null;

            //Section A



            //Approval
            this.editProject.is_approved_XP = null;
            this.editProject.is_approved_by = null;
            this.editProject.is_approved_date = null;
            this.showUpdatingSuccess();
            this.ngOnInit();
            $('#editFormCancel').trigger('click');
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  //Insert as Partial
  InsertANewPartialReceiving() {
    if (this.editForm.valid) {
      this.projetPONearlyExpiryApprovalService
        .insertProject2(this.editProject)
        .subscribe(
          (response: Project) => {
            var p: Project = new Project();
            p.primaryID = response.primaryID;
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
            //  p.actual_remaining_receiving = response.actual_remaining_receiving;

            // p.received_by_QA = response.received_by_QA;
            // // this.activeUser = response.received_by_QA;
            p.status_of_reject_one = response.status_of_reject_one;
            p.status_of_reject_two = response.status_of_reject_two;
            p.status_of_reject_three = response.status_of_reject_three;
            p.count_of_reject_one = response.count_of_reject_one;
            p.count_of_reject_two = response.count_of_reject_two;
            p.count_of_reject_three = response.count_of_reject_three;
            p.total_of_reject_mat = response.total_of_reject_mat;
            //Section 1
            //A

            this.projects.push(p);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  UpdateSweetAlertMessage() {
    Swal.fire('Updated!', 'Your data has been updated.', 'success');
  }

  onDeleteClick(event, index: number) {
    this.deleteIndex = index;
    this.deleteProject.projectID = this.projects[index].projectID;
    this.deleteProject.projectName = this.projects[index].projectName;
    this.deleteProject.dateOfStart = this.projects[index].dateOfStart;
    this.deleteProject.teamSize = this.projects[index].teamSize;
    this.deleteProject.supplier = this.projects[index].supplier;
    this.deleteProject.item_code = this.projects[index].item_code;
    this.deleteProject.item_description = this.projects[index].item_description;
    this.deleteProject.po_number = this.projects[index].po_number;
    this.deleteProject.po_date = this.projects[index].po_date;
    this.deleteProject.pr_number = this.projects[index].pr_number;
    this.deleteProject.pr_date = this.projects[index].pr_date;
    this.deleteProject.qty_uom = this.projects[index].qty_uom;
    this.deleteProject.qty_order = this.projects[index].qty_order;
    this.deleteProject.mfg_date = this.projects[index].mfg_date;
    this.deleteProject.expiration_date = this.projects[index].expiration_date;
    this.deleteProject.expected_delivery =
      this.projects[index].expected_delivery;
    this.deleteProject.actual_delivery = this.projects[index].actual_delivery;
    this.deleteProject.actual_remaining_receiving =
      this.projects[index].actual_remaining_receiving;
    this.deleteProject.received_by_QA = this.projects[index].received_by_QA;
    this.deleteProject.status_of_reject_one =
      this.projects[index].status_of_reject_one;
    this.deleteProject.status_of_reject_two =
      this.projects[index].status_of_reject_two;
    this.deleteProject.status_of_reject_three =
      this.projects[index].status_of_reject_three;
    this.deleteProject.count_of_reject_one =
      this.projects[index].count_of_reject_one;
    this.deleteProject.count_of_reject_two =
      this.projects[index].count_of_reject_two;
    this.deleteProject.count_of_reject_three =
      this.projects[index].count_of_reject_three;
    this.deleteProject.total_of_reject_mat =
      this.projects[index].total_of_reject_mat;
    //SECTION 1

  }

  onDeleteConfirmClick() {
    Swal.fire({
      title: 'Are you sure the you to delete the selected data?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.OnDeleteDetails();
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        this.showDeletedSuccess();
      }
    });
  }

  CancelledPoDetails() {
    var Item = this.ItemDesc.nativeElement.value;
    Swal.fire({
      title: 'Are you sure you want to cancel the Transaction?',
      text: Item,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.UpdateDeactivatedTransactions();
      }
    });
  }

  ApprovedPoDetailsSweetAlert() {
    var Item = this.ItemDesc.nativeElement.value;
    Swal.fire({
      title: 'Are you sure you want to approve?',
      text: Item,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        // alert(this.editProject.projectID);
        this.ApprovedClickDetails();
      }
    });

    // }
  }

  onCancelClick(
    event,
    index: number
  ) {
    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.currentUserName;
    this.resetValueS();
    //first
    this.projetPONearlyExpiryApprovalService
      .getAllProjects()
      .subscribe((response: Project[]) => {
        // debugger;

        this.projects = response;
      });
    //Last
    setTimeout(() => {
      this.editProject.projectID = this.projects[index].projectID;
      this.editProject.projectName = this.projects[index].projectName;
      this.editProject.dateOfStart = this.projects[index].dateOfStart
        .split('/')
        .reverse()
        .join('-'); //yyyy-MM-dd
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
      this.editProject.expected_delivery =
        this.projects[index].expected_delivery;
      this.editProject.actual_delivery = this.projects[index].actual_delivery;
      this.editProject.actual_remaining_receiving =
        this.projects[index].actual_remaining_receiving;
      // this.editProject.received_by_QA = this.activeUser;
      this.editProject.is_activated = this.Deactivator;
      this.editProject.cancelled_date = this.ToDay;
      this.editProject.canceled_by = this.activeUser;
      this.editProject.received_by_QA = this.projects[index].received_by_QA;

      this.editProject.status_of_reject_one =
        this.projects[index].status_of_reject_one;
      this.editProject.status_of_reject_two =
        this.projects[index].status_of_reject_two;
      this.editProject.status_of_reject_three =
        this.projects[index].status_of_reject_three;

      this.editProject.count_of_reject_one =
        this.projects[index].count_of_reject_one;
      this.editProject.count_of_reject_two =
        this.projects[index].count_of_reject_two;
      this.editProject.count_of_reject_three =
        this.projects[index].count_of_reject_three;
      this.editProject.total_of_reject_mat =
        this.projects[index].total_of_reject_mat;
      //Section 1
  
      //Calling The Projects for Qty Binding Servo IT Solutions
      this.PoNumberBinding = this.projects[index].po_number;
  
      // this.editProject.daysBeforeExpired = this.projects[index].daysBeforeExpired;
      this.ProjectsAllowableQty = this.projectsService.SearchProjects(
        'Po_number',
        this.PoNumberBinding
      );
      this.editIndex = index;
      this.editIndex = index;
    }, 100);
  }

  UpdateDeactivatedTransactions() {
    this.UpdateClickDetails();
    // this.projetPONearlyExpiryApprovalService.updateProject(this.editProject).subscribe((response: Project) =>
    // {

    //   var p: Project = new Project();
    //   p.projectID = response.projectID;
    //   p.projectName = response.projectName;
    //   p.dateOfStart = response.dateOfStart;
    //   p.teamSize = response.teamSize;
    //   p.clientLocation = response.clientLocation;
    //   p.active = response.active;
    //   // p.is_activated = response.is_activated;
    //   p.clientLocationID = response.clientLocationID;
    //   p.status = response.status;
    //   p.supplier = response.supplier;
    //   p.item_code = response.item_code;
    //   p.item_description = response.item_description;
    //   p.po_number = response.po_number;
    //   p.po_date = response.po_date;
    //   p.pr_number = response.pr_number;
    //   p.pr_date = response.pr_date;
    //   p.qty_order = response.qty_order;
    //   p.qty_uom = response.qty_uom;
    //   p.mfg_date = response.mfg_date;
    //   p.expiration_date = response.expiration_date;
    //   p.expected_delivery = response.expected_delivery;
    //   p.actual_delivery = response.actual_delivery;
    //   p.expected_delivery = response.expected_delivery;
    //   // p.actual_remaining_receiving = response.actual_remaining_receiving; 9/30/2021
    //   // p.received_by_QA = response.received_by_QA;
    //   // // this.activeUser = response.received_by_QA;
    //   p.status_of_reject_one = response.status_of_reject_one;
    //   p.status_of_reject_two = response.status_of_reject_two;
    //   p.status_of_reject_three = response.status_of_reject_three;
    //   p.count_of_reject_one = response.count_of_reject_one;
    //   p.count_of_reject_two = response.count_of_reject_two;
    //   p.count_of_reject_three = response.count_of_reject_three;
    //   p.total_of_reject_mat = response.total_of_reject_mat;
    //   //Section 1

    //   // this.received_by.nativeElement.value = this.loginService.currentUserName;
    //   this.projects[this.editIndex] = p;
    //   this.UpdateMasterTransactionsActualReceivingofCancel();
    //   this.editProject.projectID = null;
    //   this.editProject.projectName = null;
    //   this.editProject.dateOfStart = null;
    //   this.editProject.teamSize = null;
    //   this.editProject.supplier = null;
    //   this.editProject.active = false;
    //   this.editProject.clientLocationID = null;
    //   this.editProject.status = null;
    //   this.editProject.item_code = null;
    //   this.editProject.item_description = null;
    //   this.editProject.po_number = null;
    //   this.editProject.po_date = null;
    //   this.editProject.pr_number = null;
    //   this.editProject.pr_date = null;
    //   this.editProject.qty_order = null;
    //   this.editProject.qty_uom = null;
    //   this.editProject.mfg_date = null;
    //   this.editProject.expiration_date = null;
    //   this.editProject.expected_delivery = null;
    //   this.editProject.actual_delivery = null;
    //   this.editProject.actual_remaining_receiving = null;
    //   this.editProject.received_by_QA = null;
    //   this.editProject.is_activated = null;
    //   this.editProject.status_of_reject_one = null;
    //   this.editProject.status_of_reject_two = null;
    //   this.editProject.status_of_reject_three = null;
    //   this.editProject.count_of_reject_one = null;
    //   this.editProject.count_of_reject_two = null;
    //   this.editProject.count_of_reject_three = null;
    //   this.editProject.total_of_reject_mat = null;

    //  this.showDeactivatedSuccess();
    //  this.ngOnInit();
    //   // $("#editFormCancel").trigger("click");
    // },
    //   (error) =>
    //   {
    //     console.log(error);
    //   });
  }

  UpdateMasterTransactionsActualReceivingofCancel() {
    //Singkit na mata
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;

    const ActualRemainingReceiving =
      this.ActualRemainingReceiving.nativeElement.value;

    //  this.ActualRemaining = +ActualRemainingReceiving + +ActualDelivered;
    // this.ActualRemaining = parseInt(ActualRemainingReceiving) + parseInt(ActualDelivered);
    this.editProject.is_activated = this.Activator;

    this.editProject.actual_remaining_receiving =
      +ActualRemainingReceiving + +ActualDelivered;

    //
    this.projectsService.updateProjectReturn(this.editProject).subscribe(
      (response: Project) => {
        var p: Project = new Project();
        p.projectID = response.projectID;
        p.projectName = response.projectName;
        p.dateOfStart = response.dateOfStart;
        p.teamSize = response.teamSize;
        p.clientLocation = response.clientLocation;
        p.active = response.active;
        // p.is_activated = response.is_activated;
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
        // p.received_by_QA = response.received_by_QA;
        // // this.activeUser = response.received_by_QA;
        p.status_of_reject_one = response.status_of_reject_one;
        p.status_of_reject_two = response.status_of_reject_two;
        p.status_of_reject_three = response.status_of_reject_three;
        p.count_of_reject_one = response.count_of_reject_one;
        p.count_of_reject_two = response.count_of_reject_two;
        p.count_of_reject_three = response.count_of_reject_three;
        p.total_of_reject_mat = response.total_of_reject_mat;
        //Section 1

        // this.received_by.nativeElement.value = this.loginService.currentUserName;
        this.projects[this.editIndex] = p;

        //   this.editProject.projectID = null;
        //   this.editProject.projectName = null;
        //   this.editProject.dateOfStart = null;
        //   this.editProject.teamSize = null;
        //   this.editProject.supplier = null;
        //   this.editProject.active = false;
        //   this.editProject.clientLocationID = null;
        //   this.editProject.status = null;
        //   this.editProject.item_code = null;
        //   this.editProject.item_description = null;
        //   this.editProject.po_number = null;
        //   this.editProject.po_date = null;
        //   this.editProject.pr_number = null;
        //   this.editProject.pr_date = null;
        //   this.editProject.qty_order = null;
        //   this.editProject.qty_uom = null;
        //   this.editProject.mfg_date = null;
        //   this.editProject.expiration_date = null;
        //   this.editProject.expected_delivery = null;
        //   this.editProject.actual_delivery = null;
        //   this.editProject.actual_remaining_receiving = null;
        //   this.editProject.received_by_QA = null;
        //   this.editProject.is_activated = null;
        //   this.editProject.status_of_reject_one = null;
        //   this.editProject.status_of_reject_two = null;
        //   this.editProject.status_of_reject_three = null;
        //   this.editProject.count_of_reject_one = null;
        //   this.editProject.count_of_reject_two = null;
        //   this.editProject.count_of_reject_three = null;
        //   this.editProject.total_of_reject_mat = null;

        //  this.showDeactivatedSuccess();
        //  this.ngOnInit();
        //   $("#editFormCancel").trigger("click");
      },
      (error) => {
        console.log(error);
      }
    );
  }

  OnDeleteDetails() {
    this.projectsService.deleteProject(this.deleteProject.projectID).subscribe(
      (response) => {
        this.projects.splice(this.deleteIndex, 1);
        this.deleteProject.projectID = null;
        this.deleteProject.projectName = null;
        this.deleteProject.teamSize = null;
        this.deleteProject.dateOfStart = null;
        this.deleteProject.supplier = null;
        this.deleteProject.item_code = null;
        this.deleteProject.item_description = null;
        this.deleteProject.po_number = null;
        this.deleteProject.po_date = null;
        this.deleteProject.pr_number = null;
        this.deleteProject.pr_date = null;
        this.deleteProject.qty_order = null;
        this.deleteProject.qty_uom = null;
        this.deleteProject.mfg_date = null;
        this.deleteProject.expiration_date = null;
        this.deleteProject.expected_delivery = null;
        this.deleteProject.actual_delivery = null;
        this.deleteProject.actual_remaining_receiving = null;
        this.deleteProject.received_by_QA = null;
        this.deleteProject.c_inner_walls_desc = null;
        this.deleteProject.c_compliance = null;
        this.deleteProject.c_remarks = null;
        this.deleteProject.d_plastic_curtains_desc = null;
        this.deleteProject.d_compliance = null;
        this.deleteProject.d_remarks = null;
        this.deleteProject.e_thereno_pest_desc = null;
        this.deleteProject.e_compliance = null;
        this.deleteProject.e_remarks = null;
        //Section 2
        //A
 

        this.calculateNoOfPages();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearchClick() {
    // this.projectsService.SearchProjects(this.searchBy, this.searchText).subscribe(
    //   (response: Project[]) =>
    //   {
    //     this.projects = response;
    //   },
    //   (error) =>
    //   {
    //     console.log(error);
    //   });
  }

  onSearchTextKeyup(event) {
    this.calculateNoOfPages();
  }

  onHideShowDetails(event) {
    this.projectsService.toggleDetails();
  }

  onPageIndexClicked(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  onAddAdditionalRejectRow(event: any) {
    if ($('#rejectionrow1').is(':visible')) {
      // alert("The paragraph  is visible.");

      if ($('#rejectionrow2').is(':visible')) {
        // alert("The paragraph  is visible.");
        if ($('#rejectionrow3').is(':visible')) {
          // alert("The paragraph  is visible.");
          // alert("Limit  is exceed!");
          this.showLimitonAddingRejection();
        } else {
          // alert("The paragraph  is hidden.");
          $('#rejectionrow3').show();
          $('#rejectionrow32').show();
          $('#total-reject').show();
          $('#total-confirm-reject').show();
          $('#AddRejectBtn').hide();
        }
      } else {
        // alert("The paragraph  is hidden.");
        $('#rejectionrow2').show();
        $('#rejectionrow22').show();
        $('#total-reject').show();
        $('#total-confirm-reject').show();
      }
    } else {
      // alert("The paragraph  is hidden.");
      $('#rejectionrow1').show();
      $('#rejectionrow12').show();
      $('#remove-remarks-button').show();
      $('#total-reject').show();
      $('#total-confirm-reject').show();
    }

    // $("#rejectionrow2").show();
    // $("#rejectionrow22").show();

    // $("#rejectionrow3").show();
    // $("#rejectionrow32").show();
    // alert("sds");
  }

  onRemoveAdditionalRejectRow(event: any) {
    if ($('#rejectionrow3').is(':visible')) {
      // alert("The paragraph  is visible.");
      $('#rejectionrow3').hide();
      $('#rejectionrow32').hide();
    } else {
      // alert("The paragraph  is hidden.");

      if ($('#rejectionrow2').is(':visible')) {
        // alert("The paragraph  is visible.");
        $('#rejectionrow2').hide();
        $('#rejectionrow22').hide();
        $('#remove-remarks-button').show();
      } else {
        // alert("The paragraph  is hidden.");
        if ($('#rejectionrow1').is(':visible')) {
          // alert("The paragraph  is visible.");
          $('#rejectionrow1').hide();
          $('#rejectionrow12').hide();
          $('#remove-remarks-button').hide();
          $('#total-reject').hide();
          $('#total-confirm-reject').hide();
        } else {
          // alert("The paragraph  is hidden.");
        }
      }
    }
    //Reloading Add Button
    if ($('#AddRejectBtn').is(':visible')) {
    } else {
      $('#AddRejectBtn').show();
    }
  }


  onChangeEventReject1(event: any) {
    if (this.rejectNo1.nativeElement.value == '') {
      this.rejectNo1.nativeElement.value = '0';
      // console.warn("Empty Quantity in the textInput! ")
    }

    console.log(event.target.value);
    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value;
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
    } else {
      this.RejectionGreaterThanReceiving();
    }
  }

  onChangeEventReject2(event: any) {
    if (this.rejectNo2.nativeElement.value == '') {
      this.rejectNo2.nativeElement.value = '0';
      console.warn('Empty Quantity in the textInput! ');
    }

    console.log(event.target.value);
   // this.totalofReject.nativeElement.value = this.rejectNo2.nativeElement.value + this.totalofReject.nativeElement.value;
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
    } else {
      this.RejectionGreaterThanReceiving();
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
        title:
          'Are you sure you want to update the details item expiry at ' +
          Difference_In_Days +
          ' Days?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.ExpiryDateChild.nativeElement.value = '';
          this.ExpiryDateChild.nativeElement.focus();
    
        }
      });
    } else {
    }
  }

  onChangeEventReject3(event: any) {
    if (this.rejectNo3.nativeElement.value == '') {
      this.rejectNo3.nativeElement.value = '0';
      console.warn('Empty Quantity in the textInput! ');
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
    } else {
      this.RejectionGreaterThanReceiving();
    }
  }

  validateNumber(e: any) {
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,2})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }

  HideSearchBtn(event: any) {
    $('#SearchBtnDetailed').show();
  }

  validateRejectedStatus(event: any) {
    // const Reject1 = this.RejectedStatus1.nativeElement.value;
    // const Reject2 = this.RejectedStatus2.nativeElement.value;
    // const Reject3 = this.RejectedStatus3.nativeElement.value;
    // if(Reject1 == Reject2)
    // {
    //   this.MultipleSelectionOfRejectionStatus();
    // }
  }

  ActualDeliveryComputation(event: any) {
    // Allowable Percentage Computation
    const TotalAllowablePercentage =
      this.TotalAllowablePercentage.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const QtyOrder = this.QtyOrdered.nativeElement.value;
    // const TotalAllowablePercentage = this.TotalAllowablePercentage.nativeElement.value;

    // const summary = ExpectedDelivery * ActivatedAllowablePercentage;
    // console.log(summary);

    // const summary = ExpectedDelivery * 1.10;
    // this.TotalAllowablePercentage.nativeElement.value = summary;
    this.ActualRemaining = QtyOrder - ActualDelivered;

    if (ActualDelivered > TotalAllowablePercentage) {
      this.AllowablePercentageExceed();
    } else {
      // alert("FEMALE");
    }
  }

  AllowablePercentageComputation(event: any) {
    // Allowable Percentage Computation
    const ExpectedDelivery = this.ExpectedDeliveryActual.nativeElement.value;
    const ActivatedAllowablePercentage =
      this.ActiveAllowablePercentage.nativeElement.value;
    // const TotalAllowablePercentage = this.TotalAllowablePercentage.nativeElement.value;

    // const summary = ExpectedDelivery * ActivatedAllowablePercentage;
    // console.log(summary);
    if (this.ActiveAllowablePercentage.nativeElement.value == '10') {
      const summary = ExpectedDelivery * 1.1;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    } else if (this.ActiveAllowablePercentage.nativeElement.value == '20') {
      const summary = ExpectedDelivery * 1.2;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    } else if (this.ActiveAllowablePercentage.nativeElement.value == '30') {
      const summary = ExpectedDelivery * 1.3;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    } else if (this.ActiveAllowablePercentage.nativeElement.value == '40') {
      const summary = ExpectedDelivery * 1.4;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    } else if (this.ActiveAllowablePercentage.nativeElement.value == '50') {
      const summary = ExpectedDelivery * 1.5;
      this.TotalAllowablePercentage.nativeElement.value = summary;
    } else {
    }
  }

  ConfirmNoofReject(event: any) {
    // alert("You Press a key in the Keyboard");

    if (this.confirmReject.nativeElement.value == '') {
      this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
    } else {
      if (
        this.totalofReject.nativeElement.value ==
        this.confirmReject.nativeElement.value
      ) {
        // this.rejectNo3.nativeElement.value="0";
        // console.warn("Empty Quantity in the textInput! ")
        // this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "Pexa Marian";
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
      } else {
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML =
          'No. of reject is not match';
      }
    }
  }
}
