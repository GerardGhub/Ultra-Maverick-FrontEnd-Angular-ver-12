import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  OnChanges,
  Input,
} from '@angular/core';
import { ProjectsService } from '../../../services/projects.service';
import { ClientLocation } from '../../../models/client-location';
import { ClientLocationsService } from '../../../services/client-locations.service';
import {
  FormBuilder,
  FormGroup,
  NgForm,
} from '@angular/forms';
import * as $ from 'jquery';
import { ProjectComponent } from '../project/project.component';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { Observable } from 'rxjs';
import { Project } from '../../../models/project';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { LoginService } from '../../../services/login.service';
import { RejectedStatus } from '../../../models/rejected-status';
import { RejectedStatusService } from '../../../services/rejected-status.service';
import { AllowablePercentage } from '../../../models/allowable-percentage';
import { AllowablePercentageService } from '../../../services/allowable-percentage.service';
import { CancelledPOTransactionStatus } from '../../../models/cancelled-potransaction-status';
import { CancelledPOTransactionStatusService } from '../../../services/cancelled-potransaction-status.service';
import { ProjectsPartialPoService } from '../../../services/projects-partial-po.service';
import { TblNearlyExpiryMgmt } from '../../../models/tbl-nearly-expiry-mgmt';
import { TblNearlyExpiryMgmtService } from '../../../services/tbl-nearly-expiry-mgmt.service';
import { QCService } from './services/qcmodule.service';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnChanges {
  @Input() parent_id;



  constructor(
    private projectsService: ProjectsService,
    private clientLocationsService: ClientLocationsService,
    private toastr: ToastrService,
    public loginService: LoginService,
    private rejectedStatusService: RejectedStatusService,
    private allowablePercentageService: AllowablePercentageService,
    private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService,
    private projectsPartialPoService: ProjectsPartialPoService,
    private tblNearlyExpiryMgmtService: TblNearlyExpiryMgmtService,
    private formBuilder: FormBuilder,
    private qcService: QCService,
    public appComponent: AppComponent
  ) {

  }

  ngOnChanges() {
    // create header using child_id
    console.log(this.parent_id);
  }

  ChildMethod(event) {
    // console.log("Pure CASS");

    this.ngOnInit();
  }

  projects: Project[] = [];
  cancelledPOlist: Project[] = [];
  qcchecklist: any[] = [];
  clientLocations: Observable<ClientLocation[]>;
  showLoading: boolean = true;

  allowableqty: number = 0;
  actualqty: number = 0;
  expirable_material: string = '';

  newProject: Project = new Project();
  editProject: Project = new Project();
  editIndex: number = 0;
  deleteProject: Project = new Project();
  deleteIndex: number = 0;
  searchBy: string = 'po_number';
  searchText: string = '';
  ToDay: Date;
  ToDayforMaxDate: Date;
  ChildForm: string = '';
  activeUser: string = '';
  PartialEntry: string = '';
  PartialComment: string = '';
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;
  dualbindingchanges = 0;

  totalPoRowCount: number = 0;
  totalPartial: number = 0;

  totalCancelledPoRowCount: number = 0;

  totalPartialReceivingCancel: number = 0;

  @ViewChild('newForm') newForm: NgForm;
  @ViewChild('editForm') editForm: NgForm;

  checkListForm: FormGroup;

  PoNumberBinding: string = '';
  //sample
  msgrejectremarksno1: number = 0;
  msgrejectremarksno2: number = 0;
  msgrejectremarksno3: number = 0;
  //Calculator for Reject

  secondInput: number = 10;
  Deactivator: string = '0';
  StringNone: string = 'None';
  Activator: string = '1';
  ActualRemaining: number = 0;
  totalPoPartialReceiving: number = 0;
  RandomNumber: number = 0;

  // minDate: Date = new Date("2021-05-01");
  minDate = moment(new Date()).format('YYYY-MM-DD');
  maxDate = moment(new Date()).format('YYYY-MM-DD');

  dateHint: string = 'Choose date of birth';
  startDate: Date = new Date('2002-01-01');

  //Sorting
  sortBy: string = 'po_number';
  sortOrder: string = 'ASC'; //ASC | DESC

  //Sample for Testing Status
  RejectStatuses: Observable<RejectedStatus[]>;
  CancelPoSummary: Observable<CancelledPOTransactionStatus[]>;
  AllowableNearlyExpiryDays: Observable<TblNearlyExpiryMgmt[]>;

  AllowablePercentages: Observable<AllowablePercentage[]>;
  //New 10/19/2021 for Canceel Partial
  ProjectsAllowableQty: Observable<Project[]>;
  isAllChecked: boolean = false;

  errorMessage: string = '';

  currentUserFullName: string = '';

  //Child Variables
  PoReceiving: number = 0;
  CancelledPo: number = 0;

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
  @ViewChild('ActualRemainingReceiving') ActualRemainingReceiving: ElementRef;
  @ViewChild('QtyOrdered') QtyOrdered: ElementRef;
  //Allowable Expiration Days Set Point Binding
  @ViewChild('ActiveNearlyExpirySetpoint')
  ActiveNearlyExpirySetpoint: ElementRef;
  //Item Description
  @ViewChild('ItemDescription') ItemDescription: ElementRef;
  //PO Number
  @ViewChild('PONumber') PONumber: ElementRef;
  //Active Partial Receiving Set Point
  @ViewChild('ActivePartialReceiving') ActivePartialReceiving: ElementRef;

  //Selection of Compliation ViewChild In And Out
  @ViewChild('remarksSectionA1') remarksSectionA1: ElementRef;
  @ViewChild('remarksSectionA2') remarksSectionA2: ElementRef;
  @ViewChild('remarksSectionA3') remarksSectionA3: ElementRef;
  @ViewChild('remarksSectionA4') remarksSectionA4: ElementRef;
  @ViewChild('remarksSectionA5') remarksSectionA5: ElementRef;
  //Additional Entry ViewChild In And Out
  @ViewChild('remarksSectionB1') remarksSectionB1: ElementRef;
  @ViewChild('remarksSectionB2') remarksSectionB2: ElementRef;
  @ViewChild('remarksSectionB3') remarksSectionB3: ElementRef;
  @ViewChild('remarksSectionB4') remarksSectionB4: ElementRef;
  @ViewChild('remarksSectionB5') remarksSectionB5: ElementRef;
  @ViewChild('remarksSectionB6') remarksSectionB6: ElementRef;
  //Additional Entry ViewChild In And Out
  @ViewChild('remarksSectionC1') remarksSectionC1: ElementRef;
  @ViewChild('remarksSectionC2') remarksSectionC2: ElementRef;
  @ViewChild('remarksSectionC3') remarksSectionC3: ElementRef;
  @ViewChild('remarksSectionC4') remarksSectionC4: ElementRef;
  //Additional Entry ViewChild In And Out
  @ViewChild('remarksSectionD1') remarksSectionD1: ElementRef;
  @ViewChild('remarksSectionD2') remarksSectionD2: ElementRef;
  @ViewChild('remarksSectionD3') remarksSectionD3: ElementRef;
  @ViewChild('remarksSectionD4') remarksSectionD4: ElementRef;
  //Additional Entry ViewChild In And Out
  @ViewChild('remarksSectionE1') remarksSectionE1: ElementRef;
  @ViewChild('remarksSectionE2') remarksSectionE2: ElementRef;
  @ViewChild('remarksSectionE3') remarksSectionE3: ElementRef;
  @ViewChild('remarksSectionE4') remarksSectionE4: ElementRef;
  @ViewChild('remarksSectionE5') remarksSectionE5: ElementRef;
  @ViewChild('remarksSectionE6') remarksSectionE6: ElementRef;
  @ViewChild('remarksSectionE7') remarksSectionE7: ElementRef;
  @ViewChild('remarksSectionE8') remarksSectionE8: ElementRef;

  // testing lang

  checklistDataList: any = [];
  data = [];

  ngOnInit() {

    this.getPOrecievingList();
    this.important();
    this.getUserFullName();
    this.getChecklist();
    this.getPOcancelledList();

    this.PoReceiving = this.appComponent.PoReceiving;
    this.CancelledPo = this.appComponent.CancelledPo;

  }

  any(event: any) {
    this.ChildForm = "22434";


  }
  any2(event: any) {
    this.important();
  }
  any3(event: any) {
    this.getChecklist();

  }
  any4(event: any) {
    this.getPOcancelledList();

  }




  getPOrecievingList() {
    this.projectsService.getAllProjects().subscribe((response: Project[]) => {
      // debugger;
      this.projects = response;
      this.showLoading = false;
      this.calculateNoOfPages();
      this.totalPoRowCount = response.length;
    });
  }

  getPOcancelledList() {
    this.projectsService
      .getAllProjectsCancelView()
      .subscribe((response: Project[]) => {
        // debugger;

        this.cancelledPOlist = response;

        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalCancelledPoRowCount = response.length;
      });
  }

  getChecklist() {
    this.qcService.getQcChecklist().subscribe((response) => {
      this.qcchecklist = response;
    });
  }

  isAllCheckedChange(event) {
    let proj = this.projs.toArray();
    for (let i = 0; i < proj.length; i++) {
      proj[i].isAllCheckedChange(this.isAllChecked);
    }
  }

  dateFilter(date) {
    return date && date.getDay() !== 0 && date.getDay() !== 6;
  }

  getUserFullName() {
    this.currentUserFullName = this.loginService.fullName;
  }

  cancelledPoCount() {
    this.projectsService
      .getAllProjectsCancelView()
      .subscribe((response: Project[]) => {
        this.totalCancelledPoRowCount = response.length;
      });
  }

  important() {
    this.loginService.detectIfAlreadyLoggedIn();
    this.ToDay = new Date();
    this.activeUser = this.loginService.currentUserName;

    this.clientLocations = this.clientLocationsService.getClientLocations();

    this.RejectStatuses = this.rejectedStatusService.getListOfStatusOfReject();

    this.CancelPoSummary =
      this.cancelledPOTransactionStatusService.getListOfStatusOfData();

    this.HideRejectRowUsingJquery();

    //Call the PercentaGE aLLOWABLE
    this.AllowablePercentages =
      this.allowablePercentageService.getAllAlowablePercentage();

    //Call The active Allowable Percentage Dynamic Entry
    this.AllowableNearlyExpiryDays =
      this.tblNearlyExpiryMgmtService.getAllExpiryDaysData();
  }

  poRecievingTabforRefresh(val) {
    this.getPOrecievingList();
    this.getPOcancelledList();

    this.ChildForm = "4000";
    this.dualbindingchanges++;

    this.ChildForm = this.dualbindingchanges.toString();

  }



  myFunctionOne() {
    console.log('Call Function One from Component One');
  }

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

  errorMessageToster() {
    this.toastr.error(this.errorMessage, 'Notifications');
  }

  showUpdatingSuccess() {
    this.toastr.success('Successfully Updated!', 'Notifications');
  }

  showReceivedSuccess() {
    this.toastr.success('Successfully Received!', 'Notifications');
  }

  FieldOutRequiredField() {
    this.toastr.warning('Fill out the required fields!', 'Notifications');
    this.checklistDataList = [];
    this.data = [];
    console.log(this.checklistDataList);
  }

  PartialReceivingCheckingonCancellation() {
    this.toastr.warning(
      'You have a pending partial receiving!',
      'Notifications'
    );
  }

  totalRejectConfirmationField() {
    this.toastr.warning('Confirm the total number of reject!', 'Notifications');
  }

  showDeletedSuccess() {
    this.toastr.success('Successfully Deleted!', 'Notifications');
  }

  showCancelledPOSuccess() {
    this.toastr.success('Cancelled Successfully!', 'Notifications');
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

  GreatherThanTheOrder() {
    this.toastr.warning('Greather than Qty Order!', 'Notifications');
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

  onNewClick(event) {
    this.newForm.resetForm();
    setTimeout(() => {
      this.received_by.nativeElement.value = this.loginService.fullName;
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

          this.newProject.projectName = '';
          this.newProject.dateOfStart = '';
          this.newProject.teamSize = 0;
          this.newProject.active = false;
          this.newProject.clientLocationID = 0;
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
          this.newProject.a_compliance = "";
          this.newProject.a_remarks = "";
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

    //Additional Binding of Searching
    if ($('#txtSearchText').val().length == 0) {

      //Show Visibilit
      //START
      // this.projectsService.getAllProjects().subscribe((response: Project[]) => {
      //   this.projects = response;
      // });

      if (this.currentPageIndex == 1) {
        if (index == 0) {
          index = 7;
        }
        if (index == 1) {
          index = 8;
        }
        if (index == 2) {
          index = 9;
        }
        if (index == 3) {
          index = 10;
        }
        if (index == 4) {
          index = 11;
        }
        if (index == 5) {
          index = 12;
        }
        if (index == 6) {
          index = 13;
        }
      } else if (this.currentPageIndex == 2) {
        if (index == 0) {
          index = 14;
        }
        if (index == 1) {
          index = 15;
        }
        if (index == 2) {
          index = 16;
        }
        if (index == 3) {
          index = 17;
        }
        if (index == 4) {
          index = 18;
        }
        if (index == 5) {
          index = 19;
        }
        if (index == 6) {
          index = 20;
        }
      } else if (this.currentPageIndex == 3) {
        if (index == 0) {
          index = 21;
        }
        if (index == 1) {
          index = 22;
        }
        if (index == 2) {
          index = 23;
        }
        if (index == 3) {
          index = 24;
        }
        if (index == 4) {
          index = 25;
        }
        if (index == 5) {
          index = 26;
        }
        if (index == 6) {
          index = 27;
        }
      } else if (this.currentPageIndex == 4) {
        if (index == 0) {
          index = 28;
        }
        if (index == 1) {
          index = 29;
        }
        if (index == 2) {
          index = 30;
        }
        if (index == 3) {
          index = 31;
        }
        if (index == 4) {
          index = 32;
        }
        if (index == 5) {
          index = 33;
        }
        if (index == 6) {
          index = 34;
        }
      } else {
      }
      //END

    }
    else {

      // this.projectsService.getAllProjects().subscribe((response: Project[]) => {
      //   this.projects = response;
      // });



      this.projectsService
        .SearchProjects('Po_number', this.searchText)
        .subscribe((response: Project[]) => {
          this.projects = response;
          this.showLoading = false;
          this.calculateNoOfPages();
          this.totalPoRowCount = response.length;
        });



    }///



    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.fullName;
    this.resetValueS();
    //first
    this.RandomNumber = Math.floor(Math.random() * 1000000 + 1);

    setTimeout(() => {
      this.editProject.projectID = this.projects[index].projectID;
      // this.editProject.projectID = Math.floor((Math.random() * 1000000) + 1);
      this.editProject.projectName = this.projects[index].projectName;
      this.editProject.dateOfStart = this.projects[index].dateOfStart
        .split('/')
        .reverse()
        .join('-'); //yyyy-MM-dd
      this.editProject.teamSize = 40;
      this.editProject.active = this.projects[index].active;
      this.editProject.clientLocationID = this.projects[index].clientLocationID;
      this.editProject.clientLocation = this.projects[index].clientLocation;
      this.editProject.status = 'In Force';
      this.editProject.supplier = this.projects[index].supplier;
      this.editProject.item_code = this.projects[index].item_code;
      this.editProject.item_class = this.projects[index].item_class;
      this.editProject.item_type = this.projects[index].item_type;
      this.editProject.major_category = this.projects[index].major_category;
      this.editProject.sub_category = this.projects[index].sub_category;
      this.editProject.is_expirable = this.projects[index].is_expirable;
      this.expirable_material = this.projects[index].is_expirable;
      this.editProject.item_description = this.projects[index].item_description;
      this.editProject.po_number = this.projects[index].po_number;
      this.editProject.po_date = this.projects[index].po_date;
      this.editProject.pr_number = this.projects[index].pr_number;
      this.editProject.pr_date = this.projects[index].pr_date;
      this.editProject.qty_order = this.projects[index].qty_order;
      this.editProject.qty_uom = this.projects[index].qty_uom;
      this.editProject.is_activated = this.Activator;

      this.editProject.unit_price = this.projects[index].unit_price;

      this.editProject.actual_remaining_receiving =
        this.projects[index].actual_remaining_receiving;
      this.editProject.received_by_QA = this.activeUser;

      this.editProject.qcReceivingDate = this.ToDay;

      this.editProject.status_of_reject_one = this.StringNone;
      this.editProject.status_of_reject_two = this.StringNone;
      this.editProject.status_of_reject_three = this.StringNone;

      this.editProject.count_of_reject_one = this.Deactivator;
      this.editProject.count_of_reject_two = this.Deactivator;
      this.editProject.count_of_reject_three = this.Deactivator;
      this.editProject.total_of_reject_mat = this.Deactivator;
      //Section 1
      //A
      this.editProject.a_delivery_van_desc =
        this.projects[index].a_delivery_van_desc;

      //B
      this.editProject.b_cooling_system_desc =
        this.projects[index].b_cooling_system_desc;

      //C
      this.editProject.c_inner_walls_desc =
        this.projects[index].c_inner_walls_desc;

      //D
      this.editProject.d_plastic_curtains_desc =
        this.projects[index].d_plastic_curtains_desc;

      //E
      this.editProject.e_thereno_pest_desc =
        this.projects[index].e_thereno_pest_desc;

      //Section 2
      //A
      this.editProject.a_clean_company_dos =
        this.projects[index].a_clean_company_dos;

      //B
      this.editProject.b_delivery_staff_symptoms_dos =
        this.projects[index].b_delivery_staff_symptoms_dos;

      //C
      this.editProject.c_inner_walls_clean_dos =
        this.projects[index].c_inner_walls_clean_dos;

      //D
      this.editProject.d_plastic_curtains_dos =
        this.projects[index].d_plastic_curtains_dos;

      //E
      this.editProject.e_no_accessories_dos =
        this.projects[index].e_no_accessories_dos;

      //F

      this.editProject.f_no_pests_sightings_dos =
        this.projects[index].f_no_pests_sightings_dos;

      //Section 3
      //A
      this.editProject.a_pallet_crates_tres =
        this.projects[index].a_pallet_crates_tres;

      //B
      this.editProject.b_product_contamination_tres =
        this.projects[index].b_product_contamination_tres;

      //C
      this.editProject.c_uncessary_items_tres =
        this.projects[index].c_uncessary_items_tres;

      //D
      this.editProject.d_products_cover_tres =
        this.projects[index].d_products_cover_tres;

      //Serction 4
      //A
      this.editProject.a_certificate_coa_kwatro_desc =
        this.projects[index].a_certificate_coa_kwatro_desc;

      //B
      this.editProject.b_po_kwatro_desc = this.projects[index].b_po_kwatro_desc;

      //C
      this.editProject.c_msds_kwatro_desc =
        this.projects[index].c_msds_kwatro_desc;

      //D
      this.editProject.d_food_grade_desc =
        this.projects[index].d_food_grade_desc;


      //Section 5
      //A
      this.editProject.a_qty_received_singko_singko =
        this.projects[index].a_qty_received_singko_singko;

      //B
      this.editProject.b_mfg_date_desc_singko =
        this.projects[index].b_mfg_date_desc_singko;

      //C
      this.editProject.c_expirydate_desc_singko =
        this.projects[index].c_expirydate_desc_singko;

      //D
      this.editProject.d_packaging_desc_singko =
        this.projects[index].d_packaging_desc_singko;

      //E
      this.editProject.e_no_contaminants_desc_singko =
        this.projects[index].e_no_contaminants_desc_singko;

      //F
      this.editProject.f_qtyrejected_desc_singko =
        this.projects[index].f_qtyrejected_desc_singko;

      //G
      this.editProject.g_rejected_reason_desc_singko =
        this.projects[index].g_rejected_reason_desc_singko;

      //H
      this.editProject.h_lab_sample_desc_singko =
        this.projects[index].h_lab_sample_desc_singko;

      $('txtexpected_delivery').val('');

      //Validation of EXPIRATION MATERIALS
      if (this.expirable_material == '0') {
        this.ExpiryDateChild.nativeElement.value = moment().format('MM/D/YYYY');
        $('#select_expiry').hide();
        $('#txtEditexpiration_date').hide();
      } else {
        $('#select_expiry').show();
        $('#txtEditexpiration_date').show();
      }

      this.editIndex = index;
    }, 100);
  }

  NearlyExpiryValidation() {
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

  // for checking of checklist data
  mapArrayData(ProjectID: any) {
    this.data = [];
    this.qcchecklist.map((parent) => {
      parent.childCheckLists.map((child) => {
        child.grandChildCheckLists.map((gchild) => {
          gchild.checkListParameters.map((param) => {
            this.data.push({
              parent_id: parent.parent_chck_id,
              gc_id: gchild.gc_id,
              cp_params_id: param.cp_params_id,
              parent_desc: parent.parent_chck_details,
              grand_child_desc: gchild.gc_description,
              manual_description: param.manual_description,
              cp_status: param.cp_status == true ? true : false,
              ProjectID: ProjectID,
            });
          });
        });
      });
    });

    console.log({
      // originalData: this.qcchecklist,
      custom: this.data,
    });
    this.checklistDataList = this.data;
    console.log(this.checklistDataList);
  }

  // Inserting of checklist data
  onRecieveButtonClick(ProjectID: any) {
    this.data = [];

    this.qcchecklist.map((parent) => {
      parent.childCheckLists.map((child) => {
        child.grandChildCheckLists.map((gchild) => {
          gchild.checkListParameters.map((param) => {
            this.data.push({
              parent_id: parent.parent_chck_id,
              gc_id: gchild.gc_id,
              cp_params_id: param.cp_params_id,
              parent_desc: parent.parent_chck_details,
              grand_child_desc: gchild.gc_description,
              manual_description: param.manual_description,
              cp_status: param.cp_status,
              ProjectID: ProjectID,
            });
          });
        });
      });
    });

    this.checklistDataList = this.data;

    this.allowableqty = this.TotalAllowablePercentage.nativeElement.value;
    this.actualqty = this.ActualDeliveryChild.nativeElement.value;
    var TotalAllowablePercentage =
      this.TotalAllowablePercentage.nativeElement.value;
    var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    var aplenght = $('#Allowable_Percentage_id').val().length;
    $('#characters').text(aplenght);
    var adlength = $('#actual_delivery_output').val().length;
    $('#characters').text(adlength);

    if (aplenght > adlength) {
      ///This is the minimun qty set pin for 10, 100, 999
      if (Number(TotalAllowablePercentage) >= Number(ActualDelivered)) {
      } else {
        this.AllowablePercentageExceed();
        $('#actual_delivery_output').val(''); ///LLL
        return;
      }
    } else {
      //This is for large scale validation for thousand's qty
      if (this.allowableqty < this.actualqty) {
        this.AllowablePercentageExceed();
        $('#actual_delivery_output').val(''); //Additional Data on 12/6/2021
        return;
      }
    }

    // To set two dates to two variables
    var date1 = new Date($('#txtEditReceivingDate').val());
    var date2 = new Date($('#txtEditexpiration_date').val());

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    var ExpiryDaysActivated =
      this.ActiveNearlyExpirySetpoint.nativeElement.value;
    var ItemDesc = this.ItemDescription.nativeElement.value;

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

    if (this.editForm.valid) {
      if (this.expirable_material == '0') {
        //Start
        Swal.fire({
          title: 'Are you sure, you want to receive the item/s?',
          text: ItemDesc,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
        }).then((result) => {
          if (result.isConfirmed) {
            if (this.editForm.valid) {
              // dito ang new trapping sa checklist bago e save need muna e fill out ang checklist form
              this.qcService.saveNewCheckList(this.checklistDataList).subscribe(
                (response) => {

                  this.getPOrecievingList();

                  $('#editFormCancel').trigger('click');
                  this.UpdateClickDetails();

                },
                (error) => {
                  this.errorMessage = error.error.message;
                  this.errorMessageToster();
                }
              );
            } else {
              this.FieldOutRequiredField();
            }
          }
        });

        //End
      } else {
        if (Difference_In_Days < ExpiryDaysActivated) {
          Swal.fire({
            title:
              'Are you sure, you want to receive the item expiry ' +
              Difference_In_Days +
              ' Days?',
            text: ItemDesc,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.editForm.valid) {
                // dito ang new trapping sa checklist bago e save need muna e fill out ang checklist form
                this.qcService
                  .saveNewCheckList(this.checklistDataList)
                  .subscribe(
                    (response) => {

                      this.getPOrecievingList();

                      $('#editFormCancel').trigger('click');
                      this.UpdateClickDetails();

                    },
                    (error) => {
                      this.errorMessage = error.error.message;
                      this.errorMessageToster();
                    }
                  );
              } else {
                this.FieldOutRequiredField();
              }
            }
          });
        } else {
          if (Difference_In_Days == ExpiryDaysActivated) {
            Swal.fire({
              title:
                'Are you sure you want to receive the item expiry  ' +
                Difference_In_Days +
                ' Days?',
              text: ItemDesc,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes',
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.editForm.valid) {
                  // dito ang new trapping sa checklist bago e save need muna e fill out ang checklist form
                  this.qcService
                    .saveNewCheckList(this.checklistDataList)
                    .subscribe(
                      (response) => {

                        this.getPOrecievingList();

                        $('#editFormCancel').trigger('click');
                        this.UpdateClickDetails();

                      },
                      (error) => {
                        this.errorMessage = error.error.message;
                        this.errorMessageToster();
                      }
                    );
                } else {
                  this.FieldOutRequiredField();
                }
              }
            });
          } else {
            //Start
            Swal.fire({
              title: 'Are you sure you want to receive the item ?',
              text: ItemDesc,
              icon: 'info',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes!',
            }).then((result) => {
              if (result.isConfirmed) {
                if (this.editForm.valid) {
                  // dito ang new trapping sa checklist bago e save need muna e fill out ang checklist form
                  this.qcService
                    .saveNewCheckList(this.checklistDataList)
                    .subscribe(
                      (response) => {
                        this.getPOrecievingList();


                        $('#editFormCancel').trigger('click');
                        this.UpdateClickDetails();

                      },
                      (error) => {
                        this.errorMessage = error.error.message;
                        this.errorMessageToster();
                      }
                    );
                } else {
                  this.FieldOutRequiredField();
                }
              }
            });
          }
        }
      }
    } else {
      this.FieldOutRequiredField();
    }
  }




  //Computaion
  ComputeRemainingQty() {
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const QtyOrder = this.QtyOrdered.nativeElement.value;

    const ActualRemainingReceiving =
      this.ActualRemainingReceiving.nativeElement.value;
    const totalRejection = this.confirmReject.nativeElement.value;

    if (QtyOrder == ActualRemainingReceiving) {


      this.ActualRemaining = ActualDelivered - totalRejection;
      this.ActualRemaining = ActualRemainingReceiving - this.ActualRemaining;
    } else {

      this.ActualRemaining = ActualDelivered - totalRejection;
      this.ActualRemaining = ActualRemainingReceiving - this.ActualRemaining;
    }
  }

  UpdateClickDetails() {
    if (this.editForm.valid) {
      this.ComputeRemainingQty();
      this.editProject.actual_remaining_receiving = this.ActualRemaining;
      var totalRejection = this.confirmReject.nativeElement.value;
      var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;

      if (totalRejection == 0) {
      } else {
        totalRejection = ActualDelivered - totalRejection;
        this.editProject.actual_delivery = totalRejection;
      }
      //End of Variable
      this.projectsService.updateProject(this.editProject).subscribe(
        (response: Project) => {
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
          p.status_of_reject_one = response.status_of_reject_one;
          p.status_of_reject_two = response.status_of_reject_two;
          p.status_of_reject_three = response.status_of_reject_three;
          p.count_of_reject_one = response.count_of_reject_one;
          p.count_of_reject_two = response.count_of_reject_two;
          p.count_of_reject_three = response.count_of_reject_three;
          p.total_of_reject_mat = response.total_of_reject_mat;

          this.projects[this.editIndex] = p;
          this.InsertANewPartialReceiving();
          // this.InsertPartialDatainMasterTable();
          //  remove muna ito
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
          this.getPOrecievingList();
          this.showReceivedSuccess();
          console.log("Received Item");


          $('#editFormCancel').trigger('click');

        },
        (error) => {
          console.log(error);
        }
      );
    }
    console.log("Received Item 2 ");


    setTimeout(() => {

      this.getPOrecievingList();
    }, 400);
  }

  InsertPartialDatainMasterTable() {
    this.editProject.is_activated = this.PartialEntry;
    // this.editProject.primaryID = 150;
    this.projectsService.insertProject(this.editProject).subscribe(
      (response: Project) => {
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

        this.projects.push(p);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Insert as Partial
  InsertANewPartialReceiving() {
    this.editProject.qcReceivingDate = this.ToDay; //for Secured Data  Flow

    // To set two dates to two variables
    var date1 = new Date($('#txtEditReceivingDate').val());
    var date2 = new Date($('#txtEditexpiration_date').val());

    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    var ExpiryDaysActivated =
      this.ActiveNearlyExpirySetpoint.nativeElement.value;

    if (this.expirable_material == '0') {
      this.editProject.is_expired = '0';
    } else {
      //Start
      if (Difference_In_Days == ExpiryDaysActivated) {
        this.editProject.is_expired = '1';
      } else {
        if (Difference_In_Days < ExpiryDaysActivated) {
          this.editProject.is_expired = '1';
        } else {
          this.editProject.is_expired = '0';
        }
      }
    }

    //Declaration for Partial Entry have a Dynamic Set-point
    var ExpiryDays = this.ActiveNearlyExpirySetpoint.nativeElement.value;
    this.editProject.days_expiry_setup = ExpiryDays;
    this.editProject.clientLocationID = 1;
    if (this.editForm.valid) {
      this.editProject.projectID = Math.floor(Math.random() * 1000000 + 1);

      this.projectsPartialPoService.insertProject2(this.editProject).subscribe(
        (response: Project) => {
          var p: Project = new Project();
          p.primaryID = response.primaryID;
          // p.projectID = response.projectID;
          p.projectName = response.projectName;
          p.dateOfStart = response.dateOfStart;
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

          p.received_by_QA = response.received_by_QA;
          // p.teamSize = response.teamSize;
          // p.clientLocation = response.clientLocation;

          p.status_of_reject_one = response.status_of_reject_one;
          p.status_of_reject_two = response.status_of_reject_two;
          p.status_of_reject_three = response.status_of_reject_three;

          p.count_of_reject_one = response.count_of_reject_one;
          p.count_of_reject_two = response.count_of_reject_two;
          p.count_of_reject_three = response.count_of_reject_three;

          p.total_of_reject_mat = response.total_of_reject_mat;

          p.days_expiry_setup = response.days_expiry_setup;
          p.is_expired = response.is_expired;

          p.is_approved_XP = response.is_approved_XP;
          p.is_approved_by = response.is_approved_by;
          p.is_approved_date = response.is_approved_date;

          // this.received_by.nativeElement.value = this.loginService.currentUserName;
          //  this.projects[this.editIndex] = p;
          this.projects.push(p);
        },
        (error) => {
          console.log(error + 'takla');
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
    //A
    this.deleteProject.a_delivery_van_desc =
      this.projects[index].a_delivery_van_desc;
    this.deleteProject.a_compliance = this.projects[index].a_compliance;
    this.deleteProject.a_remarks = this.projects[index].a_remarks;
    //B
    this.deleteProject.b_cooling_system_desc =
      this.projects[index].b_cooling_system_desc;
    this.deleteProject.b_compliance = this.projects[index].b_compliance;
    this.deleteProject.b_remarks = this.projects[index].b_remarks;
    //C
    this.deleteProject.c_inner_walls_desc =
      this.projects[index].c_inner_walls_desc;
    this.deleteProject.c_compliance = this.projects[index].c_compliance;
    this.deleteProject.c_remarks = this.projects[index].c_remarks;
    //D
    this.deleteProject.d_plastic_curtains_desc =
      this.projects[index].d_plastic_curtains_desc;
    this.deleteProject.d_compliance = this.projects[index].d_compliance;
    this.deleteProject.d_remarks = this.projects[index].d_remarks;
    //E
    this.deleteProject.e_thereno_pest_desc =
      this.projects[index].e_thereno_pest_desc;
    this.deleteProject.e_compliance = this.projects[index].e_compliance;
    this.deleteProject.e_remarks = this.projects[index].e_remarks;
    //Section2
    //A
    this.deleteProject.a_clean_company_dos =
      this.projects[index].a_clean_company_dos;
    this.deleteProject.a_compliance_dos = this.projects[index].a_compliance_dos;
    this.deleteProject.a_remarks_dos = this.projects[index].a_remarks_dos;
    //B
    this.deleteProject.b_delivery_staff_symptoms_dos =
      this.projects[index].b_delivery_staff_symptoms_dos;
    this.deleteProject.b_compliance_dos = this.projects[index].b_compliance_dos;
    this.deleteProject.b_remarks_dos = this.projects[index].b_remarks_dos;
    //C
    this.deleteProject.c_inner_walls_clean_dos =
      this.projects[index].c_inner_walls_clean_dos;
    this.deleteProject.c_compliance_dos = this.projects[index].c_compliance_dos;
    this.deleteProject.c_remarks_dos = this.projects[index].c_remarks_dos;
    //D
    this.deleteProject.d_plastic_curtains_dos =
      this.projects[index].d_plastic_curtains_dos;
    this.deleteProject.d_compliance_dos = this.projects[index].d_compliance_dos;
    this.deleteProject.d_remarks_dos = this.projects[index].d_remarks_dos;
    //E
    this.deleteProject.e_no_accessories_dos =
      this.projects[index].e_no_accessories_dos;
    this.deleteProject.e_compliance_dos = this.projects[index].e_compliance_dos;
    this.deleteProject.e_remarks_dos = this.projects[index].e_remarks_dos;
    //Section 4
    //A
    this.deleteProject.a_certificate_coa_kwatro_desc =
      this.projects[index].a_certificate_coa_kwatro_desc;
    this.deleteProject.a_compliance_kwatro =
      this.projects[index].a_compliance_kwatro;
    this.deleteProject.a_remarks_kwatro = this.projects[index].a_remarks_kwatro;
    //B
    this.deleteProject.b_po_kwatro_desc = this.projects[index].b_po_kwatro_desc;
    this.deleteProject.b_compliance_kwatro =
      this.projects[index].b_compliance_kwatro;
    this.deleteProject.b_remarks_kwatro = this.projects[index].b_remarks_kwatro;
    //C
    this.deleteProject.c_msds_kwatro_desc =
      this.projects[index].c_msds_kwatro_desc;
    this.deleteProject.c_compliance_kwatro =
      this.projects[index].c_compliance_kwatro;
    this.deleteProject.c_remarks_kwatro = this.projects[index].c_remarks_kwatro;
    //D
    this.deleteProject.d_food_grade_desc =
      this.projects[index].d_food_grade_desc;
    this.deleteProject.d_compliance_kwatro =
      this.projects[index].d_compliance_kwatro;
    this.deleteProject.d_remarks_kwatro = this.projects[index].d_remarks_kwatro;
    //Section 5
    //A
    this.deleteProject.a_qty_received_singko_singko =
      this.projects[index].a_qty_received_singko_singko;
    this.deleteProject.a_compliance_singko =
      this.projects[index].a_compliance_singko;
    this.deleteProject.a_remarks_singko = this.projects[index].a_remarks_singko;
    //B
    this.deleteProject.b_mfg_date_desc_singko =
      this.projects[index].b_mfg_date_desc_singko;
    this.deleteProject.b_compliance_singko =
      this.projects[index].b_compliance_singko;
    this.deleteProject.b_remarks_singko = this.projects[index].b_remarks_singko;
    //C
    this.deleteProject.c_expirydate_desc_singko =
      this.projects[index].c_expirydate_desc_singko;
    this.deleteProject.c_compliance_singko =
      this.projects[index].c_compliance_singko;
    this.deleteProject.c_remarks_singko = this.projects[index].c_remarks_singko;
    //D
    this.deleteProject.d_packaging_desc_singko =
      this.projects[index].d_packaging_desc_singko;
    this.deleteProject.d_compliance_singko =
      this.projects[index].d_compliance_singko;
    this.deleteProject.d_remarks_singko = this.projects[index].d_remarks_singko;
    //E
    this.deleteProject.e_no_contaminants_desc_singko =
      this.projects[index].e_no_contaminants_desc_singko;
    this.deleteProject.e_compliance_singko =
      this.projects[index].e_compliance_singko;
    this.deleteProject.e_remarks_singko = this.projects[index].e_remarks_singko;
    //F
    this.deleteProject.f_qtyrejected_desc_singko =
      this.projects[index].f_qtyrejected_desc_singko;
    this.deleteProject.f_compliance_singko =
      this.projects[index].f_compliance_singko;
    this.deleteProject.f_remarks_singko = this.projects[index].f_remarks_singko;
    //G
    this.deleteProject.g_rejected_reason_desc_singko =
      this.projects[index].g_rejected_reason_desc_singko;
    this.deleteProject.g_compliance_singko =
      this.projects[index].g_compliance_singko;
    this.deleteProject.g_remarks_singko = this.projects[index].g_remarks_singko;
    //H
    this.deleteProject.h_lab_sample_desc_singko =
      this.projects[index].h_lab_sample_desc_singko;
    this.deleteProject.h_compliance_singko =
      this.projects[index].h_compliance_singko;
    this.deleteProject.h_remarks_singko = this.projects[index].h_remarks_singko;
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
    var Item = this.ItemDescription.nativeElement.value;
    var PoNumero = this.PONumber.nativeElement.value;

    if ($('#ActivePartialReceiving').is(':visible')) {
      this.getPOcancelledList();
      this.PartialReceivingCheckingonCancellation();
      return;
    } else {
    }

    Swal.fire({
      title: 'Are you sure you want to cancel the PO Number ' + PoNumero + '?',
      text: Item,
      icon: 'info',
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

  onCancelClick(event, index: number) {
    this.editForm.resetForm();
    this.received_by.nativeElement.value = this.loginService.fullName;
    this.resetValueS();
    //first


    if ($('#txtSearchText').is(':visible')) {
      this.projectsService
        .SearchProjects('Po_Number', this.searchText)
        .subscribe((response: Project[]) => {
          this.projects = response;
          this.showLoading = false;
          this.calculateNoOfPages();
          this.totalPoRowCount = response.length;
        });
    } else {
      this.projectsService.getAllProjects().subscribe((response: Project[]) => {
        this.projects = response;
      });

      if (this.currentPageIndex == 1) {
        if (index == 0) {
          index = 7;
        }
        if (index == 1) {
          index = 8;
        }
        if (index == 2) {
          index = 9;
        }
        if (index == 3) {
          index = 10;
        }
        if (index == 4) {
          index = 11;
        }
        if (index == 5) {
          index = 12;
        }
        if (index == 6) {
          index = 13;
        }
      } else if (this.currentPageIndex == 2) {
        if (index == 0) {
          index = 14;
        }
        if (index == 1) {
          index = 15;
        }
        if (index == 2) {
          index = 16;
        }
        if (index == 3) {
          index = 17;
        }
        if (index == 4) {
          index = 18;
        }
        if (index == 5) {
          index = 19;
        }
        if (index == 6) {
          index = 20;
        }
      } else if (this.currentPageIndex == 3) {
        if (index == 0) {
          index = 21;
        }
        if (index == 1) {
          index = 22;
        }
        if (index == 2) {
          index = 23;
        }
        if (index == 3) {
          index = 24;
        }
        if (index == 4) {
          index = 25;
        }
        if (index == 5) {
          index = 26;
        }
        if (index == 6) {
          index = 27;
        }
      } else if (this.currentPageIndex == 4) {
        if (index == 0) {
          index = 28;
        }
        if (index == 1) {
          index = 29;
        }
        if (index == 2) {
          index = 30;
        }
        if (index == 3) {
          index = 31;
        }
        if (index == 4) {
          index = 32;
        }
        if (index == 5) {
          index = 33;
        }
        if (index == 6) {
          index = 34;
        }
      } else {
      }
    }

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
      this.editProject.unit_price = this.projects[index].unit_price;

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
      //A
      //Bluk Payload Remove
      $('txtexpected_delivery').val('');

      //Addition Set Point for Validation of Partial Data
      // this.ActivePartialReceiving.nativeElement.value = "0";

      this.PoNumberBinding = this.projects[index].po_number;
      // this.PoNumberChild.nativeElement.value;
      this.ProjectsAllowableQty = this.projectsPartialPoService.SearchProjects(
        'Po_number',
        this.PoNumberBinding
      );
      this.ProjectsAllowableQty.subscribe.toString;

      this.editIndex = index;

      setTimeout(() => {
        if ($('#ActivePartialReceiving').is(':visible')) {

          this.PartialComment = 'haddata';
        } else {

          this.PartialComment = 'unsetdata';
          $('#CancelPO').show();
        }
      }, 170);
    }, 400);
  }

  UpdateDeactivatedTransactions() {
    this.projectsService.updateProject(this.editProject).subscribe(
      (response: Project) => {
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
        this.editProject.projectID = null;
        this.editProject.projectName = null;
        this.editProject.dateOfStart = null;
        this.editProject.teamSize = null;
        this.editProject.supplier = null;
        this.editProject.teamSize = null;
        this.editProject.unit_price = null;
        this.editProject.active = false;
        this.editProject.clientLocationID = null;
        this.editProject.status = null;
        this.editProject.item_code = null;
        this.editProject.item_description = null;
        this.editProject.po_number = null;
        this.editProject.po_date = moment(new Date()).format('MM/DD/YYYY');
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
        this.editProject.is_activated = null;
        this.editProject.status_of_reject_one = null;
        this.editProject.status_of_reject_two = null;
        this.editProject.status_of_reject_three = null;
        this.editProject.count_of_reject_one = null;
        this.editProject.count_of_reject_two = null;
        this.editProject.count_of_reject_three = null;
        this.editProject.total_of_reject_mat = null;

        this.showCancelledPOSuccess();
        this.getPOcancelledList();

        this.ngOnInit();

        $('#editFormCancel').trigger('click');
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
        this.deleteProject.a_clean_company_dos = null;
        this.deleteProject.a_compliance_dos = null;
        this.deleteProject.a_remarks_dos = null;
        //B
        this.deleteProject.b_delivery_staff_symptoms_dos = null;
        this.deleteProject.b_compliance_dos = null;
        this.deleteProject.b_remarks_dos = null;
        //C
        this.deleteProject.c_inner_walls_clean_dos = null;
        this.deleteProject.c_compliance_dos = null;
        this.deleteProject.c_remarks_dos = null;
        //D
        this.deleteProject.d_plastic_curtains_dos = null;
        this.deleteProject.d_compliance_dos = null;
        this.deleteProject.d_remarks_dos = null;
        //E
        this.deleteProject.e_no_accessories_dos = null;
        this.deleteProject.e_compliance_dos = null;
        this.deleteProject.e_remarks_dos = null;
        //F
        this.deleteProject.f_compliance_dos = null;
        this.deleteProject.f_no_pests_sightings_dos = null;
        this.deleteProject.f_remarks_dos = null;
        //Section 3
        //A
        this.deleteProject.a_pallet_crates_tres = null;
        this.deleteProject.a_compliance_tres = null;
        this.deleteProject.a_remarks_tres = null;
        //B
        this.deleteProject.b_product_contamination_tres = null;
        this.deleteProject.b_compliance_tres = null;
        this.deleteProject.b_remarks_tres = null;
        //C
        this.deleteProject.c_uncessary_items_tres = null;
        this.deleteProject.c_compliance_tres = null;
        this.deleteProject.c_remarks_tres = null;
        //D
        this.deleteProject.d_products_cover_tres = null;
        this.deleteProject.d_compliance_tres = null;
        this.deleteProject.d_remarks_tres = null;

        //Section 4
        //A
        this.deleteProject.a_certificate_coa_kwatro_desc = null;
        this.deleteProject.a_compliance_kwatro = null;
        this.deleteProject.a_remarks_kwatro = null;
        //B
        this.deleteProject.b_po_kwatro_desc = null;
        this.deleteProject.b_compliance_kwatro = null;
        this.deleteProject.b_remarks_kwatro = null;
        //C
        this.deleteProject.c_msds_kwatro_desc = null;
        this.deleteProject.c_compliance_kwatro = null;
        this.deleteProject.c_remarks_kwatro = null;
        //D
        this.deleteProject.d_food_grade_desc = null;
        this.deleteProject.d_compliance_kwatro = null;
        this.deleteProject.d_remarks_kwatro = null;
        //Section 5
        //A
        this.deleteProject.a_qty_received_singko_singko = null;
        this.deleteProject.a_compliance_singko = null;
        this.deleteProject.a_remarks_singko = null;
        //B
        this.deleteProject.b_mfg_date_desc_singko = null;
        this.deleteProject.b_compliance_singko = null;
        this.deleteProject.b_remarks_singko = null;
        //C
        this.deleteProject.c_expirydate_desc_singko = null;
        this.deleteProject.c_compliance_singko = null;
        this.deleteProject.c_remarks_singko = null;
        //D
        this.deleteProject.d_packaging_desc_singko = null;
        this.deleteProject.d_compliance_singko = null;
        this.deleteProject.d_remarks_singko = null;
        //E
        this.deleteProject.e_no_contaminants_desc_singko = null;
        this.deleteProject.e_compliance_singko = null;
        this.deleteProject.e_remarks_singko = null;
        //F
        this.deleteProject.f_qtyrejected_desc_singko = null;
        this.deleteProject.f_compliance_singko = null;
        this.deleteProject.f_remarks_singko = null;
        //G
        this.deleteProject.g_rejected_reason_desc_singko = null;
        this.deleteProject.g_compliance_singko = null;
        this.deleteProject.g_remarks_singko = null;
        //H
        this.deleteProject.h_lab_sample_desc_singko = null;
        this.deleteProject.h_compliance_singko = null;
        this.deleteProject.h_remarks_singko = null;

        this.calculateNoOfPages();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearchTextKeyup(event) {
    //Recall the calculateNoOfPages
    if ($('#txtSearchText').is(':empty')) {
      // this.ngOnInit();
    }

    this.calculateNoOfPages();
  }

  onHideShowDetails(event) {
    this.projectsService.toggleDetails();
  }

  onPageIndexClicked(pageIndex: number) {
    // this.currentPageIndex = pageIndex;
    //Set currentPageIndex
    if (pageIndex >= 0 && pageIndex < this.pages.length) {
      this.currentPageIndex = pageIndex;
    }
  }

  onAddAdditionalRejectRow(event: any) {
    if ($('#rejectionrow1').is(':visible')) {


      if ($('#rejectionrow2').is(':visible')) {

        if ($('#rejectionrow3').is(':visible')) {

          this.showLimitonAddingRejection();
        } else {

          $('#rejectionrow3').show();
          $('#rejectionrow32').show();
          $('#total-reject').show();
          $('#total-confirm-reject').show();
          $('#AddRejectBtn').hide();
        }
      } else {

        $('#rejectionrow2').show();
        $('#rejectionrow22').show();
        $('#total-reject').show();
        $('#total-confirm-reject').show();
      }
    } else {

      $('#rejectionrow1').show();
      $('#rejectionrow12').show();
      $('#remove-remarks-button').show();
      $('#total-reject').show();
      $('#total-confirm-reject').show();
    }


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
    }

    var a = this.rejectNo1.nativeElement.value;
    var b = this.rejectNo2.nativeElement.value;
    var c = this.rejectNo3.nativeElement.value;
    var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    var TotalReject = this.totalofReject.nativeElement.value;
    var summary = +a + +b + +c;

    this.totalofReject.nativeElement.value = summary;

    if (ActualDelivered >= summary) {
    } else {
      this.RejectionGreaterThanReceiving();
    }
  }

  onChangeEventReject2(event: any) {
    if (this.rejectNo2.nativeElement.value == '') {
      this.rejectNo2.nativeElement.value = '0';
      console.warn('Empty Quantity in the textInput! ');
    }



    var a = this.rejectNo1.nativeElement.value;
    var b = this.rejectNo2.nativeElement.value;
    var c = this.rejectNo3.nativeElement.value;
    var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    var TotalReject = this.totalofReject.nativeElement.value;
    var summary = +a + +b + +c;

    this.totalofReject.nativeElement.value = summary;

    if (ActualDelivered >= summary) {
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

    var ExpiryDaysActivated =
      this.ActiveNearlyExpirySetpoint.nativeElement.value;
    var ItemDesc = this.ItemDescription.nativeElement.value;

    if (Difference_In_Days == ExpiryDaysActivated) {
      Swal.fire({
        title: 'Below Standard Expiration ' + Difference_In_Days + ' Days?',
        text: ItemDesc,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    } else {
      this.ExpiryDateChild.nativeElement.value = ' ';
      this.ExpiryDateChild.nativeElement.focus();
    }

    if (Difference_In_Days < ExpiryDaysActivated) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title:
          'Below Standards Expiration Days  ' + Difference_In_Days + ' Days?',
        text: ItemDesc,
        showConfirmButton: false,
        timer: 3500,
      });
    } else {
      this.ExpiryDateChild.nativeElement.value = ' ';
      this.ExpiryDateChild.nativeElement.focus();
    }
  }

  onChangeEventReject3(event: any) {
    if (this.rejectNo3.nativeElement.value == '') {
      this.rejectNo3.nativeElement.value = '0';

    }

    var a = this.rejectNo1.nativeElement.value;
    var b = this.rejectNo2.nativeElement.value;
    var c = this.rejectNo3.nativeElement.value;
    var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    var TotalReject = this.totalofReject.nativeElement.value;
    var summary = +a + +b + +c;

    this.totalofReject.nativeElement.value = summary;

    if (ActualDelivered >= summary) {

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
    var TotalAllowablePercentage =
      this.TotalAllowablePercentage.nativeElement.value;
    var ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    var QtyOrder = this.QtyOrdered.nativeElement.value;
    var ActualRemainingReceiving =
      this.ActualRemainingReceiving.nativeElement.value;

    this.ActualRemaining = QtyOrder - ActualDelivered;

    //Allowable Percentage
    var aplenght = $('#Allowable_Percentage_id').val().length;
    $('#characters').text(aplenght);
    //Actual Delivery Functionalioty
    var adlength = $('#actual_delivery_output').val().length;
    $('#characters').text(adlength);

    if (aplenght > adlength) {
      //Do Something programmble
      if (Number(TotalAllowablePercentage) >= Number(ActualDelivered)) {

      } else {
        this.AllowablePercentageExceed();
        $('#actual_delivery_output').val('');
      }
    } else {
      if (Number(TotalAllowablePercentage) >= Number(ActualDelivered)) {

      } else {

        this.AllowablePercentageExceed();
        $('#actual_delivery_output').val('');
      }
    }
  }

  AllowablePercentageComputation(event: any) {
    // Allowable Percentage Computation
    const ExpectedDelivery = this.ExpectedDeliveryActual.nativeElement.value;
    const ActivatedAllowablePercentage =
      this.ActiveAllowablePercentage.nativeElement.value;
    // const TotalAllowablePercentage = this.TotalAllowablePercentage.nativeElement.value;
    const TotalAllowablePercentage =
      this.TotalAllowablePercentage.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const QtyOrder = this.QtyOrdered.nativeElement.value;
    const ActualRemainingReceiving =
      this.ActualRemainingReceiving.nativeElement.value;

    //Allowable Percentage Computation
    const summary = ActivatedAllowablePercentage / 100;
    const summaryadd1 = summary + 1;
    const finalcomputation = ActualRemainingReceiving * summaryadd1;
    this.TotalAllowablePercentage.nativeElement.value = finalcomputation;

    //End of Computation
    if (QtyOrder == ActualRemainingReceiving) {
      // if(ExpectedDelivery > QtyOrder)
      if (ExpectedDelivery == TotalAllowablePercentage) {
      } else {
        if (TotalAllowablePercentage >= ExpectedDelivery) {
        } else {
          $('txtexpected_delivery').val('');
          $('txtexpected_delivery').focus();
          // this.GreatherThanTheOrder(); //Be Carefull
        }
      }
    } else {
      if (TotalAllowablePercentage >= ExpectedDelivery) {
      } else {
        $('txtexpected_delivery').val('');
        $('txtexpected_delivery').focus();
        // this.GreatherThanTheOrder(); //Be Carefull
      }
    }
  }

  InitialComputation() {
    const a = this.rejectNo1.nativeElement.value;
    const b = this.rejectNo2.nativeElement.value;
    const c = this.rejectNo3.nativeElement.value;
    const ActualDelivered = this.ActualDeliveryChild.nativeElement.value;
    const TotalReject = this.totalofReject.nativeElement.value;
    const summary = +a + +b + +c;

    this.totalofReject.nativeElement.value = summary;
  }

  ConfirmNoofReject(event: any) {
    this.InitialComputation();

    if (this.confirmReject.nativeElement.value == '') {
      this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
    } else {
      if (
        this.totalofReject.nativeElement.value ==
        this.confirmReject.nativeElement.value
      ) {
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML = '';
      } else {
        this.rejectIsnotMactchSpanTag.nativeElement.innerHTML =
          'No. of total reject is not match';
      }
    }
  }
}
