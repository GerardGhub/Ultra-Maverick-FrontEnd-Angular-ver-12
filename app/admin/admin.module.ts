import { NgModule } from '@angular/core';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardService } from '../services/dashboard.service';
import { ProjectsComponent } from './components/projects/projects.component';
import { CheckBoxPrinterComponent } from './components/check-box-printer/check-box-printer.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { AdminRoutingModule } from './admin-routing/admin-routing.module';
import { RouterModule } from '@angular/router';
import { ProjectComponent } from './components/project/project.component';
import { SharedModule } from '../models/shared/shared.module';
import { CountriesComponent } from './components/countries/countries.component';
import { ClientLocationsComponent } from './components/client-locations/client-locations.component';
import { TaskStatusComponent } from './components/task-status/task-status.component';
import { MastersComponent } from './components/masters/masters.component';
import { TaskPrioritiesComponent } from './components/task-priorities/task-priorities.component';
import { MaterialModule } from '../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular-highcharts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RejectedStatusComponent } from './components/RM-reject-status/rejected-status.component';
import { CancelledPOTransactionStatusComponent } from './components/RM-reject-status-of-QC/cancelled-potransaction-status.component';
import { StoreOrderComponent } from './components/store-order/store-order.component';
import { StoreOrderDispatchingRecordComponent } from './components/store-order-dispatching/store-order-dispatching-record.component';
import { LaboratoryProcedureComponent } from './components/lt-laboratory-procedure/laboratory-procedure.component';
import { TestBindingComponent } from './components/test-binding/test-binding.component';
import { LabTestRemarksComponent } from './components/lt-laboratory-test-remarks/lab-test-remarks.component';
import { LabTestSubRemarksComponent } from './components/lt-laboratory-test-sub-remarks/labtest-laboratory-test-sub-remarks.component';
import { ProjectsCancelledPoComponent } from './components/projects-cancelled-po/projects-cancelled-po.component';
import { PreparedStoreOrderComponent } from './components/store-order-prepared/prepared-store-order.component';
import { StoreOrderActiveCancelledTransactionComponent } from './components/store-order-cancelled-transaction/store-order-active-cancelled-transaction.component';
import { SandboxComponent } from '../sandbox/sandbox.component';
import { ParentMainModulesComponent } from './components/parent-main-modules/parent-main-modules.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MyProfileComponent,
    ProjectsComponent,
    ProjectComponent,
    CheckBoxPrinterComponent,
    ProjectDetailsComponent,
    CountriesComponent,
    ClientLocationsComponent,
    TaskPrioritiesComponent,
    TaskStatusComponent,
    MastersComponent,
    RejectedStatusComponent,
    CancelledPOTransactionStatusComponent,
    StoreOrderComponent,
    StoreOrderDispatchingRecordComponent,
    LaboratoryProcedureComponent,
    TestBindingComponent,
    LabTestRemarksComponent,
    LabTestSubRemarksComponent,
    ProjectsCancelledPoComponent,
    PreparedStoreOrderComponent,
    StoreOrderActiveCancelledTransactionComponent,
    SandboxComponent,
    ParentMainModulesComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    ChartModule,
  ],
  exports: [
    DashboardComponent,
    MyProfileComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
  ],
  providers: [DashboardService],
  entryComponents: [
    CountriesComponent,
    ClientLocationsComponent,
    TaskPrioritiesComponent,
    TaskStatusComponent,
    RejectedStatusComponent,
    CancelledPOTransactionStatusComponent,
    StoreOrderComponent,
    LaboratoryProcedureComponent,
  ],
})
export class AdminModule {}
