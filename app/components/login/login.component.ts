import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginViewModel } from '../../models/login-view-model';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomErrorStateMatcher } from 'src/app/helpers/customErrorStateMatcher';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  @ViewChild('myAutoFocus') myAutoFocus: ElementRef;

  loginViewModel: LoginViewModel = new LoginViewModel();
  loginError: string = '';
  fieldTextType: boolean;
  formGroup: FormGroup;
  customErrorStateMatcher: CustomErrorStateMatcher =
    new CustomErrorStateMatcher();

  errorMessageFromResponse: string = '';

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  constructor(
    private loginService: LoginService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.formGroup = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      // ,/
      // customerName: new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-z. ]*$')]),
      // country: new FormControl(null, [Validators.required])
    });
  }


  ngOnInit() {
    // this.UsernameFocus();
    $('#eyeball').hide();
  }



  UsernameFocus() {
    setTimeout(() => {
      this.myAutoFocus.nativeElement.focus();
    }, 100);
  }

  checkDataFired(event: any) {
    if (this.formGroup.valid) {
      $('#eyeball').show();
    } else {
      $('#eyeball').hide();
    }
  }
  onLoginClick(event: any) {
    this.loginService.Login(this.loginViewModel).subscribe(
      (response) => {
        if (this.loginService.currentUserRoleSession == 'Admin') {
          this.router.navigate(['/admin', 'dashboard']);

        } else if (
          this.loginService.currentUserRoleSession == 'WarehouseChecker'
        ) {
          this.router.navigate(['/admin', 'dashboard']);

        } else if (this.loginService.currentUserRoleSession == 'QC Staff') {
          this.router.navigate(['/admin', 'dashboard']);
        } else if (this.loginService.currentUserRoleSession == 'QA Staff') {
          this.router.navigate(['/admin', 'dashboard']);

        } else if (this.loginService.currentUserRoleSession == 'QCSupervisor') {
          this.router.navigate(['/admin', 'dashboard']);
 
        } else {
          this.router.navigate(["/admin", "dashboard"]);
    
        }
     
          this.WelcomeMessage();
      },
      (error) => {
        console.log(error);
        this.errorMessageFromResponse = 'Invalid Username or Password';
        // this.errorToaster();
        this.InvalidCredentials();
      }
    );
  }

  errorToaster() {
    this.toastr.error(this.errorMessageFromResponse, 'Message');
  }

  InvalidCredentials() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Invalid Credentials!',
    });
  }

  WelcomeMessage() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Welcome to Ultra Maverick',
      showConfirmButton: false,
      timer: 600,
    });
  }

  //returns the form control instance based on the control name
  getFormControl(controlName: string): FormControl {
    return this.formGroup.get(controlName) as FormControl;
  }

  getErrorMessage(controlName: string, errorType: string): string {
    //controlName = "customerName"
    //errorType = "required"
    switch (controlName) {
      case 'username': {
        if (errorType === 'required')
          return 'Username is <strong>Required</strong>';
        else if (errorType === 'maxlength')
          return '<strong>Username</strong> can contain up to 30 characters only';
        // else if (errorType === "pattern")
        //   return "<strong>Name</strong> can contain alphabets or dot (.) or space only";
        // else
        return '';
      }
      case 'password': {
        if (errorType === 'required')
          return 'Password is <strong>Required</strong>';
        else if (errorType === 'maxlength')
          return '<strong>Password</strong> can contain up to 30 characters only';
        // else if (errorType === "pattern")
        //   return "<strong>Name</strong> can contain alphabets or dot (.) or space only";
        // else
        return '';
      }

      case 'email': {
        if (errorType === 'required')
          return "<strong>Email</strong> can't be blank";
        else if (errorType === 'email')
          return '<strong>Email</strong> should be in correct format. Eg: someone@example.com';
        else return '';
      }

      case 'country': {
        if (errorType === 'required')
          return 'You must choose a <strong>Country</strong>';
        else return '';
      }

      default:
        return '';
    }
  }
}
