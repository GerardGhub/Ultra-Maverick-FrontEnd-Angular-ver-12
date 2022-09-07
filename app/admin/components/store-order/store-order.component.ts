import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { RejectedStatus } from 'src/app/models/rejected-status';
import { SystemCapabilityStatus } from 'src/app/models/system-capability-status';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { SystemCapabilityStatusService } from 'src/app/services/system-capability-status.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { DryWhStoreOrders } from 'src/app/models/dry-wh-store-orders';
import { WhCheckerDashboardService } from 'src/app/services/wh-checker-dashboard.service';
import { CancelledOrderService } from '../store-order-cancelled-transaction/services/cancelled-order.service';
import { PreparedOrdersService } from '../store-order-prepared/services/prepared-order.service';
import { DispatchingService } from '../store-order-dispatching/services/dispaching-order.service';
import { StoreOrderService } from './services/store-order.service';

@Component({
  selector: 'app-store-order',
  templateUrl: './store-order.component.html',
  styleUrls: ['./store-order.component.scss'],
})
export class StoreOrderComponent implements OnInit {
  constructor(
    private whCheckerDashboardService: WhCheckerDashboardService,
    private formBuilder: FormBuilder,
    private systemCapabilityStatusService: SystemCapabilityStatusService,
    private toastr: ToastrService,
    private storeOrderService: StoreOrderService,
    private preparedOrdersService: PreparedOrdersService,
    private dispatchingService: DispatchingService,
    private cancelledOrderService: CancelledOrderService
  ) {}

  //Objects for Holding Model Data
  storeOrders: any = [];
  preapredOrders: any = [];
  dispatchOrders: any = [];
  cancelledOrders: any = [];
  showLoading: boolean = true;

  totalStoreOrderRowCount: number = null;
  totalPreparedOrdersCount: number = null;
  totalDispatchingRowCount: number = null;
  totalCancelledCount: number = null;

  //Properties for Searching
  searchBy: string = 'reject_status_name';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'reject_status_name';
  sortOrder: string = 'ASC';

  //Reactive Forms
  newForm: FormGroup;
  editForm: FormGroup;

  //Sample for Testing Status
  samples: Observable<SystemCapabilityStatus[]>;

  ngOnInit() {
    this.getStoreOrderList();
    this.getPreparedOrdersCount();
    this.getDispatchingCount();
    this.getCancelledTransactionCount();
    this.reactiveForms();

    // Here
    this.samples =
      this.systemCapabilityStatusService.getSystemCapabilityStatus();
  }

  reactiveForms() {
    //Create newForm
    this.newForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      reject_status_name: this.formBuilder.control(null, [Validators.required]),
      is_active: this.formBuilder.control(null, [Validators.required]),
    });

    //Create editForm
    this.editForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      reject_status_name: this.formBuilder.control(null, [Validators.required]),
      is_active: this.formBuilder.control(null, [Validators.required]),
    });
  }

  getStoreOrderList() {
    this.storeOrderService.getStoreOrderList().subscribe((response) => {
      if (response) {
        this.storeOrders = response;
        this.showLoading = false;
        this.calculateNoOfPages();
        this.totalStoreOrderRowCount = response.length;
      }
    });
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.storeOrders, this.searchBy, this.searchText)
        .length / this.pageSize
    );
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

  FieldOutRequiredField() {
    this.toastr.warning('Field out the required fields!', 'Notifications');
  }

  onSearchTextChange(event) {
    this.calculateNoOfPages();
  }

  // Refresh Tabs

  tabRefresh() {
    this.getPreparedOrdersCount();
    this.getDispatchingCount();
    this.getCancelledTransactionCount();
    this.getStoreOrderList();
  }

  // Row Counts
  getPreparedOrdersCount() {
    this.preparedOrdersService.getPreparedOrderList().subscribe((response) => {
      if (response) {
        this.preapredOrders = response;
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
}
