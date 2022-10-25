import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { LoginService } from '../../../services/login.service';
import { LabTestProcedureService } from '../../../services/labtest-procedures-service/lab-test-procedure.service';
import { SystemCapabilityStatusService } from '../../../services/system-capability-status.service';
import Swal from 'sweetalert2';
import * as $ from "jquery";
import { SystemCapabilityStatus } from '../../../models/system-capability-status';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { MainMenusService } from '../../../services/main-menus.service';
import { Modules } from '../../../models/modules';


@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

 
  //Objects for Holding Model Data

  modules: Modules[] = [];
  showLoading: boolean = true;

  //Objects for Delete

  editIndex: number = 0;
  deleteIndex: number = 0;

  //Properties for Searching
  searchBy: string = "modulename";
  searchText: string = "";

  //Properties for Paging
  currentPageIndex: number = 0;
  pages: any[] = [];
  pageSize: number = 7;

  //Properties for Sorting
  sortBy: string = "modulename";
  sortOrder: string = "ASC";

  //Reactive Forms
  newForm: FormGroup;
  editForm: FormGroup;

  activeUser: string = "";


  //Autofocus TextBoxes
  @ViewChild("defaultTextBox_New") defaultTextBox_New: ElementRef;
  @ViewChild("defaultTextBox_Edit") defaultTextBox_Edit: ElementRef;


  //Sample for Testing Status
  samples: Observable<SystemCapabilityStatus[]>;
  loginUserName: string = "";


  constructor(private fb: FormBuilder, public loginService: LoginService,
    private labTestProceduresedureService: LabTestProcedureService,
    private formBuilder: FormBuilder,
    private systemCapabilityStatusService: SystemCapabilityStatusService,
    private toastr: ToastrService,
    private mainMenusService: MainMenusService) { }


  ngOnInit() {
    //Get data from database
    this.loginUserName = this.loginService.currentUserName;

    this.getMainModuleLists();

    // newForm
    this.newForm = this.formBuilder.group({
      modulename: this.formBuilder.control(null, [Validators.required]),
      addedby: this.formBuilder.control(null, [Validators.required]),
    });
    1
    // editForm
    this.editForm = this.formBuilder.group({
      id: this.formBuilder.control(null),
      modulename: this.formBuilder.control(null, [Validators.required]),
      isactivereference: this.formBuilder.control(null, [Validators.required]),
      modifiedby: this.formBuilder.control(null, [Validators.required]),

    });


    // Here
    this.samples = this.systemCapabilityStatusService.getSystemCapabilityStatus();

  }

  @ViewChild("ProcedureDesc") ProcedureDesc: ElementRef;
  @ViewChild("UpdateDesc") UpdateDesc: ElementRef;

  getMainModuleLists() {
    this.mainMenusService.getMainMenus().subscribe(
      (response: MainMenus[]) => {
        this.mainMenus = response;
        console.log(response);
        this.showLoading = false;
        this.calculateNoOfPages();
      }
    );
  }

  calculateNoOfPages() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var noOfPages = Math.ceil(filterPipe.transform(this.mainMenus, this.searchBy, this.searchText).length / this.pageSize);
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

  onNewClick(event) {
    //reset the newForm
    this.newForm.reset({ id: 0 });
    setTimeout(() => {
      //Focus the ClientLocation textbox in newForm
      this.defaultTextBox_New.nativeElement.focus();
      this.activeUser = this.loginUserName;


    }, 100);
  }

  onSaveClick() {
    if (this.newForm.valid) {
      //Start
      var StatusofReject = this.ProcedureDesc.nativeElement.value;
      Swal.fire({
        title: 'Are you sure that you want to append new data?',
        text: StatusofReject,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          //Invoke the REST-API call

          this.mainMenusService.insertNewData(this.newForm.value).subscribe((response) => {
            var p: MainMenus = new MainMenus();
            p.id = response.id;
            p.modulename = response.modulename;
            p.addedby = this.loginUserName;
            this.mainMenus.push(p);

            //Reset the newForm
            this.newForm.reset();

            $("#newModal").trigger("click");
            setTimeout(() => {

              this.getMainModuleLists();
            }, 400);

            // this.calculateNoOfPages();

            Swal.fire(
              'Append!',
              'Your data is Saved on production',
              'success'
            )


          }, (error) => {
            console.log(error);
          });

        }

      })

      //End

    }
    else {
      this.FieldOutRequiredField();
    }
  }

  FieldOutRequiredField() {
    this.toastr.warning('Field out the required fields!', 'Notifications');
  }

  onEditClick(event, StatusParam: MainMenus) {
    // //Reset the editForm
    this.editForm.reset();

    console.log(StatusParam.modulename);
    setTimeout(() => {
      //Set data into editForm
      this.editForm.patchValue(StatusParam);
      this.editIndex = this.mainMenus.indexOf(StatusParam);
      this.activeUser = this.loginUserName;

      //Focus the ClientLocation textbox in editForm
      this.defaultTextBox_Edit.nativeElement.focus();
    }, 100);
  }

  onUpdateClick() {
    if (this.editForm.valid) {
      var Status = this.UpdateDesc.nativeElement.value;
      Swal.fire({
        title: 'Are you sure that you want to modify the status?',
        text: Status,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {

          //Invoke the REST-API call
          this.mainMenusService.updateData(this.editForm.value).subscribe((response: MainMenus) => {
            //Update the response in Grid
            this.mainMenus[this.editIndex] = response;

            //Reset the editForm
            this.editForm.reset();
            $("#editCancelModal").trigger("click");
            
          Swal.fire(
            'Updated!',
            'your data on production has been modified',
            'success'
          )
          },
            (error) => {
              console.log(error);
            });

        }
      })



    }
  }

  onSearchTextChange(event) {
    this.calculateNoOfPages();
  }

  onFilterStatus(val) {

    if (!val) {
      this.getMainModuleLists();
    } else {


      if (val === "") {

      }
      else if (val === "true") {
        val = true;
      }
      else if (val === "false") {

        val = false;
      }

      const status = this.mainMenus.filter(status => status.isactive === val);
      this.mainMenus = status;
      // this.showLoading = false;
      this.calculateNoOfPages();
    }

  }


}
