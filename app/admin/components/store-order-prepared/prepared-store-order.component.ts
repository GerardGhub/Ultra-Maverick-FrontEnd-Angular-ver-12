import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CancelledPOTransactionStatus } from '../../../models/cancelled-potransaction-status';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { CancelledPOTransactionStatusService } from '../../../services/cancelled-potransaction-status.service';
import { ClientLocationsService } from '../../../services/client-locations.service';
import { LoginService } from '../../../services/login.service';
import Swal from 'sweetalert2';
import { DryWhStoreOrders } from '../../../models/dry-wh-store-orders';
import { WhCheckerDashboardService } from '../../../services/wh-checker-dashboard.service';
import { PreparedOrdersService } from './services/prepared-order.service';
import { DispatchingService } from '../store-order-dispatching/services/dispaching-order.service';
import { CancelledOrderService } from '../store-order-cancelled-transaction/services/cancelled-order.service';
import { StoreOrderService } from '../store-order/services/store-order.service';
import { OnlineOrderService } from '../../../components/internal-preparation/services/internal-order.service';

@Component({
  selector: 'app-prepared-store-order',
  templateUrl: './prepared-store-order.component.html',
  styleUrls: ['./prepared-store-order.component.scss'],
})
export class PreparedStoreOrderComponent implements OnInit {
  preparedOrderList: any = [];
  itemList: any = [];
  storeOrders: any = [];
  dispatchOrders: any = [];
  cancelledOrders: any = [];

  storedispatchingrecords: DryWhStoreOrders[] = [];
  internaldispatchingrecords: any[] = [];
  CancelPoSummary: Observable<CancelledPOTransactionStatus[]>;

  showLoading: boolean = true;
  searchBy: string = 'po_number';
  searchByItems: string = 'store_name';
  searchText: string = '';

  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  pageSizeItemList: number = 2;
  pagesItemList: any[] = [];
  currentPageIndexItem: number = 0;

  totalPreparedOrderRowCount: number;
  totalStoreOrderDispatching: number = 0;
  totalInternalDispatchingCount: number = 0;

  dateToday = moment(new Date()).format('MM-DD-YYYY');
  preparation_date = moment(new Date()).format('MM-DD-YYYY');

  sortBy: string = 'po_number';
  sortOrder: string = 'ASC'; //ASC | DESC

  approvalForm: FormGroup;
  cancelOrderItemForm: FormGroup;
  cancelOrderForm: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';
  hideApproveButton: number;

  totalStoreOrderRowCount: number = 0;
  totalPreparedOrdersCount: number = 0;
  totalDispatchingRowCount: number = 0;
  totalCancelledCount: number = 0;

  constructor(
    private clientLocationsService: ClientLocationsService,
    private toastr: ToastrService,
    public loginService: LoginService,
    private cancelledPOTransactionStatusService: CancelledPOTransactionStatusService,
    private formBuilder: FormBuilder,
    private whCheckerDashboardService: WhCheckerDashboardService,
    private storeOrderService: StoreOrderService,
    private preparedOrdersService: PreparedOrdersService,
    private dispatchingService: DispatchingService,
    private cancelledOrderService: CancelledOrderService,
    public onlineOrderService: OnlineOrderService
  ) { }

  ngOnInit() {
    this.getPreparedOrderList();
    this.reactiveForms();
    this.getCountInternalOrderDispatching();
    this.getCountOrderDispatching();
    this.CancelPoSummary =
      this.cancelledPOTransactionStatusService.getListOfStatusOfData();
  }

  getPreparedOrderList() {
    this.preparedOrdersService.getPreparedOrderList().subscribe((response) => {
      if (response) {
        this.preparedOrderList = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalPreparedOrderRowCount = response.length;
      }
    });
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(
        this.preparedOrderList,
        this.searchBy,
        this.searchText
      ).length / this.pageSize
    );
    this.pages = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  calculateNoOfPagesItems() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultProjects = '4';
    var noOfPagesItem = Math.ceil(
      resultProjects.length / this.pageSizeItemList
    );

    // var noOfPages = Math.ceil(filterPipe.transform(this.preparedOrderList, this.searchBy, this.searchText).length / this.pageSize);
    this.pagesItemList = [];

    //Generate Pages
    for (let a = 0; a < noOfPagesItem; a++) {
      this.pagesItemList.push({ pageIndexItem: a });
    }
    this.currentPageIndexItem = 0;
  }

  getCountInternalOrderDispatching() {

    this.onlineOrderService.getOrderForDispatchingList().subscribe((response) => {
      if (response) {
        this.internaldispatchingrecords = response;
        this.totalInternalDispatchingCount = response.length;
      }
    });
  }

  getCountOrderDispatching() {
    this.whCheckerDashboardService
      .getAllDispatchingStoreOrders()
      .subscribe((response) => {
        this.storedispatchingrecords = response;
        this.totalStoreOrderDispatching = response.length + 1 + this.totalInternalDispatchingCount;
      });
  }

  onSearchTextKeyup(event) {
    // this.editForm.resetForm();

    //Recall the calculateNoOfPages
    if ($('#txtSearchText').is(':empty')) {
      // this.ngOnInit();
    }

    this.calculateNoOfPages();
  }

  onPageIndexClicked(pageIndex: number) {
    // this.currentPageIndex = pageIndex;
    //Set currentPageIndex
    if (pageIndex >= 0 && pageIndex < this.pages.length) {
      this.currentPageIndex = pageIndex;
    }
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  tabRefresh() {
    this.getStoreOrdersCount();
    this.getDispatchingCount();
    this.getCancelledTransactionCount();
    this.getPreparedOrderList();
  }

  // Row Counts
  getStoreOrdersCount() {
    this.storeOrderService.getStoreOrderList().subscribe((response) => {
      if (response) {
        this.storeOrders = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalPreparedOrdersCount = response.length;
      }
    });
  }

  getDispatchingCount() {
    this.dispatchingService.getDispatchOrder().subscribe((response) => {
      if (response) {
        this.dispatchOrders = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalDispatchingRowCount = response.length;
      }
    });
  }

  getCancelledTransactionCount() {
    this.cancelledOrderService.getCancelledOrderList().subscribe((response) => {
      if (response) {
        this.cancelledOrders = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalCancelledCount = response.length;
      }
    });
  }

  // REACTIVE FORMS *********************************************************************************
  reactiveForms() {
    this.approvalForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      prep_date: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),
      category: this.formBuilder.control(null, [Validators.required]),
      store_name: this.formBuilder.control(null, [Validators.required]),
      route: this.formBuilder.control(null, [Validators.required]),
      area: this.formBuilder.control(null, [Validators.required]),
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

  // POPULATE VALUE *********************************************************************************
  onApproveClick(item: any) {
    console.log(item);
    if (item.totalPreparedItems == item.total_state_repack) {
      this.hideApproveButton = 0;

    } else {
      this.hideApproveButton = 1;
    }

    this.getCountOrderDispatching();
    let shortDate = moment(new Date(item.is_approved_prepa_date)).format(
      'MM-DD-YYYY'
    );

    this.approvalForm.patchValue({
      id: item.id,
      prep_date: shortDate,
      recieving_date: this.dateToday,
      category: item.category,
      store_name: item.store_name,
      route: item.route,
      area: item.area,
      Is_wh_approved: 1,
      Is_wh_approved_by: this.loginService.fullName,
      Is_wh_approved_date: this.dateToday,
      Wh_checker_move_order_no: this.totalStoreOrderDispatching,
    });

    this.preparedOrdersService.searchItems(item.id).subscribe((response) => {
      this.itemList = response;
      console.log(response);
    });
  }

  onCancelItemClick(item: any) {
    this.cancelOrderItemForm.patchValue({
      item_code: item.item_code,
      item_desc: item.description,

      FK_dry_wh_orders_parent_id: item.fK_dry_wh_orders_parent_id,
      primary_id: item.primary_id,
      Is_wh_checker_cancel: '1',
      Is_wh_checker_cancel_by: this.loginService.fullName,
      Is_wh_checker_cancel_date: this.dateToday,
      total_state_repack_cancelled_qty: 1,
    });
  }

  onCancelOrderClick(item: any) {
    this.cancelOrderForm.patchValue({
      id: item.id,
      is_cancel_by: this.loginService.fullName,
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
          this.preparedOrdersService
            .approveOrder(this.approvalForm.value)
            .subscribe(
              (response) => {
                // this.getPreparedOrderList();
                this.tabRefresh();
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
          this.preparedOrdersService
            .cancelOrderItem(this.cancelOrderItemForm.value)
            .subscribe((response) => {

              setTimeout(() => {
                this.tabRefresh();
              }, 400);
              this.successMessage = 'Item Cancel Successfully!';

              this.cancelOrderItemForm.reset();

              $('#cancelOrderCloseModal').trigger('click');
              $('#closeApprovalModal').trigger('click');
              this.successToaster();
            });
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
          this.preparedOrdersService
            .cancelledOrder(this.cancelOrderForm.value)
            .subscribe((response) => {
              this.getPreparedOrderList();

              this.successMessage = 'Order Cancelled Successfully!';
              this.successToaster();
            });
        }
      });
    }
  }
}
