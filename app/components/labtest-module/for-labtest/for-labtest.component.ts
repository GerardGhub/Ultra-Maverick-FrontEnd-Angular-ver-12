import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ForLabtest } from '../models/for-labtest';
import * as $ from 'jquery';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { ForLabtestService } from '../services/for-labtest.service';
import { LabtestRecords } from '../models/labtest-records';
import { LabtestRecordsService } from '../services/labtest-records.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import * as moment from 'moment';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { dateFormat } from 'highcharts';
import { LabaratoryProcedure } from '../../../models/laboratory-procedures/labaratory-procedure';
import { LabTestProcedureService } from '../../../services/labtest-procedures-service/lab-test-procedure.service';
import { LabTestRemarks } from '../../../models/labtest-remarks/lab-test-remarks';
import { LabtestRemarksService } from '../../../services/labtest-remarks-service/labtest-remarks.service';
import { LabtestSubRemarksService } from '../../../services/labtest-sub-remarks-service/labtest-sub-remarks-service.service';
import { LabtestSubRemarks } from '../../../models/labtest-sub-remarks/labtest-sub-remarks';
import { LabtestApproval } from '../models/labtest-approval';
import { LabtestForApprovalService } from '../services/labtest-forapproval.service';
import { NgxPrintDirective } from 'ngx-print';
import { UpperCasePipe } from '@angular/common';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-for-labtest',
  templateUrl: './for-labtest.component.html',
  styleUrls: ['./for-labtest.component.scss'],
})

export class ForLabtestComponent implements OnInit {
  constructor(
    private forLabtestService: ForLabtestService,
    private labtestRecordsService: LabtestRecordsService,
    private formBuilder: FormBuilder,
    public loginService: LoginService,
    private labTestProceduresedureService: LabTestProcedureService,
    private labtestRemarksService: LabtestRemarksService,
    private labtestSubRemarksService: LabtestSubRemarksService,
    private labtestForApprovalService: LabtestForApprovalService,
    private printDirective: NgxPrintDirective,
    private toastr: ToastrService,
    public appComponent: AppComponent 
  ) { }

  forlabtest: ForLabtest[] = [];
  labtestRecords: LabtestRecords[] = [];
  labTestProcedures: LabaratoryProcedure[] = [];
  labTestRemarks: LabTestRemarks[] = [];
  labtestSubRemarks: LabtestSubRemarks[] = [];
  labtestApproval: LabtestApproval[] = [];

  forLabAccessCodeList: any = [];

  rejectRemarks: any = [];
  showLoading: boolean = true;

  editIndex: number = null;

  //Autofocus TextBoxes
  @ViewChild('defaultTextBox_New') defaultTextBox_New: ElementRef;
  @ViewChild('defaultTextBox_Edit') defaultTextBox_Edit: ElementRef;

  searchBy: string = 'item_code';
  searchText: string = '';

  sortBy: string = 'item_code';
  sortOrder: string = 'ASC';

  currentPageIndex: number = 0;
  pages: any[] = [];
  pagesForApproval: any[] = [];
  pageSize: number = 7;
  totalPoRowCount: number = null;

  totalForApprovalCount: number = null;
  totalLabtestRecords: number = null;

  //Reactive Forms
  resultForm: FormGroup;
  approveForm: FormGroup;
  cancelForm: FormGroup;
  superVisorApprovalForm: FormGroup;
  superVisorRejectForm: FormGroup;
  fkId: FormGroup;
  managerApprovalForm: FormGroup;
  managerRejectForm: FormGroup;
  internalMemoForm: FormGroup;

  approvalDetails: any;
  btnResult: any[] = [];

  newSubRemarksList: any[] = [];

  activeUser: string = '';
  qa_approval_status: string = '';
  qa_lab_status: string = '';
  DateNow: Date = null;
  toDaysDate = moment(new Date()).format('MM/DD/YYYY');
  showhideSubRemDiv: string = '';
  samples: string = '';
  laboratory_status: string = '';
  lab_result_released_by: string = '';
  lab_cancel_remarks: string = '';
  bbDate = moment(new Date()).format('MM/DD/YYYY');

  department: string = '';
  _samples: string = '';
  source_samples: string = '';
  lab_procedure: string = '';

  fileToUpload: File | null = null;

  lab_access_code: string = '';
  date_submitted = moment(new Date()).format('MM/DD/YYYY');
  date_analyzed = moment(new Date()).format('MM/DD/YYYY');
  date_released = moment(new Date()).format('MM/DD/YYYY');

  item_desc: string = '';
  bbd_date = moment(new Date()).format('MM/DD/YYYY');
  shelf_life_ext = moment(new Date()).format('MM/DD/YYYY');

  qa_approval_by: string = '';
  qa_supervisor: string = '';

  isGenerate = true;
  //Records Count Header Tagging for user Rights
  ForLabTest: number = 0;
  ForApproval: number = 0;
  LaboratoryTestRecords: number = 0;
  RecordsWithAccessCode: number = 0;

  @ViewChild('approved_by') approved_by: ElementRef;
  @ViewChild('approved_status') approved_status: ElementRef;
  @ViewChild('lab_status') lab_status: ElementRef;

  ngOnInit(): void {
    this.getLists();
    this.getLabRecordsLists();
    this.getLabProcedureList();
    this.getLabRemarks();
    this.getSubRemarksLists();
    this.getForApprovalList();
    this.getRejectRemarks();
    this.reactiveForm();
    this.ForLabTest = this.appComponent.ForLabTest;
  }

  getLists() {
    this.forLabtestService
      .getForLabtestDetails()
      .subscribe((response: ForLabtest[]) => {
        this.forlabtest = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalPoRowCount = response.length;
      });
  }

  getLabRecordsLists() {
    this.labtestRecordsService
      .getForLabtestDetails()
      .subscribe((response: LabtestRecords[]) => {
        // debugger;
        this.labtestRecords = response;
        this.showLoading = false;
        this.calculateNoOfPagesLabRecords();
        if (response) {
          this.totalLabtestRecords = response.length;
        }
      });
  }

  getLabProcedureList() {
    this.labTestProceduresedureService
      .getListOfStatusOfData()
      .subscribe((response: LabaratoryProcedure[]) => {
        this.labTestProcedures = response;
      });
  }

  getLabRemarks() {
    this.labtestRemarksService
      .getListOfStatusOfData()
      .subscribe((response: LabTestRemarks[]) => {
        this.labTestRemarks = response;
      });
  }

  getSubRemarksLists() {
    this.labtestSubRemarksService
      .getListOfStatusOfData()
      .subscribe((response: LabtestSubRemarks[]) => {
        this.labtestSubRemarks = response;
      });
  }

  getRejectRemarks() {
    this.labtestForApprovalService.getRejectRemarks().subscribe((response) => {
      if (response) {
        this.rejectRemarks = response;
      }
    });
  }

  getForApprovalList() {
    this.labtestForApprovalService
      .getApprovalDetails()
      .subscribe((response) => {
        // debugger;
        this.labtestApproval = response;
        // console.log(response)
        this.showLoading = false;
        this.calculateNoOfPagesLabRecords();

        if (response) {
          this.totalForApprovalCount = response.length;
        }
      });
  }

  HideSearchBtn(event: any) {
    $('#SearchBtnDetailed').show();
  }

  onSearchTextKeyup(event: any) {
    this.calculateNoOfPages();
  }

  onSearchTextKeyupLabRecords(event: any) {
    this.calculateNoOfPagesLabRecords();
  }

  onPageIndexClicked(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  onFilterCategory(val: any) {
    if (!val) {
      this.getLists();
    } else {
      const items = this.forlabtest.filter(
        (category) => category.category === val
      );
      this.forlabtest = items;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }
  }

  onFilterLabRecordsCategory(val: any) {
    if (!val) {
      this.getLabRecordsLists();
    } else {
      const items = this.labtestRecords.filter(
        (category) => category.category === val
      );
      this.labtestRecords = items;
      // this.showLoading = false;
      this.calculateNoOfPagesLabRecords();
    }
  }

  onGetNewSubRemarksList(val: any) {
    const items = this.labtestSubRemarks.filter(
      (item) => item.lab_remarks_desc_parent === val
    );
    this.newSubRemarksList = items;
    this.showhideSubRemDiv = val;
  }

  labTestTabforRefresh(val: any) {
    this.getLists();
    this.getLabRecordsLists();
    this.getForApprovalList();
  }

  labTestTabRecordsForRefresh(val: any) {
    this.getForApprovalList();
    this.getLists();
    this.getLabRecordsLists();
  }

  successApprovalToaster() {
    this.toastr.success('Successfully approved!', 'Message');
  }

  successCancelToaster() {
    this.toastr.success('Successfully Cancelled!', 'Message');
  }

  successRejectedToaster() {
    this.toastr.success('Laboratory test successfully rejected!', 'Message');
  }

  successLabResultToaster() {
    this.toastr.success('Laboratory test successfully submitted!', 'Message');
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var forLabtest = filterPipe.transform(
      this.forlabtest,
      this.searchBy,
      this.searchText
    );
    var noOfPages = Math.ceil(forLabtest.length / this.pageSize);

    this.pages = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  calculateNoOfPagesLabRecords() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultLabtestRecords = filterPipe.transform(
      this.labtestRecords,
      this.searchBy,
      this.searchText
    );
    var noOfPages = Math.ceil(resultLabtestRecords.length / this.pageSize);

    this.pagesForApproval = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesForApproval.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  // Reactive Forms *********************************************************************************************************************
  reactiveForm() {
    this.resultForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      item_code: this.formBuilder.control(null, [Validators.required]),
      item_description: this.formBuilder.control(null, [Validators.required]),
      supplier: this.formBuilder.control(null, [Validators.required]),
      qa_approval_date: this.formBuilder.control(null, [Validators.required]),
      po_number: this.formBuilder.control(null, [Validators.required]),
      po_date: this.formBuilder.control(null, [Validators.required]),
      pr_no: this.formBuilder.control(null, [Validators.required]),
      pr_date: this.formBuilder.control(null, [Validators.required]),
      qty_received: this.formBuilder.control(null, [Validators.required]),
      uom: this.formBuilder.control(null, [Validators.required]),
      lab_request_by: this.formBuilder.control(null, [Validators.required]),
      client_requestor: this.formBuilder.control(null, [Validators.required]),
      lab_result_released_by: this.formBuilder.control(null, [Validators.required]),
      lab_result_released_date: this.formBuilder.control(null, [Validators.required]),
      lab_result_remarks: this.formBuilder.control(null),
      lab_sub_remarks: this.formBuilder.control(null),
      lab_exp_date_extension: this.formBuilder.control(null, [Validators.required]),
      laboratory_procedure: this.formBuilder.control(null, [Validators.required]),
      date_submitted: this.formBuilder.control(null, [Validators.required]),
      samples: this.formBuilder.control(null, [Validators.required]),
      laboratory_status: this.formBuilder.control(null, [Validators.required]),
      qa_approval_status: this.formBuilder.control(null, [Validators.required]),
      files: this.formBuilder.control(null)
    });

    this.approveForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      qa_approval_by: this.formBuilder.control(null, [Validators.required]),
      qa_approval_status: this.formBuilder.control(null, [Validators.required]),
      qa_approval_date: this.formBuilder.control(null, [Validators.required]),
      lab_status: this.formBuilder.control(null, [Validators.required]),
    });

    this.superVisorApprovalForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      item_code: this.formBuilder.control(null),
      item_description: this.formBuilder.control(null),
      supplier: this.formBuilder.control(null),
      qa_approval_date: this.formBuilder.control(null),
      po_number: this.formBuilder.control(null),
      po_date: this.formBuilder.control(null),
      pr_no: this.formBuilder.control(null),
      pr_date: this.formBuilder.control(null),
      qty_received: this.formBuilder.control(null),
      uom: this.formBuilder.control(null),
      lab_request_by: this.formBuilder.control(null),
      client_requestor: this.formBuilder.control(null),
      lab_result_released_date: this.formBuilder.control(null),
      lab_exp_date_extension: this.formBuilder.control(null),
      date_submitted: this.formBuilder.control(null),
      samples: this.formBuilder.control(null),
      laboratory_status: this.formBuilder.control(null),
      qa_approval_status: this.formBuilder.control(null),
      files: this.formBuilder.control(null),

      lab_req_id: this.formBuilder.control(null, [Validators.required]),
      qa_supervisor_is_approve_by: this.formBuilder.control(null, [Validators.required]),
      lab_result_remarks: this.formBuilder.control(null, [Validators.required]),
      lab_sub_remarks: this.formBuilder.control(null, [Validators.required]),
      laboratory_procedure: this.formBuilder.control(null, [Validators.required]),
    });

    this.superVisorRejectForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      LabTest_CancelledReason: this.formBuilder.control(null, [Validators.required])
    });

    this.cancelForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      lab_cancel_by: this.formBuilder.control(null, [Validators.required]),
      lab_cancel_by_date: this.formBuilder.control(null, [Validators.required]),
      lab_cancel_remarks: this.formBuilder.control(null, [Validators.required]),
      qa_approval_status: this.formBuilder.control(null, [Validators.required]),
    });

    this.managerApprovalForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      item_code: this.formBuilder.control(null),
      item_description: this.formBuilder.control(null),
      supplier: this.formBuilder.control(null),
      qa_approval_date: this.formBuilder.control(null),
      po_number: this.formBuilder.control(null),
      po_date: this.formBuilder.control(null),
      pr_no: this.formBuilder.control(null),
      pr_date: this.formBuilder.control(null),
      qty_received: this.formBuilder.control(null),
      uom: this.formBuilder.control(null),
      lab_request_by: this.formBuilder.control(null),
      client_requestor: this.formBuilder.control(null),
      lab_result_released_date: this.formBuilder.control(null),
      lab_exp_date_extension: this.formBuilder.control(null),
      date_submitted: this.formBuilder.control(null),
      samples: this.formBuilder.control(null),
      laboratory_status: this.formBuilder.control(null),
      qa_approval_status: this.formBuilder.control(null),
      files: this.formBuilder.control(null),

      lab_req_id: this.formBuilder.control(null, [Validators.required]),
      qa_supervisor_is_approve_by: this.formBuilder.control(null, [Validators.required]),
      lab_result_remarks: this.formBuilder.control(null, [Validators.required]),
      lab_sub_remarks: this.formBuilder.control(null, [Validators.required]),
      laboratory_procedure: this.formBuilder.control(null, [Validators.required]),
      tsqa_approval_by: this.formBuilder.control(null, [Validators.required])
    });

    this.managerRejectForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      LabTest_CancelledReason: this.formBuilder.control(null, [Validators.required])
    });

    this.internalMemoForm = this.formBuilder.group({
      department: this.formBuilder.control(null, [Validators.required]),
      samples: this.formBuilder.control(null, [Validators.required]),
      source_of_samples: this.formBuilder.control(null, [Validators.required]),
      lab_procedure: this.formBuilder.control(null, [Validators.required]),

      lab_access_code: this.formBuilder.control(null, [Validators.required]),
      date_submitted: this.formBuilder.control(null, [Validators.required]),
      date_analyzed: this.formBuilder.control(null, [Validators.required]),
      date_relaeased: this.formBuilder.control(null, [Validators.required]),
      request_by: this.formBuilder.control(null, [Validators.required]),

    });
  }

  // Populate Fields ********************************************************************************************************************
  onRecieveClick(forLabtestParam: ForLabtest) {
    this.approveForm.patchValue(forLabtestParam);
    this.editIndex = this.forlabtest.indexOf(forLabtestParam);

    this.approveForm.patchValue({
      qa_approval_by: this.loginService.fullName,
      qa_approval_date: moment(new Date()).format('MM/DD/YYYY'),
      qa_approval_status: '1',
      lab_status: 'LAB APPROVED',
    });

    if (this.approveForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Recieve?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.forLabtestService
            .updateForLabtestDetails(this.approveForm.value)
            .subscribe(
              (response: ForLabtest) => {
                //Update the response in Grid
                this.forlabtest[this.editIndex] = response;
                //Reset the editForm
                this.successApprovalToaster();
                this.approveForm.reset();
                $('#approvalCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );

          // Swal.fire(
          //   'Approved!',
          //   'For Lab Test Approved successfully!',
          //   'success'
          // )

        }
      });
    }
  }

  onResultClick(item: any) {
    this.resultForm.reset();
    this.resultForm.patchValue(item);

    this.resultForm.patchValue({
      lab_exp_date_extension: moment(new Date(item.lab_exp_date_extension)).format('MM/DD/YYYY'),
      lab_result_released_by: this.loginService.fullName,
      laboratory_status: 'LAB RESULT',
      qa_approval_status: '2',
      date_submitted: moment(new Date()).format('MM/DD/YYYY'),
      samples: 'RAW MATS',
      qa_approval_date: moment(new Date(item.qa_approval_date)).format('MM/DD/YYYY'),
      pr_date: moment(new Date(item.pr_date)).format('MM/DD/YYYY'),
      po_date: moment(new Date(item.po_date)).format('MM/DD/YYYY'),

    });
  }

  OnAttachedImage(file: any) {
    this.fileToUpload = file.item(0).name;
    console.log(this.fileToUpload)
    // this.resultForm.patchValue({
    //   files: this.fileToUpload
    // });

  }

  cancelLabtestClick(event, forLabtestParam: ForLabtest) {
    console.log(forLabtestParam);
    this.cancelForm.reset();

    setTimeout(() => {
      //Set data into approveForm
      this.cancelForm.patchValue(forLabtestParam);
      this.editIndex = this.forlabtest.indexOf(forLabtestParam);
      this.qa_approval_status = '3';
      this.lab_cancel_remarks = 'CANCELLED';
      this.activeUser = this.loginService.currentUserName;
      this.toDaysDate = moment(new Date()).format('YYYY-MM-DD');
    }, 100);
  }

  onQAvisorApproveDetailsClick(item: any) {
    this.superVisorApprovalForm.reset();
    this.superVisorApprovalForm.patchValue(item);

    this.superVisorApprovalForm.patchValue({
      item_description: item.item_desc,
      qa_supervisor_is_approve_by: this.loginService.fullName,
      lab_exp_date_extension: moment(new Date(item.lab_exp_date_extension)).format('MM/DD/YYYY'),
      qa_approval_date: moment(new Date(item.qa_approval_date)).format('MM/DD/YYYY'),
      pr_date: moment(new Date(item.pr_date)).format('MM/DD/YYYY'),
      po_date: moment(new Date(item.po_date)).format('MM/DD/YYYY'),
    });
  }

  onQARejectDetailsClick(item: any) {
    this.superVisorRejectForm.reset();

    this.superVisorRejectForm.patchValue({
      id: item.fk_receiving_id,
    });
  }

  onManagerApproveDetailsClick(item: any) {
    this.managerApprovalForm.reset();
    this.managerApprovalForm.patchValue(item);

    this.managerApprovalForm.patchValue({
      tsqa_approval_by: this.loginService.fullName,
      laboratory_procedure: item.laboratory_procedure
    })
  }

  onManagerRejectDetailsClick(item: any) {
    this.managerRejectForm.reset();

    this.managerRejectForm.patchValue({
      id: item.fk_receiving_id
    });
  }

  print(item: any) {
    this.department = item.client_requestor;
    this._samples = 'RAW MATS';
    this.source_samples = item.client_requestor;
    this.lab_procedure = item.laboratory_procedure;
    this.lab_access_code = item.lab_access_code;
    this.date_submitted = item.date_added;
    this.date_analyzed = item.qa_approval_date;
    this.date_released = item.lab_result_released_date;
    this.item_desc = item.item_desc;
    this.bbd_date = item.bbd;
    this.shelf_life_ext = item.lab_exp_date_extension;
    this.qa_approval_by = item.qa_approval_by;
    this.qa_supervisor = item.qa_supervisor_is_approve_by;

    this.printDirective.printSectionId = 'print-section';
    this.printDirective.useExistingCss = true;
    this.printDirective.print();
  }

  // CRUD *******************************************************************************************************************************
  onApproveClick() {
    if (this.approveForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Approve?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.forLabtestService
            .updateForLabtestDetails(this.approveForm.value)
            .subscribe(
              (response: ForLabtest) => {

                this.successApprovalToaster();
                this.approveForm.reset();
                $('#approvalCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  onLabResultSubmit() {

    // const formData = new FormData();
    // formData.append('resultForm', this.resultForm.value);

    if (this.resultForm.valid) {
      Swal.fire({
        title: 'Are you sure, you want to submit the Laboratory Test Result?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.forLabtestService
            .proceedApprovedForLabtestDetails(this.resultForm.value)
            .subscribe(
              (response) => {
                this.getLists();
                this.successLabResultToaster();
                this.resultForm.reset();
                $('#proceedAndApproveFormCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );

        }
      });
    }
  }

  onContinueCancel() {
    if (this.cancelForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Cancel?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.forLabtestService
            .cancelForLabtestDetails(this.cancelForm.value)
            .subscribe(
              (response: ForLabtest) => {
                this.getLists();
                this.cancelForm.reset();
                this.successCancelToaster();
                $('#CancelledCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  onApproveByQAVisor() {
    if (this.superVisorApprovalForm.valid) {
      Swal.fire({
        title: 'Are you sure, you want to Approve the Laboratory Test Result?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.labtestForApprovalService
            .qaVisorApprovalDetails(this.superVisorApprovalForm.value)
            .subscribe(
              (response) => {
                this.getForApprovalList();
                this.successApprovalToaster();
                this.superVisorApprovalForm.reset();
                $('#QAVisorApprovalCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  onQAreject() {
    if (this.superVisorRejectForm.valid) {
      Swal.fire({
        title: 'Are you sure, you want to reject the Laboratory Test Result?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.labtestForApprovalService
            .qaVisorRejectDetails(this.superVisorRejectForm.value)
            .subscribe(
              (response) => {
                //Reset the editForm
                // this.onQARejectById();
                this.getForApprovalList();
                this.successRejectedToaster();

                this.superVisorRejectForm.reset();
                $('#qaRejectModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  onQARejectById() {
    this.forLabtestService
      .qaVisorRejectDetailsById(this.superVisorRejectForm.value.id)
      .subscribe(
        (response: ForLabtest) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onApproveByQAManager() {
    if (this.managerApprovalForm.valid) {
      Swal.fire({
        title: 'Are you sure, you want to Approve the Laboratory Test Result?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.labtestForApprovalService
            .managerApproval(this.managerApprovalForm.value)
            .subscribe(
              (response: LabtestApproval) => {

                this.getForApprovalList();
                this.successApprovalToaster();
                this.managerApprovalForm.reset();
                $('#QAManagerApprovalCancelModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  onManagereject() {
    if (this.managerRejectForm.valid) {
      Swal.fire({
        title: 'Are you sure, you want to reject the Laboratory Test Result?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call
          this.labtestForApprovalService
            .managerReject(this.managerRejectForm.value)
            .subscribe(
              (response) => {
                //Reset the editForm
                // this.onQARejectById();
                this.getForApprovalList();
                this.successRejectedToaster();

                this.superVisorRejectForm.reset();
                $('#managerRejectModal').trigger('click');
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    }
  }

  // Generate Lab Access Code ************************************************************************************************************
  getRowItem(item: any, isChecked: boolean) {
    const req_id = item.lab_req_id;

    if (isChecked === true) {
      const checkDuplicate = this.forLabAccessCodeList.filter((res: any) => res.lab_req_id === req_id);
      if (checkDuplicate.length == 0)
        this.forLabAccessCodeList.push(item);
    }
    else {
      const index = this.forLabAccessCodeList.findIndex((res: any) => res.lab_req_id === req_id);
      this.forLabAccessCodeList.splice(index, 1);
    }

    console.log(this.forLabAccessCodeList);

    if (this.forLabAccessCodeList.length == 0) {
      this.isGenerate = true;
    } else {
      this.isGenerate = false;
    }
  }

  generateLabAcessCode() {
    this.internalMemoForm.reset();
    this.internalMemoForm.patchValue({
      department: 'DRY',
      samples: 'samples'
    })
  }

  saveGeneratedItem() {
    alert('ediwow!')
    if (this.internalMemoForm.valid) {
      // services here
    }
  }

  duplicateLabAccessCodeTrapping(code: string) {
    alert(code);
    // dito need e compare ung labaccesscode sa dab vs sa inputed
  }

}
