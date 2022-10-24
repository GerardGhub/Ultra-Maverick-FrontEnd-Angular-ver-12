import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuardService } from '../../guards/can-activate-guard.service';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { ProjectDetailsComponent } from '../components/project-details/project-details.component';
import { MastersComponent } from '../components/masters/masters.component';
import { ProjectsCancelledPoComponent } from '../components/projects-cancelled-po/projects-cancelled-po.component';
import { ProjectsPartialPoComponent } from '../components/projects-partial-po/projects-partial-po.component';
import { ProjetPONearlyExpiryApprovalComponent } from '../components/projet-ponearly-expiry-approval/projet-ponearly-expiry-approval.component';
import { TblNearlyExpiryMgmtComponent } from '../components/tbl-nearly-expiry-mgmt/tbl-nearly-expiry-mgmt.component';
import { WhRejectionApprovalComponent } from '../components/wh-rejection-approval/wh-rejection-approval.component';
import { StoreOrderComponent } from '../components/store-order/store-order.component';
import { PreparedStoreOrderComponent } from '../components/store-order-prepared/prepared-store-order.component';
import { StoreOrderActiveCancelledTransactionComponent } from '../components/store-order-cancelled-transaction/store-order-active-cancelled-transaction.component';
import { StoreOrderDispatchingRecordComponent } from '../components/store-order-dispatching/store-order-dispatching-record.component';
import { ForLabtestComponent } from '../../components/labtest-module/for-labtest/for-labtest.component';
import { LabtestRecordsComponent } from '../../components/labtest-module/labtest-records/labtest-records.component';
import { OnlineMRSComponent } from '../../components/online-mrs/online-mrs.component';
import { SandboxComponent } from '../../../app/sandbox/sandbox.component';
import { InternalOrderComponent } from '../../components/internal-preparation/internal-order.component';
import { ParentMainModulesComponent } from '../components/parent-main-modules/parent-main-modules.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanActivateGuardService],
    data: { expectedRole: 'Admin' },
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { linkIndex: 0 },
      },
      {
        path: 'qc-recieving',
        component: ProjectsComponent,
        data: { linkIndex: 2 },
      },
      {
        path: 'projects/view/:projectid',
        component: ProjectDetailsComponent,
        data: { linkIndex: 3 },
      },
      { path: 'masters', component: MastersComponent, data: { linkIndex: 4 } },
      {
        path: 'projectscancel',
        component: ProjectsCancelledPoComponent,
        data: { linkIndex: 5 },
      },
      {
        path: 'wh-recieving',
        component: ProjectsPartialPoComponent,
        data: { linkIndex: 6 },
      },
      {
        path: 'nearly-expiry',
        component: ProjetPONearlyExpiryApprovalComponent,
        data: { linkIndex: 7 },
      },
      {
        path: 'expirydaymgmt',
        component: TblNearlyExpiryMgmtComponent,
        data: { linkIndex: 8 },
      },
      {
        path: 'masters/user',
        component: MastersComponent,
        data: { linkIndex: 9 },
      },
      {
        path: 'masters/rmclassification',
        component: MastersComponent,
        data: { linkIndex: 10 },
      },
      {
        path: 'masters/rmcancelandreturn',
        component: MastersComponent,
        data: { linkIndex: 11 },
      },
      {
        path: 'wh-rejection',
        component: WhRejectionApprovalComponent,
        data: { linkIndex: 12 },
      },
      {
        path: 'store-order',
        component: StoreOrderComponent,
        data: { linkIndex: 13 },
      },
      {
        path: 'store-order/prepared',
        component: PreparedStoreOrderComponent,
        data: { linkIndex: 14 },
      },
      {
        path: 'store-order/cancelled',
        component: StoreOrderActiveCancelledTransactionComponent,
        data: { linkIndex: 15 },
      },
      {
        path: 'store-order/dispatching',
        component: StoreOrderDispatchingRecordComponent,
        data: { linkIndex: 16 },
      },
      {
        path: 'masters/labtest',
        component: MastersComponent,
        data: { linkIndex: 17 },
      },
      {
        path: 'forlabtest',
        component: ForLabtestComponent,
        data: { linkIndex: 18 },
      },
      {
        path: 'labtestrecords',
        component: LabtestRecordsComponent,
        data: { linkIndex: 19 },
      },
      {
        path: 'online-mrs',
        component: OnlineMRSComponent,
        data: { linkIndex: 20 },
      },
      {
        path: 'masters/qc-master-list',
        component: MastersComponent,
        data: { linkIndex: 21 },
      },
      { path: 'sandbox', component: SandboxComponent, data: { linkIndex: 22 } },
      {
        path: 'internal-order',
        component: InternalOrderComponent,
        data: { linkIndex: 23 },
      },
      {
        path: 'masters/parent-main-modules',
        component: MastersComponent,
        data : {linkIndex: 24},
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
