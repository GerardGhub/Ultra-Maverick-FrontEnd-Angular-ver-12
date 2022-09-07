import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import Swal from 'sweetalert2';
import * as $ from 'jquery';
// import { DetailsClass } from '../details/models/details.model';
import { DetailsService } from '../details/services/details.service';
import { DescriptionClass } from './models/description.model';
import { DescriptionService } from './services/description.service';
import { LoginService } from 'src/app/services/login.service';
import { QCService } from 'src/app/admin/components/projects/services/qcmodule.service';
import { ParamentersService } from '../paramenters/services/paramenters.service';
import { isBoolean } from 'util';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  constructor(
    private descriptionService: DescriptionService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private detailService: DetailsService,
    private loginService: LoginService,
    private qcService: QCService,
    private parametersService: ParamentersService
  ) {}

  descriptionList: any = [];
  detailsList: any = [];
  qcchecklist: any[] = [];
  parameterList: any = [];

  filteredList: any = [];

  showLoading: boolean = true;

  //Properties for Searching
  searchBy: string = 'gc_description';
  searchText: string = '';

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = 'gc_id';
  sortOrder: string = 'ASC';

  errorMessage: string = '';
  validatedParamMessage: any = [];

  cp_gchild_key: string = '';
  parameterTypeState: string = '';

  //Reactive Forms
  registerDescription: FormGroup;
  editDescription: FormGroup;
  ActivateDeactivateDescription: FormGroup;
  registerYNparameterForm: FormGroup;

  editIndex: number = null;
  successMessage: string = '';

  ngOnInit(): void {
    this.getList();
    this.getDetailsList();
    this.reactiveForms();
    this.registerFormPatchValue();
    this.getParameterList();
  }

  getList() {
    this.descriptionService.getList().subscribe((response) => {
      this.descriptionList = response;
      this.filteredList = response;
      this.showLoading = false;
      this.calculateNoOfPages();
    });
  }

  getDetailsList() {
    this.detailService.getList().subscribe((response) => {
      const list = response.filter((item) => item.is_active === true);
      this.detailsList = list;
    });
  }

  getParameterList() {
    this.parametersService.getList().subscribe((response) => {
      this.parameterList = response;
    });
  }

  successToaster() {
    this.toastr.success(this.successMessage, 'Message');
  }

  errorToaster() {
    this.toastr.error(this.errorMessage, 'Message');
  }

  onFilterStatus(val: string) {
    if (!val) {
      this.filteredList = this.descriptionList;
      this.calculateNoOfPages();
    } else if (val == 'true') {
      const status = this.descriptionList.filter(
        (status) => status.is_active == true
      );
      this.filteredList = status;
      this.calculateNoOfPages();
    } else {
      const status = this.descriptionList.filter(
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

  //Reactive forms *********************************************************
  reactiveForms() {
    this.registerDescription = this.formBuilder.group({
      gc_description: this.formBuilder.control(null, [Validators.required]),
      gc_child_key: this.formBuilder.control(null, [Validators.required]),
      gc_added_by: this.formBuilder.control(null),
      is_manual: this.formBuilder.control(null, [Validators.required]),
      gc_bool_status: this.formBuilder.control(null, [Validators.required])
    });

    this.editDescription = this.formBuilder.group({
      gc_id: this.formBuilder.control(null),
      gc_description: this.formBuilder.control(null, [Validators.required]),
      updated_by: this.formBuilder.control(null),
      gc_child_key: this.formBuilder.control(null),
      is_manual: this.formBuilder.control(null, [Validators.required]),
    });

    this.ActivateDeactivateDescription = this.formBuilder.group({
      gc_id: this.formBuilder.control(null),
      deactivated_by: this.formBuilder.control(null),
      gc_description: this.formBuilder.control(null),
      status: this.formBuilder.control(null),
      is_manual: this.formBuilder.control(null, [Validators.required]),
    });

    this.registerYNparameterForm = this.formBuilder.group({
      cp_description: this.formBuilder.control(null, [Validators.required]),
      cp_gchild_key: this.formBuilder.control(null, [Validators.required]),
      cp_bool_status: this.formBuilder.control(null, [Validators.required]),
      cp_added_by: this.formBuilder.control(null, [Validators.required]),
    });
  }

  //Populate Fields*********************************************************
  registerFormPatchValue() {
    this.registerDescription.patchValue({
      gc_added_by: this.loginService.fullName,
      gc_bool_status: "true"
    });
  }

  onEditClick(item: any) {
    const validateExistParam = this.parameterList.filter(
      (itm) => itm.gc_id == item.gc_id
    );

    if (validateExistParam) {
      this.validatedParamMessage = validateExistParam;
      this.editDescription.patchValue(item);
      this.editDescription.patchValue({
        updated_by: this.loginService.fullName,
      });
      console.log(validateExistParam);
    } else {
      this.editDescription.patchValue(item);
      this.editDescription.patchValue({
        updated_by: this.loginService.fullName,
      });
    }

    // this.editDescription.patchValue(item);
    // this.editDescription.patchValue({
    //   updated_by: this.loginService.fullName,
    // });
  }

  onClickDeActivate(item: any) {
    this.ActivateDeactivateDescription.patchValue(item);
    this.ActivateDeactivateDescription.patchValue({
      status: 'Deactivated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitDeactivate();
  }

  onClickActivate(item: any) {
    this.ActivateDeactivateDescription.patchValue(item);
    this.ActivateDeactivateDescription.patchValue({
      status: 'Activated',
      deactivated_by: this.loginService.fullName,
    });

    this.onSubmitActivate();
  }

  //CRUED Method ************************************************************
  addSubmit() {
    if (this.registerDescription.valid) {
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
          this.descriptionService
            .addDetails(this.registerDescription.value)
            .subscribe(
              (response) => {
                this.getList();
                this.cp_gchild_key = this.descriptionService.gc_id;

                if (this.parameterTypeState === 'no') {
                  this.registerYNparameterForm.patchValue({
                    cp_description: 'yes',
                    cp_gchild_key: this.cp_gchild_key,
                    cp_bool_status: 'true',
                    cp_added_by: this.loginService.fullName,
                  });

                  this.parametersService
                  .addDetails(this.registerYNparameterForm.value)
                  .subscribe((res) => {
                    console.log(res);
                  });
                }

                if (this.parameterTypeState === 'manual') {
                  this.registerYNparameterForm.patchValue({
                    cp_description: 'manual',
                    cp_gchild_key: this.cp_gchild_key,
                    cp_bool_status: 'true',
                    cp_added_by: this.loginService.fullName,
                  });

                  this.parametersService
                  .addDetails(this.registerYNparameterForm.value)
                  .subscribe((res) => {
                    console.log(res);
                  });
                }



                this.successMessage = 'Added Successfully!';
                this.registerDescription.reset();

                $('#closeDescRegistrationModal').trigger('click');
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

  updateSubmit() {
    if (this.editDescription.valid) {
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
          this.descriptionService
            .updateDescription(this.editDescription.value)
            .subscribe(
              (response) => {
                this.getList();
                this.cp_gchild_key = this.descriptionService.gc_id;

                // this.checklist[this.editIndex] = response;
                this.descriptionList.splice(this.editIndex, 1, response);

                if (this.parameterTypeState === 'no') {
                  this.registerYNparameterForm.patchValue({
                    cp_description: 'yes',
                    cp_gchild_key: this.cp_gchild_key,
                    cp_bool_status: 'true',
                    cp_added_by: this.loginService.fullName,
                  });

                  this.parametersService
                  .addDetails(this.registerYNparameterForm.value)
                  .subscribe((res) => {
                    console.log(res);
                  });
                }

                if (this.parameterTypeState === 'manual') {
                  this.registerYNparameterForm.patchValue({
                    cp_description: 'manual',
                    cp_gchild_key: this.cp_gchild_key,
                    cp_bool_status: 'true',
                    cp_added_by: this.loginService.fullName,
                  });

                  this.parametersService
                  .addDetails(this.registerYNparameterForm.value)
                  .subscribe((res) => {
                    console.log(res);
                  });
                }

                this.successMessage = 'Updated Successfully!';
                this.successToaster();
                this.registerDescription.reset();

                $('#closeDescEditnModal').trigger('click');
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

  onSubmitDeactivate() {
    if (this.ActivateDeactivateDescription.valid) {
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
          this.descriptionService
            .deactivate(this.ActivateDeactivateDescription.value)
            .subscribe(
              (response) => {
                this.getList();
                // this.checklist[this.editIndex] = response;
                this.descriptionList.splice(this.editIndex, 1, response);

                this.successMessage = 'Deactivated Successfully!';
                this.registerDescription.reset();

                $('#closeDescDeactivateModal').trigger('click');
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

  onSubmitActivate() {
    if (this.ActivateDeactivateDescription.valid) {
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
          this.descriptionService
            .activate(this.ActivateDeactivateDescription.value)
            .subscribe(
              (response) => {
                this.getList();
                this.descriptionList.splice(this.editIndex, 1, response);

                this.successMessage = 'Activated Successfully!';
                this.ActivateDeactivateDescription.reset();

                $('#closeDescActivateModal').trigger('click');
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
