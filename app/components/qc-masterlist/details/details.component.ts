import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { DetailsClass } from './models/details.model';
import { DetailsService } from './services/details.service';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { ChecklistService } from '../checklist/services/checklist.service';
import { ChecklistClass } from '../checklist/models/checklist-model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  constructor(
    private detailsService: DetailsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loginService: LoginService,
    private checklistService: ChecklistService
  ) {}

  detailsList: DetailsClass[] = [];
  checklist: ChecklistClass[] = [];
  activeChecklist: any = [];
  filteredList: any = [];
  showLoading: boolean = true;

  //Properties for Searching
  searchBy: string = 'cc_description';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'cc_description';
  sortOrder: string = 'ASC';

  //Reactive Forms
  registerDetails: FormGroup;
  editDetails: FormGroup;
  ActivateDeactivateDetails: FormGroup;

  editIndex: number = null;
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.getList();
    this.getChecklist();
    this.registerDetailsForm();
    this.registerFormPatchValue();
    this.editDetailstForm();
    this.activateDeactivateForm();
  }

  getList() {
    this.detailsService.getList().subscribe((response: DetailsClass[]) => {
      this.detailsList = response;
      this.filteredList = response;
      this.showLoading = false;
      this.calculateNoOfPages();
    });
  }

  getChecklist() {
    this.checklistService.getList().subscribe((response) => {
      const activeChecklist = response.filter(
        (item) => item.is_active === true
      );
      this.checklist = activeChecklist;
    });
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  onFilterStatus(val: any) {
    if (!val) {
      this.filteredList = this.detailsList;
      this.calculateNoOfPages();
    } else if (val == 'true') {
      const status = this.detailsList.filter(
        (status) => status.is_active == true
      );
      this.filteredList = status;
      this.calculateNoOfPages();
    } else {
      const status = this.detailsList.filter(
        (status) => status.is_active == false
      );
      this.filteredList = status;
      this.calculateNoOfPages();
    }
  }

  calculateNoOfPages() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(this.filteredList, this.searchBy, this.searchText)
        .length / this.pageSize
    );
    this.pages = [];

    for (let i = 0; i < noOfPages; i++) {
      this.pages.push({ pageIndex: i });
    }
    this.currentPageIndex = 0;
  }

  onPageIndexClicked(ind) {
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  onSearchTextChange(event) {
    this.calculateNoOfPages();
  }

  //Reactive forms ********************************************************
  registerDetailsForm() {
    this.registerDetails = this.formBuilder.group({
      cc_description: this.formBuilder.control(null, [Validators.required]),
      cc_parent_key: this.formBuilder.control(null, [Validators.required]),
      cc_added_by: this.formBuilder.control(null),
    });
  }

  editDetailstForm() {
    this.editDetails = this.formBuilder.group({
      cc_id: this.formBuilder.control(null),
      cc_description: this.formBuilder.control(null, [Validators.required]),
      updated_by: this.formBuilder.control(null),
      cc_parent_key: this.formBuilder.control(null),
    });
  }

  activateDeactivateForm() {
    this.ActivateDeactivateDetails = this.formBuilder.group({
      cc_id: this.formBuilder.control(null),
      deactivated_by: this.formBuilder.control(null),
      cc_description: this.formBuilder.control(null),
      status: this.formBuilder.control(null),
    });
  }

  //Populate Fields*********************************************************
  registerFormPatchValue() {
    this.registerDetails.patchValue({
      cc_added_by: this.loginService.fullName,
    });
  }

  onEditClick(item: any) {
    this.editDetails.patchValue(item);
    this.editDetails.patchValue({
      updated_by: this.loginService.fullName,
    });
  }

  onClickDeActivate(item: any) {
    this.ActivateDeactivateDetails.patchValue(item);
    this.ActivateDeactivateDetails.patchValue({
      status: 'Deactivated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitDeactivate();
  }

  onClickActivate(item: any) {
    this.ActivateDeactivateDetails.patchValue(item);
    this.ActivateDeactivateDetails.patchValue({
      status: 'Activated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitActivate();
  }

  //CRUED Method ************************************************************
  addSubmit() {
    if (this.registerDetails.valid) {
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
          this.detailsService.addDetails(this.registerDetails.value).subscribe(
            (response: DetailsClass) => {
              this.getList();
              this.successMessage = 'Added Successfully!';
              this.registerDetails.reset();

              $('#closeRegistrationDetailsModal').trigger('click');
              this.successToaster();
            },
            (error) => {
              // console.log(error.error.message);
              this.errorMessage = error.error.message;

              this.errorToaster();
            }
          );
        }
      });
    }
  }

  updateSubmit() {
    if (this.editDetails.valid) {
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
          this.detailsService.updateDetails(this.editDetails.value).subscribe(
            (response: DetailsClass) => {
              this.getList();
              // this.checklist[this.editIndex] = response;
              this.detailsList.splice(this.editIndex, 1, response);

              this.successMessage = 'Updated Successfully!';
              this.editDetails.reset();

              $('#closeRegisterEditDetailsModal').trigger('click');
              this.successToaster();
            },
            (error) => {
              // console.log(error.error.message);
              this.errorMessage = error.error.message;

              this.errorToaster();
            }
          );
        }
      });
    }
  }

  onSubmitDeactivate() {
    if (this.ActivateDeactivateDetails.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Deactivate this Item?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.detailsService
            .deactivate(this.ActivateDeactivateDetails.value)
            .subscribe(
              (response: DetailsClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.detailsList.splice(this.editIndex, 1, response);

                this.successMessage = 'Deactivated Successfully!';
                this.ActivateDeactivateDetails.reset();

                $('#closeDeactivateDetailsModal').trigger('click');
                this.successToaster();
              },
              (error) => {
                // console.log(error.error.message);
                this.errorMessage = error.error.message;

                this.errorToaster();
              }
            );
        }
      });
    }
  }

  onSubmitActivate() {
    if (this.ActivateDeactivateDetails.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Activate this Item?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.detailsService
            .activate(this.ActivateDeactivateDetails.value)
            .subscribe(
              (response: DetailsClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.detailsList.splice(this.editIndex, 1, response);

                this.successMessage = 'Activated Successfully!';
                this.ActivateDeactivateDetails.reset();

                $('#closeActivateDetailsModal').trigger('click');
                this.successToaster();
              },
              (error) => {
                // console.log(error.error.message);
                this.errorMessage = error.error.message;

                this.errorToaster();
              }
            );
        }
      });
    }
  }
}
