import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { ChecklistClass } from './models/checklist-model';
import { ChecklistService } from './services/checklist.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit {
  constructor(
    private checklistService: ChecklistService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loginService: LoginService
  ) {}

  checklist: ChecklistClass[] = [];
  sam: any = [];
  filteredCheckList: any = [];
  showLoading: boolean = true;
  filteredList: any = [];
  //Properties for Searching
  searchBy: string = 'parent_chck_details';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'parent_chck_details';
  sortOrder: string = 'ASC';

  addedBy: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  //Reactive Forms
  registerChecklist: FormGroup;
  editChecklist: FormGroup;
  deactivateChecklist: FormGroup;

  editIndex: number = null;

  ngOnInit() {
    this.getList();
    this.registerChecklistForm();
    this.getUserFullName();
    this.editChecklistForm();
    this.activateDeactivateForm();
    this.getLists();
  }

  getLists() {
    this.checklistService.getList().subscribe((response: ChecklistClass[]) => {
      this.checklist = response;
      this.filteredCheckList = response;
      this.showLoading = false;
      this.calculateNoOfPages();
    });
  }

  async getList() {
    let data = await this.checklistService.getList().toPromise();
    this.checklist = data;
    this.filteredCheckList = data;
    this.showLoading = false;
    this.calculateNoOfPages();
  }

  getUserFullName() {
    this.registerChecklist.patchValue({
      Parent_chck_added_by: this.loginService.fullName,
    });
  }

  onFilterStatus(val: any) {
    if (!val) {
      this.filteredCheckList = this.checklist;
      this.calculateNoOfPages();
    } else if (val == 'true') {
      const list = this.checklist.filter((status) => status.is_active == true);

      console.log(list);
      this.filteredCheckList = list;
      this.calculateNoOfPages();
    } else {
      const list = this.checklist.filter((status) => status.is_active == false);

      console.log(list);
      this.filteredCheckList = list;
      this.calculateNoOfPages();
    }
  }

  calculateNoOfPages() {
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(
      filterPipe.transform(
        this.filteredCheckList,
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

  onPageIndexClicked(ind) {
    if (ind >= 0 && ind < this.pages.length) {
      this.currentPageIndex = ind;
    }
  }

  onSearchTextChange(event) {
    this.calculateNoOfPages();
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  //Reactive forms *********************************************************
  registerChecklistForm() {
    this.registerChecklist = this.formBuilder.group({
      parent_chck_details: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Parent_chck_added_by: this.formBuilder.control(null),
    });
  }

  editChecklistForm() {
    this.editChecklist = this.formBuilder.group({
      parent_chck_id: this.formBuilder.control(null),
      parent_chck_details: this.formBuilder.control(null, [
        Validators.required,
      ]),
      Parent_chck_added_by: this.formBuilder.control(null),
    });
  }

  activateDeactivateForm() {
    this.deactivateChecklist = this.formBuilder.group({
      parent_chck_id: this.formBuilder.control(null),
      deactivated_by: this.formBuilder.control(null),
      parent_chck_details: this.formBuilder.control(null),
      parent_chck_status: this.formBuilder.control(null),
    });
  }

  //Populate Fields**********************************************************
  onClickEdit(item: any) {
    this.editChecklist.patchValue(item);
  }

  onClickDeActivate(item: any) {
    this.deactivateChecklist.patchValue(item);
    this.deactivateChecklist.patchValue({
      deactivated_by: this.loginService.fullName,
      parent_chck_status: 'Deactivated',
    });

    this.onSubmitDeactivate();
  }

  onClickActivate(item: any) {
    this.deactivateChecklist.patchValue(item);
    this.deactivateChecklist.patchValue({
      deactivated_by: this.loginService.fullName,
      parent_chck_status: 'Activated',
    });

    this.onSubmitActivate();
  }

  //CRUED Method ************************************************************
  addSubmit() {
    if (this.registerChecklist.valid) {
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
          this.checklistService.addList(this.registerChecklist.value).subscribe(
            (response: ChecklistClass) => {
              this.getList();
              this.successMessage = 'Added Successfully!';
              this.registerChecklist.reset();

              $('#closeRegistrationChecklistModal').trigger('click');
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
    if (this.editChecklist.valid) {
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
          this.checklistService.updateList(this.editChecklist.value).subscribe(
            (response: ChecklistClass) => {
              this.getList();
              // this.checklist[this.editIndex] = response;
              this.checklist.splice(this.editIndex, 1, response);

              this.successMessage = 'Updated Successfully!';
              this.editChecklist.reset();

              $('#closeRegistrationChecklistEditnModal').trigger('click');
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
    if (this.deactivateChecklist.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Deactivate this item?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.checklistService
            .deactivate(this.deactivateChecklist.value)
            .subscribe(
              (response: ChecklistClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.checklist.splice(this.editIndex, 1, response);

                this.successMessage = 'Deactivated Successfully!';
                this.editChecklist.reset();

                $('#closeChecklistDeactivateModal').trigger('click');
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
    if (this.deactivateChecklist.valid) {
      Swal.fire({
        title: 'Are you sure that you want to Activate this item?',
        text: '',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then((result) => {
        if (result.isConfirmed) {
          this.checklistService
            .activate(this.deactivateChecklist.value)
            .subscribe(
              (response: ChecklistClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.checklist.splice(this.editIndex, 1, response);

                this.successMessage = 'Activated Successfully!';
                this.editChecklist.reset();

                $('#closeChecklistActivateModal').trigger('click');
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
