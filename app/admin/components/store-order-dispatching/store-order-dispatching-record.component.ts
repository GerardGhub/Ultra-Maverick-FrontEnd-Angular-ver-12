import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DryWhStoreOrders } from '../../../../app/models/dry-wh-store-orders';
import { FilterPipe } from '../../../../app/pipes/filter.pipe';
import { LoginService } from '../../../../app/services/login.service';
import * as $ from 'jquery';
import { DispatchingService } from './services/dispaching-order.service';
import { StoreOrderService } from '../store-order/services/store-order.service';
import { PreparedOrdersService } from '../store-order-prepared/services/prepared-order.service';
import { CancelledOrderService } from '../store-order-cancelled-transaction/services/cancelled-order.service';

@Component({
  selector: 'app-store-order-dispatching-record',
  templateUrl: './store-order-dispatching-record.component.html',
  styleUrls: ['./store-order-dispatching-record.component.scss'],
})
export class StoreOrderDispatchingRecordComponent implements OnInit {
  // projects: DryWhStoreOrders[] = [];

  dispatchingList: any = [];
  dispatchingItems: any = [];

  preparedOrderList: any = [];
  storeOrders: any = [];
  cancelledOrders: any = [];

  showLoading: boolean = true;
  searchByDispatching: string = '';
  searchTextDispatching: string = '';

  currentPageIndexDispatching: number = 0;
  pagesDispatching: any[] = [];
  pageSize: number = 7;

  pageSizeItemList: number = 2;
  pagesItemList: any[] = [];
  // currentPageIndexItemDispatching: number = 0;

  sortBy: string = 'po_number';
  sortOrder: string = 'ASC'; //ASC | DESC
  dateToday = moment(new Date()).format('MM-DD-YYYY');
  totalCancelledCount: number = 0;
  totalDispatchingRowCount: number = 0;
  totalPreparedOrdersCount: number = 0;
  totalStoreOrderDispatching: number = 0;

  viewingForm: FormGroup;

  constructor(
    public loginService: LoginService,
    private formBuilder: FormBuilder,
    private storeOrderService: StoreOrderService,
    private preparedOrdersService: PreparedOrdersService,
    private dispatchingService: DispatchingService,
    private cancelledOrderService: CancelledOrderService
  ) { }

  ngOnInit(): void {
    this.getDispatchOrderList();
    this.reactiveforms();
  }

  getDispatchOrderList() {
    this.dispatchingService.getDispatchOrder().subscribe((response) => {
      this.dispatchingList = response;
      this.showLoading = false;
      this.calculateNoOfPages();
    });
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultProjects = filterPipe.transform(
      this.dispatchingList,
      this.searchByDispatching,
      this.searchTextDispatching
    );
    var noOfPages = Math.ceil(resultProjects.length / this.pageSize);

    this.pagesDispatching = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesDispatching.push({ pageIndex: i });
    }
    this.currentPageIndexDispatching = 0;
  }

  calculateNoOfPagesItems() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var resultProjects = '4';
    var noOfPagesItem = Math.ceil(
      resultProjects.length / this.pageSizeItemList
    );

    // var noOfPages = Math.ceil(filterPipe.transform(this.projects, this.searchBy, this.searchText).length / this.pageSize);
    this.pagesItemList = [];

    //Generate Pages
    for (let a = 0; a < noOfPagesItem; a++) {
      this.pagesItemList.push({ pageIndexItem: a });
    }
    this.currentPageIndexDispatching = 0;
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
    //Set currentPageIndex
    if (pageIndex >= 0 && pageIndex < this.pagesDispatching.length) {
      this.currentPageIndexDispatching = pageIndex;
    }
  }

  // REACTIVE FORMS ******************************************************************************************
  reactiveforms() {
    this.viewingForm = this.formBuilder.group({
      preparation_date: this.formBuilder.control(null, [Validators.required]),
      recieving_date: this.formBuilder.control(null, [Validators.required]),
      category: this.formBuilder.control(null, [Validators.required]),
      store_name: this.formBuilder.control(null, [Validators.required]),
      route: this.formBuilder.control(null, [Validators.required]),
      area: this.formBuilder.control(null, [Validators.required]),
    });
  }

  // POPULATE VALUE*******************************************************************************************
  onViewClick(item) {
    this.totalStoreOrderDispatching = item.wh_checker_move_order_no;
    this.dispatchingService.searchItems(item.id).subscribe((response) => {
      this.dispatchingItems = response;
    });

    let shortDate = moment(new Date(item.is_approved_prepa_date)).format(
      'MM-DD-YYYY'
    );

    this.viewingForm.patchValue({
      preparation_date: shortDate,
      recieving_date: this.dateToday,
      category: item.category,
      store_name: item.store_name,
      route: item.route,
      area: item.area,
    });
  }

  // CRUD ****************************************************************************************************

  tabRefresh() {
    this.getStoreOrdersCount();
    this.getPreparedCount();
    this.getCancelledTransactionCount();
    this.getDispatchOrderList();
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
