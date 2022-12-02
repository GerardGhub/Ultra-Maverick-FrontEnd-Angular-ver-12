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
import { RawMaterials } from "../../models/raw-material";
import { Observable } from "rxjs";
import { CancelledPOTransactionStatus } from "../../models/cancelled-potransaction-status";
import { CancelledPOTransactionStatusService } from "../../services/cancelled-potransaction-status.service";

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
    private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService
  ) { }

  InternalOrderList: MaterialRequestMaster[] = [];
  storedispatchingrecords: DryWhStoreOrders[] = [];
  itemList: any = [];
  PreparedOrderList: any = [];
  DispatchOrderList: any = [];
  CancelledOrderList: any = [];


  CancelPoSummary: Observable<CancelledPOTransactionStatus[]>;
  totalStoreOrderDispatching: number = 0;
  totalDispatchingCount: number = 0;
  totalCancelledOrderParent: number = 0;

  editIndex: number = 0;
  deleteIndex: number = 0;
  hideApproveButton: number;
  MRSId: number = 0;
  totalPreparedItems: number = 0;

  approvalForm: FormGroup;
  cancelOrderItemForm: FormGroup;
  cancelOrderForm: FormGroup;
  returnParentMRSOrderForm: FormGroup;

  //Properties for Searching
  searchBy: string = 'department_name';
  searchText: string = '';
  showLoading: boolean = true;

  //Date Today  
  dateToday = moment(new Date()).format('MM-DD-YYYY');
  preparation_date = moment(new Date()).format('MM-DD-YYYY');

  //Properties for Paging
  currentPageIndex: number = 0;
  currentPageIndexPreparedOrders: number = 0;
  currentPageIndexDispatching: number = 0;
  currentPageIndexCancelledOrder: number = 0;

  //Pages Storage
  pages: any[] = [];
  pagesPreparedOrders: any[] = [];
  pagesDispatching: any[] = [];
  pagesCancelledTransaction: any[] = [];
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
    this.CancelPoSummary =
      this.cancelledPOTransactionStatusService.getListOfStatusOfData();
    this.getDispatchingOrderList();
    this.getCancelledParentOrder();
    $('#mens').trigger('click');
  }

  getDispatchingOrderList() {
    this.onlineOrderService.getOrderForDispatchingList().subscribe((response) => {
      if (response) {
        this.DispatchOrderList = response;
        this.showLoading = false;
        this.totalStoreOrderDispatching = response.length;
        this.totalDispatchingCount = response.length;
        this.calculateNoOfPagesDispatchOrders();
      }
    });
  }

  getCancelledParentOrder() {

    this.onlineOrderService.getCancelOrderParent().subscribe((response) => {
      if (response) {
        this.CancelledOrderList = response;
        this.showLoading = false;
        this.totalCancelledOrderParent = response.length;
        this.calculateNoOfPagesCancelledOrders();
      }
    });

   
  }


  // REACTIVE FORMS *********************************************************************************
  reactiveForms() {
    this.approvalForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      mrs_id: this.formBuilder.control(null, [Validators.required]),
      prep_date: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),
      mrs_req_desc: this.formBuilder.control(null, [Validators.required]),
      department_name: this.formBuilder.control(null, [Validators.required]),
      mrs_requested_by: this.formBuilder.control(null, [Validators.required]),
      mrs_requested_date: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_approval_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_approved_date: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Wh_checker_move_order_no: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });

    this.cancelOrderItemForm = this.formBuilder.group({
      mrs_item_code: this.formBuilder.control(null, [Validators.required]),
      mrs_item_description: this.formBuilder.control(null, [Validators.required]),

      id: this.formBuilder.control(null, [
        Validators.required,
      ]),
      mrs_id: this.formBuilder.control(null, [Validators.required,]),

      Is_wh_checker_cancel: this.formBuilder.control(null, [
        Validators.required,
      ]),
      deactivated_by: this.formBuilder.control(null, [
        Validators.required,
      ]),

      cancel_reason: this.formBuilder.control(null, [
        Validators.required,
      ]),

    });

    this.cancelOrderForm = this.formBuilder.group({
      mrs_id: this.formBuilder.control(null, [Validators.required]),
      is_wh_checker_cancel_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_cancel_reason: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });

    this.returnParentMRSOrderForm = this.formBuilder.group({
      mrs_id: this.formBuilder.control(null, [Validators.required]),
      is_wh_checker_cancel_by: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_cancel_reason: this.formBuilder.control(null, [Validators.required,]),
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

  onUntaggedClick(event, StatusParam: RawMaterials) {
    console.warn(StatusParam);

  }


  getInternalPreparedOrderList() {
    this.onlineOrderService.getPreparedDistinctOrder().subscribe((response) => {
      if (response) {
        this.PreparedOrderList = response;
        this.showLoading = false;
        this.totalPreparedOrderRowCount = response.length;

        this.calculateNoOfPagesPreparedOrders();
      }
      if (response.status == 204)
      {
        this.ngOnInit();
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

    this.currentPageIndexPreparedOrders = 0;
  }

  onSearchInternalOrder(event) {
    this.calculateNoOfPagesInternalOrders();
  }


  onApproveClick(item: any) {
    if (item.totalRejectItems > 0) {
      this.hideApproveButton = 1;
    } else {
      this.hideApproveButton = 0; //not null
    }

    this.MRSId = item.id;

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
      Is_wh_checker_approval_by: this.loginService.fullName,
      Is_wh_approved_date: this.dateToday,
      Wh_checker_move_order_no: this.totalStoreOrderDispatching,
    });

    this.onlineOrderService.searchItems(item.id).subscribe((response) => {
      this.itemList = response;
  
    });
  }

  onViewCancelledClick(item: any) {


    this.MRSId = item.id;

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
      Is_wh_checker_approval_by: this.loginService.fullName,
      Is_wh_approved_date: this.dateToday,
      Wh_checker_move_order_no: this.totalStoreOrderDispatching,
    });

    this.onlineOrderService.searchItemsInactive(item.mrs_id).subscribe((response) => {
      this.itemList = response;

    });
  }


  CloseViewOrderRedirectToInternalOrder() {
    if (this.totalPreparedItems === 0) { } else {
      window.location.reload();
    }

  }

  onPageIndexClicked(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  onPageIndexClickedCancelledOrder(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pagesCancelledTransaction.length) {
      this.currentPageIndexCancelledOrder = ind;
    }
  }

  onPageIndexClickedPreparedOrders(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pagesPreparedOrders.length) {
      this.currentPageIndexPreparedOrders = ind;
    }
  }

  onPageIndexClickedDispatching(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pagesDispatching.length) {
      this.currentPageIndexDispatching = ind;
    }
  }

  getCountOrderDispatching() {
    this.whCheckerDashboardService
      .getAllDispatchingStoreOrders()
      .subscribe((response) => {
        this.storedispatchingrecords = response;
        this.totalStoreOrderDispatching = response.length + 1 + this.totalDispatchingCount;

      });
  }


  onCancelItemClick(item: any) {

    this.cancelOrderItemForm.patchValue({
      mrs_item_code: item.mrs_item_code,
      mrs_item_description: item.mrs_item_description,
      id: item.id,
      Is_wh_checker_cancel: '1',
      deactivated_by: this.loginService.fullName,
      cancel_reason: item.cancel_reason,
      mrs_id: this.MRSId
    });

  }

  onCancelOrderClick(item: any) {

    this.cancelOrderForm.patchValue({
      mrs_id: item.id,
      Is_wh_checker_cancel: '1',
      is_wh_checker_cancel_by: this.loginService.fullName,
      is_wh_checker_cancel_reason: item.cancel_reason,
    });

  }


  onReturnParentPreparationOrderClick(item: any) {

    //Typescript

    this.returnParentMRSOrderForm.patchValue({
      mrs_id: item.mrs_id,
      is_wh_checker_cancel_by: this.loginService.fullName,
      is_wh_checker_cancel_reason: item.cancel_reason,
    });



    Swal.fire({
      title: 'Are you sure you want to return?',
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.onlineOrderService
          .returnParentPreparationOrder(this.returnParentMRSOrderForm.value)
          .subscribe((response) => {

            //stampede
            this.successMessage = 'Order Return Successfully!';
            this.successToaster();

         
          });
          setTimeout(() => {

            this.getDispatchingOrderList();
            this.getInternalPreparedOrderList();
          }, 900);
    
      }
    });



  }

  onReturnItemClick(item: any) {

    this.cancelOrderItemForm.patchValue({
      mrs_item_code: item.mrs_item_code,
      mrs_item_description: item.mrs_item_description,
      id: item.id,
      Is_wh_checker_cancel: '1',
      deactivated_by: this.loginService.fullName,
      cancel_reason: item.cancel_reason,
      mrs_id: item.mrs_transact_no
    });

  }


  cancelOrderItem() {
    if (this.cancelOrderItemForm.valid) {
      Swal.fire({
        title: 'Are you sure you want to cancel the item?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineOrderService
            .cancelOrderItem(this.cancelOrderItemForm.value)
            .subscribe((response) => {

              this.onlineOrderService.searchItems(this.MRSId).subscribe((response) => {
                this.itemList = response;
              });
              //Modifier if you cancel some fucking orders
              this.totalPreparedItems = 1;
              $('#cancelOrderCloseModal').trigger('click');
              // $('#closeApprovalModal').trigger('click');
              this.successMessage = 'Item Cancel Successfully!';
              this.successToaster();
              setTimeout(() => {
                this.tabRefresh();
              }, 200);

            });
          ;
        }

      });
    }

  }

  returnOrderItemPartial() {

    
    if (this.cancelOrderItemForm.valid) {
      Swal.fire({
        title: 'Are you sure you want to return the item?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineOrderService
            .returnOrderItem(this.cancelOrderItemForm.value)
            .subscribe((response) => {
           
              this.MRSId = response.mrs_id;
              this.onlineOrderService.searchItemsInactive(this.MRSId).subscribe((response) => {
                this.itemList = response;
              });
           
              // //Modifier if you cancel some fucking orders
              this.totalPreparedItems = 1;
              $('#returnOrderCloseModal').trigger('click');
              // $('#closeApprovalModal').trigger('click');
              this.successMessage = 'Item Cancel Successfully!';
              this.successToaster();
              setTimeout(() => {
                this.tabRefresh();
              }, 200);

            });
          ;
        }

      });
    }

  }

  CancelOrderClick() {
    if (this.cancelOrderForm.valid) {
      Swal.fire({
        title: 'Are you sure you want to cancel?',
        text: '',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineOrderService
            .cancelParentPreparationOrder(this.cancelOrderForm.value)
            .subscribe((response) => {
      
                this.getInternalOrderList();
                this.getInternalPreparedOrderList();
   
                this.getDispatchingOrderList();
           
          
              //stampede
              this.successMessage = 'Order Cancelled Successfully!';
              this.successToaster();
   
            });
        }
      });
    }
  }

  // CRUD OPERATION *********************************************************************************
  approvedOrder(item: any) {
    this.getCountOrderDispatching();
    setTimeout(() => {
      this.approvalForm.patchValue({
        Is_wh_checker_approval_by: this.loginService.currentUserName,
        mrs_id: item.id,
        Wh_checker_move_order_no: this.totalStoreOrderDispatching
      });
    }, 100);

    // if (this.approvalForm.valid) {
    //Bujerard


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
          .approvePreparationOrder(this.approvalForm.value)
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
    // }
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
    this.pagesPreparedOrders = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesPreparedOrders.push({ pageIndex: i });
    }

    this.currentPageIndexPreparedOrders = 0;
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
    this.pagesDispatching = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesDispatching.push({ pageIndex: i });
    }
    this.currentPageIndexDispatching = 0;
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
    this.pagesCancelledTransaction = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesCancelledTransaction.push({ pageIndex: i });
    }
    this.currentPageIndexCancelledOrder = 0;
  }

  onSearchCancelledOrders(event) {
    this.calculateNoOfPagesCancelledOrders();
  }
}
