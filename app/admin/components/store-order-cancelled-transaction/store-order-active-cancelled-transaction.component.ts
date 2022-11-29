import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DryWhStoreOrders } from '../../../models/dry-wh-store-orders';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { LoginService } from '../../../services/login.service';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { CancelledOrderService } from './services/cancelled-order.service';
import { StoreOrderService } from '../store-order/services/store-order.service';
import { PreparedOrdersService } from '../store-order-prepared/services/prepared-order.service';
import { DispatchingService } from '../store-order-dispatching/services/dispaching-order.service';

@Component({
  selector: 'app-store-order-active-cancelled-transaction',
  templateUrl: './store-order-active-cancelled-transaction.component.html',
  styleUrls: ['./store-order-active-cancelled-transaction.component.scss'],
})
export class StoreOrderActiveCancelledTransactionComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    private storeOrderService: StoreOrderService,
    private preparedOrdersService: PreparedOrdersService,
    private dispatchingService: DispatchingService,
    private cancelledOrderService: CancelledOrderService
  ) {}

  cancelledOrderList: any = [];
  cancelledOrderItemList: any = [];

  dispatchingList: any = [];
  preparedOrderList: any = [];
  storeOrders: any = [];

  reasonList: any = [];
  projects: DryWhStoreOrders[] = [];
  showLoading: boolean = true;

  searchBy: string = 'po_number';
  searchByItems: string = 'store_name';
  searchText: string = '';

  currentPageIndexCancelledTransaction: number = 0;
  pagesCancelledTransaction: any[] = [];
  pageSize: number = 7;

  pageSizeItemList: number = 2;
  pagesItemList: any[] = [];
  currentPageIndexItem: number = 0;

  dateToday = moment(new Date()).format('MM-DD-YYYY');

  //Sorting
  sortBy: string = 'po_number';
  sortOrder: string = 'ASC'; //ASC | DESC

 
  totalPreparedOrdersCount: number = 0;
  totalDispatchingRowCount: number = 0;
  totalCancelledCount: number = 0;

  cancelledViewForm: FormGroup;
  returnCancelledOrderForm: FormGroup;

  errorMessage: string = '';
  successMessage: string = '';

  ngOnInit(): void {
    this.getDistinctCancelledOrderList();
    this.reactiveForms();
    this.getReasonList();
  }

  getDistinctCancelledOrderList() {
    this.cancelledOrderService.getDistinctCancelledOrderList().subscribe((response) =>{
      if (response) {
        this.cancelledOrderList = response;
        this.totalCancelledCount = response.length;
        this.showLoading = false;
        this.calculateNoOfPages();
      }
    });
  }

  getReasonList() {
    this.cancelledOrderService.getReturnReason().subscribe((response) => {
      this.reasonList = response;
    });
  }

  onPageIndexClicked(pageIndex: number) {
    //Set currentPageIndex
    if (pageIndex >= 0 && pageIndex < this.pagesCancelledTransaction.length) {
      this.currentPageIndexCancelledTransaction = pageIndex;
    }
  }

  onSearchTextKeyup(event) {
    // this.editForm.resetForm();

    //Recall the calculateNoOfPages
    if ($('#txtSearchText').is(':empty')) {
      // this.ngOnInit();
    }

    this.calculateNoOfPages();
  }

  calculateNoOfPages() {
    let filterPipe = new FilterPipe();
    var resultProjects = filterPipe.transform(
      this.cancelledOrderList,
      this.searchBy,
      this.searchText
    );
    var noOfPages = Math.ceil(resultProjects.length / this.pageSize);

    // var noOfPages = Math.ceil(filterPipe.transform(this.projects, this.searchBy, this.searchText).length / this.pageSize);
    this.pagesCancelledTransaction = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesCancelledTransaction.push({ pageIndex: i });
    }
    this.currentPageIndexCancelledTransaction = 0;
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  tabRefresh() {
    this.getStoreOrdersCount();
    this.getPreparedCount();
    this.getDispatchingCount();
    this.getDistinctCancelledOrderList();
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

  getPreparedCount() {
    this.preparedOrdersService.getPreparedOrderList().subscribe((response) => {
      if (response) {
        this.preparedOrderList = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalDispatchingRowCount = response.length;
      }
    });
  }

  getDispatchingCount() {
    this.dispatchingService.getDispatchOrder().subscribe((response) => {
      if (response) {
        this.dispatchingList = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalCancelledCount = response.length;
      }
    });
  }

  // REACTIVE FORMS *****************************************************************************************************
  reactiveForms() {
    this.cancelledViewForm = this.formBuilder.group({
      preparation_date: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),
      category: this.formBuilder.control(null, [Validators.required]),
      store_name: this.formBuilder.control(null, [Validators.required]),
      route: this.formBuilder.control(null, [Validators.required]),
      area: this.formBuilder.control(null, [Validators.required]),
    });

    this.returnCancelledOrderForm = this.formBuilder.group({
      FK_dry_wh_orders_parent_id: this.formBuilder.control(null, [
        Validators.required,
      ]),
      primary_id: this.formBuilder.control(null, [Validators.required]),
      item_code: this.formBuilder.control(null, [Validators.required]),
      item_desc: this.formBuilder.control(null, [Validators.required]),
      Is_wh_checker_cancel_reason: this.formBuilder.control(null, [
        Validators.required,
      ]),
      total_state_repack_cancelled_qty: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });
  }

  // POPULATE VALUE *****************************************************************************************************
  onViewClick(item: any) {
    this.cancelledOrderService
      .searchItems(item.id)
      .subscribe((response) => {
        this.cancelledOrderItemList = response;
      });

    let shortDate = moment(new Date(item.is_approved_prepa_date)).format(
      'MM-DD-YYYY'
    );

    this.cancelledViewForm.patchValue({
      preparation_date: shortDate,
      recieving_date: this.dateToday,
      category: item.category,
      store_name: item.store_name,
      route: item.route,
      area: item.area,
    });
  }

  returnItemClick(item: any) {
    this.returnCancelledOrderForm.patchValue({
      FK_dry_wh_orders_parent_id: item.fK_dry_wh_orders_parent_id,
      primary_id: item.primary_id,
      item_code: item.item_code,
      item_desc: item.description,
      total_state_repack_cancelled_qty: 0,
    });
  }

  // CRUD ***************************************************************************************************************
  returnItemSubmit() {
    if (this.returnCancelledOrderForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Return?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelledOrderService
            .returnOrderItem(this.returnCancelledOrderForm.value)
            .subscribe(
              (response) => {
                // this.getCancelledOrderList();
    
                setTimeout(() => {
                  this.tabRefresh();
                  this.getDistinctCancelledOrderList();
                }, 400);
  

                this.successMessage = 'Returned Successfully!';
                this.returnCancelledOrderForm.reset();

                $('#_returnOrderCloseModal').trigger('click');
                $('#returnOrderCloseModal').trigger('click');
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
}
