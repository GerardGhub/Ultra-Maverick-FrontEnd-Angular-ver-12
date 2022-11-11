import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { OnlineOrderService } from "./services/internal-order.service";
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { FilterPipe } from "../../../app/pipes/filter.pipe";
import { MaterialRequestMaster } from "./models/material-request-master";
import * as moment from 'moment';
import { LoginService } from '../../services/login.service';
import { DryWhStoreOrders } from "../../models/dry-wh-store-orders";
import { WhCheckerDashboardService } from "../../services/wh-checker-dashboard.service";

@Component({
  selector: "app-internal-order",
  templateUrl: "./internal-order.component.html",
  styleUrls: ["./internal-order.component.scss"]
})

export class InternalOrderComponent implements OnInit {
  constructor(
    private onlineOrderService: OnlineOrderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public loginService: LoginService,
    private whCheckerDashboardService: WhCheckerDashboardService,
  ) { }

  InternalOrderList: MaterialRequestMaster[] = [];
  storedispatchingrecords: DryWhStoreOrders[] = [];
  itemList: any = [];
  PreparedOrderList: any = [];
  DispatchOrderList: any = [];
  CancelledOrderList: any = [];

  totalStoreOrderDispatching: number = 0;

  editIndex: number = 0;
  deleteIndex: number = 0;
  hideApproveButton: number;

  approvalForm: FormGroup;
  cancelOrderItemForm: FormGroup;
  cancelOrderForm: FormGroup;

  //Properties for Searching
  searchBy: string = 'department_name';
  searchText: string = '';
  showLoading: boolean = true;

  //Date Today  
  dateToday = moment(new Date()).format('MM-DD-YYYY');
  preparation_date = moment(new Date()).format('MM-DD-YYYY');

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  errorMessage: string = '';
  successMessage: string = '';

  //Properties for Sorting
  sortBy: string = 'department_name';
  sortOrder: string = 'ASC';
  totalOrderRowCount: number = 0;
  totalPreparedOrderRowCount: number = 0;

  ngOnInit() {
    this.reactiveForms();
    this.getInternalOrderList();
    this.getInternalPreparedOrderList();
  }

  // REACTIVE FORMS *********************************************************************************
  reactiveForms() {
    this.approvalForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      prep_date: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),
      mrs_req_desc: this.formBuilder.control(null, [Validators.required]),
      department_name: this.formBuilder.control(null, [Validators.required]),
      mrs_requested_by: this.formBuilder.control(null, [Validators.required]),
      mrs_requested_date: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved_date: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Wh_checker_move_order_no: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });

    this.cancelOrderItemForm = this.formBuilder.group({
      item_code: this.formBuilder.control(null, [Validators.required]),
      item_desc: this.formBuilder.control(null, [Validators.required]),

      FK_dry_wh_orders_parent_id: this.formBuilder.control(null, [
        Validators.required,
      ]),
      primary_id: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_cancel: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Is_wh_checker_cancel_by: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Is_wh_checker_cancel_date: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Is_wh_checker_cancel_reason: this.formBuilder.control(null, [
        Validators.required,
      ]),
      total_state_repack_cancelled_qty: this.formBuilder.control(null),
    });

    this.cancelOrderForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      is_cancel_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_cancel_reason: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });
  }

  tabRefresh() {
    this.getInternalOrderList();
    this.getInternalPreparedOrderList();
  }
  getInternalOrderList() {
    this.onlineOrderService.getOrderList().subscribe((response) => {
      if (response) {
        this.InternalOrderList = response;
        this.showLoading = false;
        this.totalOrderRowCount = response.length;
        this.calculateNoOfPagesInternalOrders();
      }
    });
  }

  getInternalPreparedOrderList() {
    this.onlineOrderService.getPreparedDistinctOrder().subscribe((response) => {
      if (response) {
        this.PreparedOrderList = response;
        this.showLoading = false;
        this.totalPreparedOrderRowCount = response.length;
        this.calculateNoOfPagesPreparedOrders();
      }
    });
  }

  // Internal Orders *****************************************************************************************************

  calculateNoOfPagesInternalOrders() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.InternalOrderList, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }

    this.currentPageIndex = 0;
  }

  onSearchInternalOrder(event) {
    this.calculateNoOfPagesInternalOrders();
  }


  onApproveClick(item: any) {
    if (item.totalRejectItems > 0) {
      this.hideApproveButton = 1;
    } else {
      this.hideApproveButton = null;
    }

    this.getCountOrderDispatching();
    let shortDate = moment(new Date(item.is_approved_prepa_date)).format(
      'MM-DD-YYYY'
    );


    this.approvalForm.patchValue({
      id: item.id,
      prep_date: shortDate,
      recieving_date: this.dateToday,
      mrs_req_desc: item.mrs_req_desc,
      department_name: item.department_name,
      mrs_requested_date: item.mrs_requested_date,
      mrs_requested_by: item.mrs_requested_by,
      Is_wh_approved: 1,
      Is_wh_approved_by: this.loginService.fullName,
      Is_wh_approved_date: this.dateToday,
      Wh_checker_move_order_no: this.totalStoreOrderDispatching,
    });

    this.onlineOrderService.searchItems(item.id).subscribe((response) => {
      this.itemList = response;
      console.log(response);
    });
  }

  onPageIndexClicked(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  getCountOrderDispatching() {
    this.whCheckerDashboardService
      .getAllDispatchingStoreOrders()
      .subscribe((response) => {
        this.storedispatchingrecords = response;
        this.totalStoreOrderDispatching = response.length + 1;
      });
  }

  // CRUD OPERATION *********************************************************************************
  approvedOrder() {
    if (this.approvalForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to approve?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineOrderService
            .approveOrder(this.approvalForm.value)
            .subscribe(
              (response) => {

                setTimeout(() => {
                  this.tabRefresh();
                }, 400);

                this.successMessage = 'Approved Successfully!';
                this.approvalForm.reset();

                $('#closeApprovalModal').trigger('click');
                this.successToaster();
              },
              (error) => {
                this.errorMessage = error.error.message;
                this.errorToaster();
              }
            );
        }
      });
    }
  }


  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }


  // Prepared Orders *****************************************************************************************************
  calculateNoOfPagesPreparedOrders() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.PreparedOrderList, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }

    this.currentPageIndex = 0;
  }

  onSearchPreparedOrder(event) {
    this.calculateNoOfPagesPreparedOrders();
  }


  // Prepared Orders *****************************************************************************************************
  calculateNoOfPagesDispatchOrders() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.DispatchOrderList, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  onSearchDispatchOrders(event) {
    this.calculateNoOfPagesDispatchOrders();
  }


  // Prepared Orders *****************************************************************************************************
  calculateNoOfPagesCancelledOrders() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.CancelledOrderList, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  onSearchCancelledOrders(event) {
    this.calculateNoOfPagesCancelledOrders();
  }
}
