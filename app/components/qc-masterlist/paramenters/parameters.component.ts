import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
import { DescriptionClass } from '../description/models/description.model';
import { DescriptionService } from '../description/services/description.service';
import { ParamenterClass } from './models/parameters.model';
import { ParamentersService } from './services/paramenters.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
})
export class ParametersComponent implements OnInit {
  constructor(
    private parametersService: ParamentersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private descriptionService: DescriptionService,
    private loginService: LoginService
  ) {}

  parameterList: ParamenterClass[] = [];
  descriptionList: DescriptionClass[] = [];
  filteredList: any = [];

  showLoading: boolean = true;

  //Properties for Searching
  searchBy: string = 'cp_description';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'cp_description';
  sortOrder: string = 'ASC';

  //Reactive Forms
  registerParameter: FormGroup;
  editParameter: FormGroup;
  ActivateDeactivateParameter: FormGroup;

  editIndex: number = null;
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit(): void {
    this.getList();
    this.getDescriptionList();
    this.registerDescriptionForm();
    this.editDescriptionForm();
    this.activateDeactivateForm();
    this.registerFormPatchValue();
  }

  getList() {
    this.parametersService
      .getList()
      .subscribe((response: ParamenterClass[]) => {
        const list = response.filter(
          (item) =>
            item.cp_description !== 'yes' && item.cp_description !== 'manual'
        );
        this.parameterList = list;
        this.filteredList = list;
        this.showLoading = false;
        this.calculateNoOfPages();
      });
  }

  getDescriptionList() {
    this.descriptionService.getList().subscribe((response) => {
      const list = response.filter(
        (item: any) =>
          item.is_active === true &&
          item.is_manual !== 'no' &&
          item.is_manual !== 'manual'
      );
      this.descriptionList = list;
    });
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  onFilterStatus(val) {
    if (!val) {
      this.filteredList = this.parameterList;
      this.calculateNoOfPages();
    } else if (val == 'true') {
      const status = this.parameterList.filter(
        (status) => status.is_active == true
      );
      this.filteredList = status;

      this.calculateNoOfPages();
    } else {
      const status = this.filteredList.filter(
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
  registerDescriptionForm() {
    this.registerParameter = this.formBuilder.group({
      cp_description: this.formBuilder.control(null, [Validators.required]),
      cp_gchild_key: this.formBuilder.control(null, [Validators.required]),
      cp_added_by: this.formBuilder.control(null),
    });
  }

  editDescriptionForm() {
    this.editParameter = this.formBuilder.group({
      cp_params_id: this.formBuilder.control(null),
      cp_description: this.formBuilder.control(null, [Validators.required]),
      updated_by: this.formBuilder.control(null),
      gc_description: this.formBuilder.control(null),
    });
  }

  activateDeactivateForm() {
    this.ActivateDeactivateParameter = this.formBuilder.group({
      cp_params_id: this.formBuilder.control(null),
      deactivated_by: this.formBuilder.control(null),
      cp_description: this.formBuilder.control(null),
      status: this.formBuilder.control(null),
    });
  }

  //Populate Fields*********************************************************
  registerFormPatchValue() {
    this.registerParameter.patchValue({
      cp_added_by: this.loginService.fullName,
    });
  }

  onEditClick(item: any) {
    // this.editParameter.patchValue(item);
    this.editParameter.patchValue({
      updated_by: this.loginService.fullName,
      cp_params_id: item.cp_params_id,
      cp_description: item.cp_description,
      gc_description: item.gc_description,
    });
  }

  onClickDeActivate(item: any) {
    this.ActivateDeactivateParameter.patchValue(item);
    this.ActivateDeactivateParameter.patchValue({
      status: 'Deactivated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitDeactivate();
  }

  onClickActivate(item: any) {
    this.ActivateDeactivateParameter.patchValue(item);
    this.ActivateDeactivateParameter.patchValue({
      status: 'Activated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitActivate();
  }

  //CRUED Method ************************************************************
  addSubmit() {
    if (this.registerParameter.valid) {
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
          this.parametersService
            .addDetails(this.registerParameter.value)
            .subscribe(
              (response: ParamenterClass) => {
                this.getList();
                // this.parameterList.splice(this.editIndex, 0, response);
                this.successMessage = 'Added Successfully!';
                this.registerParameter.reset();

                $('#closeParamRegistrationModal').trigger('click');
                this.successToaster();
              },
              (error) => {
                console.log(error.error.message);
                this.errorMessage = error.error.message;
                this.errorToaster();
              }
            );
        }
      });
    }
  }

  updateSubmit() {
    if (this.editParameter.valid) {
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
          this.parametersService
            .updateDescription(this.editParameter.value)
            .subscribe(
              (response: ParamenterClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.parameterList.splice(this.editIndex, 1, response);

                this.successMessage = 'Updated Successfully!';
                this.editParameter.reset();

                $('#closeParamEditnModal').trigger('click');
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

  onSubmitDeactivate() {
    if (this.ActivateDeactivateParameter.valid) {
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
          this.parametersService
            .deactivate(this.ActivateDeactivateParameter.value)
            .subscribe(
              (response: ParamenterClass) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.parameterList.splice(this.editIndex, 1, response);

                this.successMessage = 'Deactivated Successfully!';
                this.ActivateDeactivateParameter.reset();

                $('#closeParamDeactivateModal').trigger('click');
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

  onSubmitActivate() {
    if (this.ActivateDeactivateParameter.valid) {
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
          this.parametersService
            .activate(this.ActivateDeactivateParameter.value)
            .subscribe(
              (response: ParamenterClass) => {
                this.getList();
                this.parameterList.splice(this.editIndex, 1, response);

                this.successMessage = 'Activated Successfully!';
                this.ActivateDeactivateParameter.reset();

                $('#closeParamActivateModal').trigger('click');
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
