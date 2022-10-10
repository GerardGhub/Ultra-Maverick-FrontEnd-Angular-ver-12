import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AlertDirective } from './directives/alert.directive';
import { RepeaterDirective } from './directives/repeater.directive';
import { EmployeeModule } from './employee/employee.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptorService } from './interceptors/jwt-interceptor.service';
import { JwtUnAuthorizedInterceptorService } from './interceptors/jwt-un-authorized-interceptor.service';
import { SharedModule } from './models/shared/shared.module';
import { AboutComponent } from './admin/components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartModule } from 'angular-highcharts';
import { SystemCapabilityStatusComponent } from './system-capability-status/system-capability-status.component';
import { UserAccountComponent } from './admin/components/user-account/user-account.component';
import { AllowablePercentageComponent } from './allowable-percentage/allowable-percentage.component';
import { ProjectsCancelledPoComponent } from './admin/components/projects-cancelled-po/projects-cancelled-po.component';
import { ReturnedPOTransactionStatusComponent } from './RM-Cacelled-PO-Status/returned-potransaction-status.component';
import { ProjectsPartialPoComponent } from './admin/components/projects-partial-po/projects-partial-po.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { DashboardService } from './services/dashboard.service';
import { TblNearlyExpiryMgmtComponent } from './admin/components/tbl-nearly-expiry-mgmt/tbl-nearly-expiry-mgmt.component';
import { ProjetPONearlyExpiryApprovalComponent } from './admin/components/projet-ponearly-expiry-approval/projet-ponearly-expiry-approval.component';
import { AspNetRolesComponent } from './admin/components/asp-net-roles/asp-net-roles.component';
import { WhRejectionApprovalComponent } from './admin/components/wh-rejection-approval/wh-rejection-approval.component';
import { ForLabtestComponent } from './components/labtest-module/for-labtest/for-labtest.component';
import { LabtestRecordsComponent } from './components/labtest-module/labtest-records/labtest-records.component';
import { NgxPrintDirective, NgxPrintModule } from 'ngx-print';
import { OnlineMRSComponent } from './components/online-mrs/online-mrs.component';
import { ChecklistComponent } from './components/qc-masterlist/checklist/checklist.component';
import { DetailsComponent } from './components/qc-masterlist/details/details.component';
import { DescriptionComponent } from './components/qc-masterlist/description/description.component';
import { ParametersComponent } from './components/qc-masterlist/paramenters/parameters.component';
import { SandboxComponent } from './sandbox/sandbox.component';
import { InternalOrderComponent } from './components/internal-preparation/internal-order.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProjectComponent } from './admin/components/project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LoginComponent,
    SignUpComponent,
    AlertDirective,
    RepeaterDirective,
    SystemCapabilityStatusComponent,
    UserAccountComponent,
    AllowablePercentageComponent,
    ReturnedPOTransactionStatusComponent,
    ProjectsPartialPoComponent,
    TblNearlyExpiryMgmtComponent,
    ProjetPONearlyExpiryApprovalComponent,
    AspNetRolesComponent,
    WhRejectionApprovalComponent,
    ForLabtestComponent,
    LabtestRecordsComponent,
    OnlineMRSComponent,
    ChecklistComponent,
    DetailsComponent,
    DescriptionComponent,
    ParametersComponent,
    InternalOrderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    AppRoutingModule,
    EmployeeModule,
    FlexLayoutModule,
    ChartModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    NgxPrintModule,
    FormsModule,
    MatCheckboxModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }), // ToastrModule added
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return sessionStorage.getItem('currentUser')
            ? JSON.parse(sessionStorage.getItem('currentUser')).token
            : null;
        },
      },
    }),
  ],
  providers: [
    NgxPrintDirective,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true,
    },
    [DashboardService],
    [ProjectComponent],
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtUnAuthorizedInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
