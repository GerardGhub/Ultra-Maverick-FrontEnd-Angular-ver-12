import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { ProjectsService } from '../../../services/projects.service';
import { ClientLocation } from '../../../models/client-location';
import { ClientLocationsService } from '../../../services/client-locations.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  FormBuilder,
} from '@angular/forms';
import * as $ from 'jquery';
import { ProjectComponent } from '../project/project.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { Observable } from 'rxjs';
import { Project } from '../../../models/project';
import Swal from 'sweetalert2';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { LoginService } from '../../../services/login.service';
import { RejectedStatus } from '../../../models/rejected-status';
import { RejectedStatusService } from '../../../services/rejected-status.service';
import { AllowablePercentage } from '../../../models/allowable-percentage';
import { AllowablePercentageService } from '../../../services/allowable-percentage.service';
import { CancelledPOTransactionStatus } from '../../../models/cancelled-potransaction-status';
import { CancelledPOTransactionStatusService } from '../../../services/cancelled-potransaction-status.service';
import { ProjectsPartialPoService } from '../../../services/projects-partial-po.service';
import { PartialPoService } from './services/partialPOmodule.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-projects-partial-po',
  templateUrl: './projects-partial-po.component.html',
  styleUrls: ['./projects-partial-po.component.scss'],
})
export class ProjectsPartialPoComponent implements OnInit {

  constructor(
    private projectsService: ProjectsService,
    private clientLocationsService: ClientLocationsService,
    private toastr: ToastrService,
    public loginService: LoginService,
    private rejectedStatusService: RejectedStatusService,
    private allowablePercentageService: AllowablePercentageService,
    private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService,
    private projectsPartialPoService: ProjectsPartialPoService,
    private formBuilder: FormBuilder,
    private partialPOService: PartialPoService,
    public appComponent: AppComponent
  ) { }

  WHReceivingList: number = 0;

  projects: Project[] = [];
  clientLocations: Observable<ClientLocation[]>;
  showLoading: boolean = true;
  ChecklistViewing: any[] = [];

  newProject: Project = new Project();
  editProject: Project = new Project();
  editIndex: number = 0;
  deleteProject: Project = new Project();
  deleteIndex: number = 0;
  searchBy: string = 'po_number';
  searchText: string = '';
  ToDay: Date;
  ToDayforMaxDate: Date;

  activeUser: string = '';
  PoNumberBinding: string = '';

  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  totalPoRowCount: number = 0;

  @ViewChild('newForm') newForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;

  cancelForm: FormGroup;

  //sample
  msgrejectremarksno1: number = 0;
  msgrejectremarksno2: number = 0;
  msgrejectremarksno3: number = 0;

  totalRejectMaterial: string = "";
  //Calculator for Reject

  secondInput: number = 10;
  Deactivator: string = '0';
  Activator: string = '1';
  ActualRemaining: number = 0;

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


  ngOnInit() {
    this.getList();
    this.reactiveForms();
    // this.getViewingList();
    this.loginService.detectIfAlreadyLoggedIn();
    this.ToDay = new Date();
    this.activeUser = this.loginService.currentUserName;

    this.clientLocations = this.clientLocationsService.getClientLocations();
    this.RejectStatuses = this.rejectedStatusService.getListOfStatusOfReject();
    this.CancelPoSummary = this.cancelledPOTransactionStatusService.getListOfStatusOfData();
    this.AllowablePercentages = this.allowablePercentageService.getAllAlowablePercentage();

    this.WHReceivingList = this.appComponent.WHReceivingList;
  }

  getList() {
    this.projectsPartialPoService
      .getAllProjects()
      .subscribe((response: Project[]) => {
        // debugger;
        // console.log(response);
        this.projects = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalPoRowCount = response.length;
      });
  }

  getViewingList() {
    this.partialPOService.getPartialPOChecklist().subscribe((response) => {
      this.ChecklistViewing = response;
      console.log(response);
    });
  }

  dateFilter(date) {
    return date && date.getDay() !== 0 && date.getDay() !== 6;
  }

  onClickView(event, index: Project) {
    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.fullName;
    var totalQtyReject = parseInt(index.total_of_reject_mat) * 1;
    this.resetValueS();
    //first
    this.projectsPartialPoService
      .getAllProjects()
      .subscribe((response: Project[]) => {
        // debugger;
        this.projects = response;
      });
    setTimeout(() => {
      this.editProject.projectID = index.projectID;
      this.editProject.projectName = index.projectName;
      this.editProject.dateOfStart = index.dateOfStart
        .split('/')
        .reverse()
        .join('-'); //yyyy-MM-dd

      this.editProject.teamSize = index.teamSize;
      this.editProject.active = index.active;
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
      this.editProject.is_activated = this.Activator;

      this.editProject.mfg_date = index.mfg_date;
      this.editProject.expiration_date = index.expiration_date;
      this.editProject.expected_delivery = index.expected_delivery;
      this.editProject.actual_delivery = index.actual_delivery;
      this.editProject.actual_remaining_receiving = index.actual_remaining_receiving;
      this.editProject.received_by_QA = index.received_by_QA;


      this.editProject.status_of_reject_one =
        index.status_of_reject_one;
      this.editProject.status_of_reject_two =
        index.status_of_reject_two;
      this.editProject.status_of_reject_three =
        index.status_of_reject_three;

      this.editProject.count_of_reject_one =
      index.count_of_reject_one;
      this.editProject.count_of_reject_two =
      index.count_of_reject_two;
      this.editProject.count_of_reject_three =
        index.count_of_reject_three;
      this.editProject.total_of_reject_mat =
      totalQtyReject.toString();
      //Section 1

      //Cancel
      this.editProject.cancelled_date = this.ToDay;
      this.editProject.canceled_by = this.activeUser;
      this.editProject.cancelled_reason = index.cancelled_reason;
      //QC Receiving Date
      this.editProject.qcReceivingDate = index.qcReceivingDate;

      $('txtexpected_delivery').val('');
      //Calling The Projects for Qty Binding Servo IT Solutions
     
      this.PoNumberBinding = index.po_number;
      if (this.searchBy =='po_number')
      {
      this.ProjectsAllowableQty = this.projectsService.SearchProjects(
        'po_number',
        this.PoNumberBinding
      );
      }
      if (this.searchBy =='item_code')
      {
        this.ProjectsAllowableQty = this.projectsService.SearchProjects('item_code', this.PoNumberBinding);
      }

      this.totalRejectMaterial = index.total_of_reject_mat;
      // this.editIndex = index;
    }, 100);

    // viewing of checklist
    this.partialPOService
      .viewPartialPoChecklist(index.projectID)
      .subscribe((response) => {
        this.ChecklistViewing = response;
      });
  }




  // REACTIVE FORMS **************************************************************************************************************
  reactiveForms() {
    this.cancelForm = this.formBuilder.group({
      po_number: this.formBuilder.control(null, [Validators.required]),
      item_description: this.formBuilder.control(null, [Validators.required]),
      cancelled_reason: this.formBuilder.control(null, [Validators.required]),
    });
  }


  // POPULATE FIELDS *************************************************************************************************************
  onViewClick(item: any) { }



  // CRUD ************************************************************************************************************************


























  jqueryClearanceTextBox() {
    $('rejectRow1').val('');
    $('rejectRow2').val('');
    $('rejectRow3').val('');
  }

  HideRejectRowUsingJquery() {
    //Number 1
    $('#rejectionrow1').hide();
    $('#rejectionrow12').hide();
    // Number 2
    $('#rejectionrow2').hide();
    $('#rejectionrow22').hide();
    //Number 3
    $('#rejectionrow3').hide();
    $('#rejectionrow32').hide();

    //Button for Removing a Remarks
    $('#remove-remarks-button').hide();

    //total reject & confirmation of reject
    $('#total-reject').hide();
    $('#total-confirm-reject').hide();
  }

  showLimitonAddingRejection() {
    this.toastr.info('You already reached the limit!', 'Notifications');
  }

  showCancelledSuccess() {
    this.toastr.success('Successfully Cancelled!', 'Notifications');
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

  isAllChecked: boolean = false;

  @ViewChildren('prj') projs: QueryList<ProjectComponent>;

  isAllCheckedChange(event) {
    let proj = this.projs.toArray();
    for (let i = 0; i < proj.length; i++) {
      proj[i].isAllCheckedChange(this.isAllChecked);
    }
  }

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

  @ViewChild('TotalOfRejectMatToReturnQty') TotalOfRejectMatToReturnQty: ElementRef;
  onNewClick(event: any) {
    this.newForm.resetForm();
    setTimeout(() => {
      this.received_by.nativeElement.value = this.loginService.currentUserName;
      this.IsActivated.nativeElement.value = '1';
      this.IsActivated.nativeElement.focus();
    }, 100);
  }

  onSaveClick() {
    if (this.newForm.valid) {
      // this.newProject.clientLocation.clientLocationID = 0;
      this.newProject.is_activated = '1';
      this.projectsService.insertProject(this.newProject).subscribe(
        (response) => {
          //Add Project to Grid
          var p: Project = new Project();
          p.projectID = response.projectID;
          p.projectName = response.projectName;
          p.dateOfStart = response.dateOfStart;
          p.teamSize = response.teamSize;
          // p.clientLocation = response.clientLocation;
          p.active = response.active;
          // p.clientLocationID = response.clientLocationID;
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

          this.projects.push(p);

          //Clear New Project Dialog - TextBoxes

          this.newProject.projectName = null;
          this.newProject.dateOfStart = null;
          this.newProject.teamSize = null;
          this.newProject.active = false;
          // this.newProject.clientLocationID = null;
          this.newProject.status = "";
          this.newProject.is_activated = "";
          this.newProject.supplier = "";
          this.newProject.item_code = "";
          this.newProject.po_number = "";
          this.newProject.po_date = "";
          this.newProject.pr_number = "";
          this.newProject.pr_date = "";
          this.newProject.qty_uom = "";
          this.newProject.qty_order = "";
          this.newProject.mfg_date = "";
          this.newProject.expiration_date = "";
          this.newProject.expected_delivery = "";
          this.newProject.actual_delivery = "";
          this.newProject.actual_remaining_receiving = 0;
          this.newProject.received_by_QA = "";
          this.newProject.status_of_reject_one = "";
          this.newProject.status_of_reject_two = "";
          this.newProject.status_of_reject_three = "";
          this.newProject.count_of_reject_one = "";
          this.newProject.count_of_reject_two = "";
          this.newProject.count_of_reject_three = "";
          this.newProject.total_of_reject_mat = "";
          $('#newFormCancel').trigger('click');

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
    // To set two dates to two variables
    var date1 = new Date($('#txtEditReceivingDate').val());
    var date2 = new Date($('#txtEditexpiration_date').val());

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


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
        'Are you sure that you want to update the details item expiry at ' +
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
          this.getList();
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
    var TotalOfRejectMat = this.TotalOfRejectMatToReturnQty.nativeElement.value;
    this.ActualRemaining = QtyOrder - ActualDelivered + parseInt(TotalOfRejectMat);

  }

  UpdateClickDetails() {

    // if (this.editForm.valid) {


    // console.log(this.editProject.projectID);

    this.ComputeRemainingQty();



    this.editProject.actual_remaining_receiving = this.ActualRemaining;
    this.editProject.is_activated = this.Deactivator;
    this.editProject.canceled_by = this.activeUser;
    this.projectsPartialPoService.cancelProject(this.editProject).subscribe(
      (response: Project) => {
        var p: Project = new Project();
        p.projectID = response.projectID;


        p.projectName = response.projectName;
        p.dateOfStart = response.dateOfStart;
        p.teamSize = response.teamSize;
        // p.clientLocation = response.clientLocation;
        p.active = response.active;
        p.is_activated = response.is_activated;
        // p.clientLocationID = response.clientLocationID;
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
        p.status_of_reject_one = response.status_of_reject_one;
        p.status_of_reject_two = response.status_of_reject_two;
        p.status_of_reject_three = response.status_of_reject_three;
        p.count_of_reject_one = response.count_of_reject_one;
        p.count_of_reject_two = response.count_of_reject_two;
        p.count_of_reject_three = response.count_of_reject_three;
        p.total_of_reject_mat = response.total_of_reject_mat;
        // Section 1
        // A

        //Adds On
        p.cancelled_date = response.cancelled_date;
        p.canceled_by = response.canceled_by;
        p.cancelled_reason = response.cancelled_reason;

        // this.received_by.nativeElement.value = this.loginService.currentUserName;
        this.projects[this.editIndex] = p;
        this.UpdateMasterTransactionsActualReceivingofCancel();
        // this.InsertANewPartialReceiving();
        this.editProject.projectID = 0;
        this.editProject.projectName = "";
        this.editProject.dateOfStart = "";
        this.editProject.teamSize = 0;
        this.editProject.supplier = "";
        this.editProject.active = false;
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
        this.editProject.status_of_reject_one = "";
        this.editProject.status_of_reject_two = "";
        this.editProject.status_of_reject_three = "";
        this.editProject.count_of_reject_one = "";
        this.editProject.count_of_reject_two = "";
        this.editProject.count_of_reject_three = "";
        this.editProject.total_of_reject_mat = "";
        //Section A
        //A

        //Add
        this.editProject.cancelled_date = null;
        this.editProject.canceled_by = "";
        this.editProject.cancelled_reason = "";

        this.showCancelledSuccess();
        this.ngOnInit();
        $('#editFormCancel').trigger('click');

        setTimeout(() => {
          this.getList();
        }, 400);
      },
      (error) => {
        console.log(error);
      }
    );
    // }

  }

  //Insert as Partials
  InsertANewPartialReceiving() {
    if (this.editForm.valid) {
      this.projectsPartialPoService.insertProject2(this.editProject).subscribe(
        (response: Project) => {
          var p: Project = new Project();
          p.primaryID = response.primaryID;
          p.projectID = response.projectID;
          p.projectName = response.projectName;
          p.dateOfStart = response.dateOfStart;
          p.teamSize = response.teamSize;
          p.active = response.active;
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
          p.status_of_reject_one = response.status_of_reject_one;
          p.status_of_reject_two = response.status_of_reject_two;
          p.status_of_reject_three = response.status_of_reject_three;
          p.count_of_reject_one = response.count_of_reject_one;
          p.count_of_reject_two = response.count_of_reject_two;
          p.count_of_reject_three = response.count_of_reject_three;
          p.total_of_reject_mat = response.total_of_reject_mat;
     
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
      title: 'Are you sure, you want to cancel this transaction?',
      text: Item,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        // alert('una no!')
        this.UpdateClickDetails();

      }
    });
  }


  onCancelClick(event, index: Project) {
    var qtyTotalReject =  parseInt(index.total_of_reject_mat) * 1;

    this.editForm.resetForm(); //form group reset
    this.received_by.nativeElement.value = this.loginService.currentUserName;
    //Resetting the Rejection Information into zero
    this.resetValueS();
    //fetch from API
    this.projectsPartialPoService
      .getAllProjects()
      .subscribe((response: Project[]) => {
        this.projects = response;
      });
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

      this.editProject.is_activated = this.Activator;
      this.editProject.returned_date = this.ToDay;
      this.editProject.returned_by = this.activeUser;
      this.editProject.received_by_QA = index.received_by_QA;
      this.editProject.cancelled_date = index.cancelled_date;
      this.editProject.canceled_by = index.canceled_by;
      this.editProject.cancelled_reason = index.cancelled_reason;

      this.editProject.status_of_reject_one = index.status_of_reject_one;
      this.editProject.status_of_reject_two = index.status_of_reject_two;
      this.editProject.status_of_reject_three = index.status_of_reject_three;

      this.editProject.count_of_reject_one = index.count_of_reject_one;
      this.editProject.count_of_reject_two = index.count_of_reject_two;
      this.editProject.count_of_reject_three = index.count_of_reject_three;
      this.editProject.total_of_reject_mat = qtyTotalReject.toString();

      //Calling The Projects for Qty Binding Servo IT Solutions
      this.PoNumberBinding = index.po_number;


      this.ProjectsAllowableQty = this.projectsService.SearchProjects(
        'Po_number',
        this.PoNumberBinding
      );


      // this.editIndex = index;

    }, 100);
  }

  UpdateDeactivatedTransactions() {
    this.UpdateClickDetails();
  }

  UpdateMasterTransactionsActualReceivingofCancel() {
    //Singkit na mata
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;

    const ActualRemainingReceiving =
      this.ActualRemainingReceiving.nativeElement.value;
      var TotalOfRejectMat = this.TotalOfRejectMatToReturnQty.nativeElement.value;

    //  this.ActualRemaining = +ActualRemainingReceiving + +ActualDelivered;
    // this.ActualRemaining = parseInt(ActualRemainingReceiving) + parseInt(ActualDelivered);
    this.editProject.is_activated = this.Activator;

    this.editProject.actual_remaining_receiving =
      +ActualRemainingReceiving + +ActualDelivered - parseInt(TotalOfRejectMat) ;

      // alert(ActualRemainingReceiving);
      // alert(ActualDelivered);
      // alert(this.editProject.actual_remaining_receiving);
      // return;

    //
    this.projectsService.updateProjectReturn(this.editProject).subscribe(
      (response: Project) => {
        var p: Project = new Project();
        p.projectID = response.projectID;
        p.projectName = response.projectName;
        p.dateOfStart = response.dateOfStart;
        p.teamSize = response.teamSize;
        // p.clientLocation = response.clientLocation;
        p.active = response.active;
        // p.is_activated = response.is_activated;
        // p.clientLocationID = response.clientLocationID;
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

  //Start of Looping in Rejected Items
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

      $('#rejectionrow3').hide();
      $('#rejectionrow32').hide();
    } else {


      if ($('#rejectionrow2').is(':visible')) {

        $('#rejectionrow2').hide();
        $('#rejectionrow22').hide();
        $('#remove-remarks-button').show();
      } else {
        // alert("The paragraph  is hidden.");
        if ($('#rejectionrow1').is(':visible')) {

          $('#rejectionrow1').hide();
          $('#rejectionrow12').hide();
          $('#remove-remarks-button').hide();
          $('#total-reject').hide();
          $('#total-confirm-reject').hide();
        } else {

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


    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {

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


    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {

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
          'Are you sure that you want to update the details item expiry at ' +
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
          if (this.editForm.valid) {
            this.UpdateClickDetails();
          }
          else {
            this.FieldOutRequiredField();
          }

          Swal.fire(
            'Updated!',
            'Your data has been updated.',
            'success'
          )
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


    // this.totalofReject.nativeElement.value = this.rejectNo1.nativeElement.value() + 2;
    if (ActualDelivered > TotalReject) {

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


    if (this.confirmReject.nativeElement.value == '') {
      this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
    } else {
      if (
        this.totalofReject.nativeElement.value ==
        this.confirmReject.nativeElement.value
      ) {
        // this.rejectNo3.nativeElement.value="0";
        // this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = "Pexa Marian";
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
      } else {
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML =
          'No. of reject is not match';
      }
    }
  }
}
