import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from '../../pipes/filter.pipe';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';
import { OnlineMrsService } from './services/online-mrs.service';
import * as $ from 'jquery';
import { AppComponent } from '../../app.component';
import { RoleModules } from '../../models/rolemodules';
import { Observable } from 'rxjs';
import { MainMenus } from '../../models/main-menus';
import { RawMaterials } from '../../models/raw-material';

@Component({
  selector: 'app-root',
  templateUrl: './online-mrs.component.html',
  styleUrls: ['./online-mrs.component.scss'],
})
export class OnlineMRSComponent implements OnInit {
  parentData: any = [];
  itemList: any = [];
  addedItemList: any = [];
  viewAddedItemList: any = [];
  RoleModule: RoleModules[] = [];
  MainMenu: Observable<MainMenus[]>;
  requestorFound: number = 0;
  totalMrsOrder: number = 0;

  approvedOrderList: any = [];
  cancelledOrderList: any = [];
  cancelReasonList: any = [];
  returnReasonList: any = [];
  // pagesTagged: any[] = [];

  searchBy: string = 'mrs_req_desc';
  searchText: string = '';

  searchTextRM: string = '';
  searchByRM: string = 'item_code';

  sortBy: string = 'mrs_req_desc';
  sortOrder: string = 'ASC';

  //Properties for Paging
  currentPageIndex: number = 0;
  currentPageIndexCancelled: number = 0;
  currentPageIndexApproved: number = 0;
  currentPageIndexRM: number = 0;
  pages: any[] = [];
  pagesCancelled: any[] = [];
  pagesApproved: any[] = [];

  pagesRawMats: any[] = [];
  pageSize: number = 7;
  showLoading: boolean = true;

  parentTitle: string = '';

  totalRoleModulesUntaggedNewRowCount: number = 0;
  departmentId: number = 0;
  fullName: string = '';
  userId: number;
  mrs_id_order_list: number = 0;
  mrs_item_code: string = '';
  mrs_id: number = 0;
  mrs_remarks: string = '';
  mrs_cancel_reason: string = '';
  mrs_order_qty: number;

  requestorRole: boolean;
  approverRole: boolean;
  Role: string = '';
  cancelledOrderCount: number;
  requestOrderCount: number;
  approvedOrderListCount: number;
  successMessage: string = '';

  // approval details field
  OrderBy: string = '';
  OrderDate = moment(new Date()).format('MM/DD/YYYY');

  ApprovedBy: string = '';
  ApprovedDate = moment(new Date()).format('MM/DD/YYYY');

  IssuedBy: string = '';
  IssuedDate = moment(new Date()).format('MM/DD/YYYY');

  toDaysDate = moment(new Date()).format('MM/DD/YYYY');

  addParent: FormGroup;
  editParent: FormGroup;
  itemReqForm: FormGroup;
  requestOrderDescForm: FormGroup;
  removeItemForm: FormGroup;
  editItemForm: FormGroup;
  cancelItemFormPartial: FormGroup;
  approveOrderRequestForm: FormGroup;
  cancelOrderRequestForm: FormGroup;
  returnOrderRequestForm: FormGroup;

  editIndex: number = 0;

  OrderList: number = 0;
  ApprovedOrders: number = 0;
  CancelledOrders: number = 0;

  constructor(
    public loginService: LoginService,
    public onlineMrsService: OnlineMrsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public appComponent: AppComponent
  ) { }

  ngOnInit(): void {
    this.getUserInformation();
    this.getParentList();
    this.getCancelledOrderList();
    this.getApprovedList();
    this.parentForms();
    this.parentFormPatchValue();
    this.getItemList();
    this.getCancelReasonList();
    this.getReturnReasonList();

    this.OrderList = this.appComponent.OrderList;
    this.ApprovedOrders = this.appComponent.ApprovedOrders;
    this.CancelledOrders = this.appComponent.CancelledOrders;

  }

  getParentList() {
    this.onlineMrsService.getParentList(this.loginService.Userid).subscribe(
      (response) => {
        this.parentData = response;
        if (response) {
          this.requestOrderCount = response.length;
        }




        const userRole = this.loginService.currentUserRoleSession;
        this.Role = userRole;

        // if(userRole === "Admin"){
        //   this.parentData = response;
        //   this.requestOrderCount = response.length;
        // }else{
        //   const dataById = response.filter(item => item.user_id === this.loginService.Userid);
        //   this.parentData = dataById;
        //   this.requestOrderCount = dataById.length;
        // }

        this.showLoading = false;
        this.calculateNoOfPages();
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  getItemList() {
    this.onlineMrsService.getItemList().subscribe((response) => {
      this.itemList = response;
      if (response) {
        this.totalRoleModulesUntaggedNewRowCount = response.length;
      }
      this.calculateNoOfPagesTagged();
    });
  }



  onSearchTextChange(event) {

    if ($('#txtSearchText').is(':empty')) {
      this.getItemList();
    }
    this.calculateNoOfPagesTagged();
  }

  onSelectRMClick(event, item: RawMaterials) {
    console.warn(item);
    //Paatch raw mats details Tasa
    this.itemReqForm.patchValue({
      mrs_item_description: item.item_description,
      mrs_item_code: item.item_code,
      mrs_uom: item.primary_unit,
    });
    $('#editCancelModalRM').trigger('click');
  }

  onFilterStatus(val) {

    if (!val) {
      this.getItemList();
    } else {


      if (val === "") {

      }
      else if (val === "true") {
        val = true;
      }
      else if (val === "false") {

        val = false;
      }

      const status = this.itemList.filter(status => status.isactive === val);
      this.itemList = status;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }

  }

  calculateNoOfPagesTagged() {

    //Get no. of Pages


    const searchData = this.itemList.filter(status => status.item_code.includes(this.searchTextRM)
    );
    this.totalRoleModulesUntaggedNewRowCount = searchData.length;
    this.itemList = searchData;



    // console.warn(this.itemList);

    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.itemList, this.searchByRM, this.searchTextRM).length / this.pageSize);

    this.pagesRawMats = [];

    //Generate pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesRawMats.push({ pageIndex: i });
    }

    this.currentPageIndexRM = 0;
  }

  getApprovedList() {
    this.onlineMrsService
      .getApprovedOrderRequest(this.loginService.Userid)
      .subscribe((response) => {
        this.approvedOrderList = response;
        if (response) {
          this.approvedOrderListCount = response.length;
        }

        this.showLoading = false;
        this.calculateNoOfPagesApproved();
      });
  }

  getCancelledOrderList() {
    this.onlineMrsService
      .cancelledOrderList(this.loginService.Userid)
      .subscribe(
        (response) => {
          this.cancelledOrderList = response;
          if (response) {
            this.cancelledOrderCount = response.length;
            this.calculateNoOfPagesDynamic();
          }

          this.showLoading = false;


        },
        (error) => {
          console.log(error.error.message);
        }
      );

  }

  getCancelReasonList() {
    this.onlineMrsService.cancelOrderReasonList().subscribe((response) => {
      this.cancelReasonList = response;
    });
  }




  getReturnReasonList() {
    this.onlineMrsService.returnOrderReasonList().subscribe((response) => {
      this.returnReasonList = response;
    });
  }

  //Tabs Refresh *************************************************************
  CancelledOrderLisRefresh(event) {
    this.getCancelledOrderList();
    this.getParentList();
    this.getApprovedList();
  }

  getUserInformation() {
    this.fullName = this.loginService.fullName;
    this.departmentId = this.loginService.departmentId;
    this.userId = this.loginService.Userid;

    this.requestorRole = this.loginService.requestorRole;
    this.approverRole = this.loginService.approverRole;

    // console.log(this.approverRole);
    // console.log(this.requestorRole);
  }

  onPageIndexClicked(pageIndex: number) {
    this.currentPageIndex = pageIndex;
  }

  onPageIndexClickedApproved(pageIndex: number) {
    this.currentPageIndexApproved = pageIndex;
  }


  onPageIndexClickedCancelled(pageIndex: number) {
    this.currentPageIndexCancelled = pageIndex;
  }

  // Parent data search ********************************************************
  calculateNoOfPages() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.parentData, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }


  calculateNoOfPagesDynamic() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.cancelledOrderList, this.searchBy, this.searchText).length / this.pageSize
    );
    this.pagesCancelled = [];

    for (let i = 0; i < noOfPages; i++) {
      this.pagesCancelled.push({ pageIndex: i });
    }
    this.currentPageIndexCancelled = 0;
  }

  onFilterCategory(val: any) { }

  onSearchTextKeyup(val: any) {
    this.calculateNoOfPages();
  }

  // Approved data search ********************************************************
  calculateNoOfPagesApproved() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(
        this.approvedOrderList,
        this.searchBy,
        this.searchText
      ).length / this.pageSize
    );
    this.pagesApproved = [];

    for (let i = 0; i < noOfPages; i++) {
      this.pagesApproved.push({ pageIndex: i });
    }
    this.currentPageIndexApproved = 0;
  }

  onFilterCategoryApproved(val: any) { }

  onSearchTextKeyupApproved(val: any) {
    this.calculateNoOfPagesApproved();
  }

  // Cancelled data search ********************************************************
  calculateNoOfPagesCancelled() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(
        this.cancelledOrderList,
        this.searchBy,
        this.searchText
      ).length / this.pageSize
    );
    this.pages = [];

    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  onFilterCategoryCancelled(val: any) { }

  onSearchTextKeyupCancelled(val: any) {
    this.calculateNoOfPagesCancelled();
  }

  //Messages ****************************************************************
  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.successMessage, 'Message');
  }

  onSearchItemCode() {

    const getItem = this.itemList.filter(
      (item) => item.item_code === this.mrs_item_code
    );

    if ($('#txtSearchTextID').val().length === 0) {
      $('#showRawMatsModal').trigger('click');
      // alert($('#txtSearchTextID').val().length);
    }
    else {

      if (getItem.length == 0) {

        this.successMessage = 'No Item Found!';
        this.errorToaster();
        this.getItemList();

        this.itemReqForm.patchValue({
          mrs_item_description: '',
          mrs_item_code: '',
          mrs_uom: '',
          mrs_order_qty: '',
        });
      }
      else {
        getItem.forEach((item) => {
          this.itemReqForm.patchValue({
            mrs_item_description: item.item_description,
            mrs_item_code: item.item_code,
            mrs_uom: item.primary_unit,
          });
        });
      }
    }

  }

  onPageIndexClickedRM(ind) {
    //Set currentPageIndex
    if (ind >= 0 && ind < this.pagesRawMats.length) {
      this.currentPageIndexRM = ind;
    }
  }

  //Reactive forms **********************************************************
  parentForms() {
    this.addParent = this.formBuilder.group({
      user_id: this.formBuilder.control(null, [Validators.required]),
      department_id: this.formBuilder.control(null, [Validators.required]),
      mrs_req_desc: this.formBuilder.control(null),
      mrs_requested_by: this.formBuilder.control(null, [Validators.required]),
    });

    this.editParent = this.formBuilder.group({
      mrs_req_desc: this.formBuilder.control(null, [Validators.required]),
      mrs_id: this.formBuilder.control(null, [Validators.required]),
    });

    this.requestOrderDescForm = this.formBuilder.group({
      mrs_req_desc: this.formBuilder.control(null, [Validators.required]),
      department_id: this.formBuilder.control(null, [Validators.required]),
      user_id: this.formBuilder.control(null, [Validators.required]),
      mrs_requested_by: this.formBuilder.control(null, [Validators.required]),
      requested_date: this.formBuilder.control(null, [Validators.required]),
      mrs_date_needed: this.formBuilder.control(null, [Validators.required]),
    });

    this.itemReqForm = this.formBuilder.group({
      mrs_item_code: this.formBuilder.control(null, [Validators.required]),
      mrs_item_description: this.formBuilder.control(null, [
        Validators.required,
      ]),
      mrs_order_qty: this.formBuilder.control(null, [Validators.required]),
      mrs_uom: this.formBuilder.control(null, [Validators.required]),
    });

    this.removeItemForm = this.formBuilder.group({
      Item_code: this.formBuilder.control(null, [Validators.required]),
      mrs_id: this.formBuilder.control(null, [Validators.required]),
    });

    this.editItemForm = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      mrs_order_qty: this.formBuilder.control(null, [Validators.required]),
      mrs_item_code: this.formBuilder.control(null, [Validators.required]),
      mrs_uom: this.formBuilder.control(null, [Validators.required]),
    });

    this.cancelItemFormPartial = this.formBuilder.group({
      id: this.formBuilder.control(null, [Validators.required]),
      deactivated_by: this.formBuilder.control(null, [Validators.required]),
      mrs_order_qty: this.formBuilder.control(null, [Validators.required]),
      mrs_item_code: this.formBuilder.control(null, [Validators.required]),
      mrs_uom: this.formBuilder.control(null, [Validators.required]),
      mrs_id: this.formBuilder.control(null, [Validators.required]),
    })

    this.approveOrderRequestForm = this.formBuilder.group({
      is_approved_by: this.formBuilder.control(null, [Validators.required]),
      mrs_id: this.formBuilder.control(null, [Validators.required]),
    });

    this.cancelOrderRequestForm = this.formBuilder.group({
      mrs_id: this.formBuilder.control(null, [Validators.required]),
      is_cancel_by: this.formBuilder.control(null, [Validators.required]),
      is_cancel_reason: this.formBuilder.control(null, [Validators.required]),
    });

    this.returnOrderRequestForm = this.formBuilder.group({
      mrs_id: this.formBuilder.control(null, [Validators.required]),
    });
  }

  //Populate Fields*********************************************************
  parentFormPatchValue() {
    this.addParent.patchValue({
      mrs_requested_by: this.loginService.fullName,
      department_id: this.loginService.departmentId,
      user_id: this.loginService.Userid,
    });
  }

  clickUpdate(item: any) {

    this.editParent.patchValue({
      mrs_id: item.mrs_id,
      mrs_req_desc: item.mrs_req_desc,
    });
  }

  approveOrderClick(item: any) {
    this.approveOrderRequestForm.patchValue({
      mrs_id: item.mrs_id,
      is_approved_by: this.loginService.fullName,
    });
  }

  cancelOrderClick(item: any) {
    this.cancelOrderRequestForm.reset();
    this.cancelOrderRequestForm.patchValue({
      mrs_id: item.mrs_id,
      is_cancel_by: this.loginService.fullName,
    });
  }

  requestOrderClick() {
    this.addedItemList = [];
    if (this.mrs_item_code === '' || this.mrs_item_code !== '') {
      this.itemReqForm.patchValue({
        mrs_item_description: '',
        mrs_item_code: '',
        mrs_uom: '',
        mrs_req_desc: '',
      });

      this.requestOrderDescForm.patchValue({
        mrs_req_desc: '',
        mrs_date_needed: '',
      });

      this.mrs_item_code = '';
    }
    this.requestOrderDescForm.patchValue({
      mrs_requested_by: this.loginService.fullName,
      department_id: this.loginService.departmentId,
      user_id: this.loginService.Userid,
      requested_date: this.toDaysDate,
    });
  }

  removeItemFromList(item: any) {
    this.removeItemForm.patchValue({
      Item_code: item.mrs_item_code,
      mrs_id: item.id,
    });
  }

  editItemFromList(item: any) {
    this.editItemForm.patchValue({
      id: item.id,
      mrs_order_qty: item.mrs_order_qty,
      mrs_item_code: item.mrs_item_code,
      mrs_uom: item.mrs_uom,
    });
  }


  cancelItemFromList(item: any) {
    this.cancelItemFormPartial.patchValue({
      id: item.id,
      mrs_order_qty: item.mrs_order_qty,
      mrs_item_code: item.mrs_item_code,
      mrs_uom: item.mrs_uom,
      deactivated_by: this.loginService.currentUserName,
      mrs_id: item.mrs_id,
    });
  }

  viewRemarksItemFromList(item: any) {
    this.mrs_cancel_reason = item.mrs_remarks;
  }

  clickReturnOrderRequest(item: any) {
    this.returnOrderRequestForm.patchValue({
      mrs_id: item.mrs_id,
    });
  }

  viewReasonForCancelClick(item: any) {
    this.mrs_cancel_reason = item.is_cancel_reason;
  }

  //Add orders to List**********************************************************
  addItemToList() {
    const getDuplicate = this.addedItemList.filter(
      (item) => item.mrs_item_code === this.mrs_item_code
    );

    const mrs_quant = this.mrs_order_qty;

    if (getDuplicate.length > 0) {
      Swal.fire({
        title:
          'Item already exist! Are you sure you want to add the quantity to the existing item?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          getDuplicate.forEach((i) => {
            const totalqty = i.mrs_order_qty + mrs_quant;
            i.mrs_order_qty = totalqty;
          });
        }
      });
    } else {
      this.addedItemList.push(this.itemReqForm.value);
    }

    this.itemReqForm.patchValue({
      mrs_item_description: '',
      mrs_item_code: '',
      mrs_uom: '',
      mrs_order_qty: '',
    });
    this.mrs_item_code = '';
  }

  removeItem(index: any) {
    this.addedItemList.splice(index, 1);
  }

  getOrderList(mrs_id: number) {
    const res = this.parentData.filter((list) => list.mrs_id === mrs_id);
    this.viewAddedItemList = res;
    this.totalMrsOrder = res.length;
  }

  // view order list ***********************************************************
  viewOrderClickParent(item: any) {
    const res = this.parentData.filter((list) => list.mrs_id === item.mrs_id);
    this.viewAddedItemList = res;
    this.parentTitle = item.mrs_req_desc;


    const totalMrsItems = this.viewAddedItemList.reduce((count, current) => count + current.material_request_logs.length, 0);
    this.totalMrsOrder = totalMrsItems;

    //Validate Yung Requestor Lang dapat makakapagedit ng request
    if (this.userId == item.user_id) {
      this.requestorFound = 1;
    }
    //End

    this.viewAddedItemList.map((itm) => {
      this.OrderBy = itm.mrs_requested_by;
      this.OrderDate = itm.mrs_requested_date;

      this.ApprovedBy = itm.is_approved_by;
      this.ApprovedDate = itm.is_approved_date;

      this.IssuedBy = itm.mrs_issued_by;
      this.IssuedDate = itm.mrs_issued_date;
    });
  }

  clickUpdateItems() {
    $('#viewModalClose').trigger('click');
    $('#EditDescriptionClick').trigger('click');
  }

  viewOrderClickApproved(item: any) {
    const res = this.approvedOrderList.filter(
      (list) => list.mrs_id === item.mrs_id

    );
    this.parentTitle = item.mrs_req_desc;
    this.viewAddedItemList = res;

    this.viewAddedItemList.map((itm) => {
      this.OrderBy = itm.mrs_requested_by;
      this.OrderDate = itm.mrs_requested_date;

      this.ApprovedBy = itm.is_approved_by;
      this.ApprovedDate = itm.is_approved_date;

      this.IssuedBy = itm.mrs_issued_by;
      this.IssuedDate = itm.mrs_issued_date;
    });
  }

  viewOrderClickCancelled(item: any) {
    const res = this.cancelledOrderList.filter(
      (list) => list.mrs_id === item.mrs_id
    );
    this.viewAddedItemList = res;

    this.viewAddedItemList.map((itm) => {
      this.parentTitle = item.mrs_req_desc;
      this.OrderBy = itm.mrs_requested_by;
      this.OrderDate = itm.mrs_requested_date;

      this.ApprovedBy = itm.is_approved_by;
      this.ApprovedDate = itm.is_approved_date;

      this.IssuedBy = itm.mrs_issued_by;
      this.IssuedDate = itm.mrs_issued_date;
    });
  }

  //CRUED Method ***************************************************************
  addParentSubmit() {
    if (this.addParent.valid) {
      Swal.fire({
        title: 'Are you sure that you want to submit?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService.saveParentList(this.addParent.value).subscribe(
            (response) => {
              this.parentData.splice(this.editIndex, 0, response);
              this.successMessage = 'Added Successfully!';
              this.addParent.reset();

              $('#addParentModalClose').trigger('click');
              this.successToaster();
            },
            (error) => {
              console.log(error.error.message);
            }
          );
        }
      });
    }
  }

  updateParentSubmit() {
    if (this.editParent.valid) {
      Swal.fire({
        title: 'Are you sure that you want to submit?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService
            .updateParentList(this.editParent.value)
            .subscribe(
              (response) => {
                this.getParentList();
                // this.parentData.shift(this.editIndex, 1, response);
                this.successMessage = 'Updated Successfully!';
                this.editParent.reset();

                $('#editParentModalClose').trigger('click');
                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
              }
            );
        }
      });
    }
  }

  addOrderItemSubmit() {
    this.onlineMrsService.saveOrders(this.addedItemList).subscribe(
      (response) => {
        this.addedItemList = [];
        this.successToaster();
      },
      (error) => {
        console.log(error.error.message);
      }
    );
  }

  addOrderDescriptionSubmit() {
    this.onlineMrsService
      .saveParentList(this.requestOrderDescForm.value)
      .subscribe(
        (response) => {

          this.getParentList();
          this.addOrderItemSubmit();
          setTimeout(() => {
            this.getParentList();
          }, 400);

        },
        (error) => {
          console.log(error.error.message);
        }
      );
  }

  addOrdersSubmit() {
    if (this.addedItemList) {
      Swal.fire({
        title: 'Are you sure that you want to save order/s?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.addOrderDescriptionSubmit();
          this.successMessage = 'Added Successfully!';
          $('#requestOrderModalClose').trigger('click');
        }
      });
    }
  }

  removeItemListSubmit() {
    if (this.removeItemForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to remove?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService.removeItemFromList(this.mrs_id).subscribe(
            (response) => {
              this.getParentList();

              this.successMessage = 'Removed Successfully!';
              this.removeItemForm.reset();

              $('#removeItemtModalClose').trigger('click');
              $('#viewModalClose').trigger('click');

              this.successToaster();
            },
            (error) => {
              console.log(error.error.message);
            }
          );
        }
      });
    }
  }

  editItemListSubmit() {
    if (this.editItemForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Update?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService
            .editItemFromList(this.editItemForm.value)
            .subscribe(
              (response) => {
                this.getParentList();

                this.successMessage = 'Updated Successfully!';
                this.editItemForm.reset();

                $('#editItemtModalClose').trigger('click');
                $('#viewModalClose').trigger('click');

                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
              }
            );
        }
      });
    }
  }


  cancelItemListSubmit() {
    //Cancel partial Item
    // console.error(this.cancelItemFormPartial.value);
    // console.log(this.cancelItemFormPartial.value.mrs_id);
    this.mrs_id_order_list = this.cancelItemFormPartial.value.mrs_id;
    if (this.cancelItemFormPartial.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Cancel?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService
            .cancelItemFromList(this.cancelItemFormPartial.value)
            .subscribe(
              (response) => {
                this.getParentList();
                //breakpoint
                $('#cancelItemModalpartialClose').trigger('click');
                this.successToaster();

                this.successMessage = 'Cancelled Successfully!';
                setTimeout(() => {
                  this.getOrderList(this.mrs_id_order_list);
                }, 500);

                this.cancelItemFormPartial.reset();
              },
              (error) => {
                console.log(error.error.message);
                this.errorToaster();
              }
            );
        }
      });
    }
  }

  approvedOrderRequestSubmit(item: any) {
    this.approveOrderRequestForm.patchValue({
      mrs_id: item.mrs_id,
      is_approved_by: this.loginService.fullName,
    });

    if (this.approveOrderRequestForm.valid) {
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
          this.onlineMrsService
            .approvedOrderRequest(this.approveOrderRequestForm.value)
            .subscribe(
              (response) => {
                setTimeout(() => {
                  this.getParentList();
                  this.getApprovedList();
                  this.successMessage = 'Approved Successfully!';
                }, 400);
                this.approveOrderRequestForm.reset();
                $('#approvedOrderModalClose').trigger('click');

                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
              }
            );
        }
      });
    }
  }

  cancelRequestOrderSubmit() {
    if (this.cancelOrderRequestForm.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Cancel?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.onlineMrsService
            .cancelOrderRequest(this.cancelOrderRequestForm.value)
            .subscribe(
              (response) => {
                this.getParentList();
                this.getCancelledOrderList();
                this.successMessage = 'Cancelled Successfully!';
                this.cancelOrderRequestForm.reset();
                $('#cancelOrderRequestModalClose').trigger('click');

                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
              }
            );
        }
      });
    }
  }

  returnRequestOrderSubmit() {
    if (this.returnOrderRequestForm.valid) {
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
          this.onlineMrsService
            .returnCancelledOrderList(this.returnOrderRequestForm.value)
            .subscribe(
              (response) => {
                this.getParentList();
                this.getCancelledOrderList();
                this.successMessage = 'Returned Successfully!';
                this.returnOrderRequestForm.reset();
                $('#returnOrderRequestModalClose').trigger('click');

                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
              }
            );
        }
      });
    }
  }
}
