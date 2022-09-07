import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { OnlineOrderService } from "./services/internal-order.service";
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { FilterPipe } from "src/app/pipes/filter.pipe";

@Component({
  selector: "app-internal-order",
  templateUrl: "./internal-order.component.html",
  styleUrls: ["./internal-order.component.scss"]
})

export class InternalOrderComponent implements OnInit {
  constructor(
    private OnlineOrderService : OnlineOrderService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
  ){}

  InternalOrderList: any = [];
  PreparedOrderList: any = [];
  DispatchOrderList: any = [];
  CancelledOrderList: any = [];

  editIndex: number = null;
  deleteIndex: number = null;

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


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

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

  onPageIndexClicked(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
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

  onSearchDispatchOrders(event){
    this. calculateNoOfPagesDispatchOrders();
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

  onSearchCancelledOrders(event){
    this. calculateNoOfPagesCancelledOrders();
  }
}
