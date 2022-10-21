import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { RouterLoggerService } from './services/router-logger.service';
// import { fadeAnimation, slideUpAnimation, z } from "./my-animation";
import {
  fadeAnimation,
  slideUpAnimation,
  zoomUpAnimation,
  zoomLeftAnimation,
  slideLeftOrRightAnimation,
  keyFrameAnimation,
} from './my-animation';
import { Project } from './models/project';
import { DashboardService } from './services/dashboard.service';
import { ForLabtest } from './components/labtest-module/models/for-labtest';
import { ForLabtestService } from './components/labtest-module/services/for-labtest.service';
import { LabtestForApprovalService } from './components/labtest-module/services/labtest-forapproval.service';
import { LabtestApproval } from './components/labtest-module/models/labtest-approval';
import { WhCheckerDashboardService } from './services/wh-checker-dashboard.service';
import { DryWhStoreOrders } from './models/dry-wh-store-orders';
import { PreparedOrdersService } from './admin/components/store-order-prepared/services/prepared-order.service';
import { CancelledOrderService } from './admin/components/store-order-cancelled-transaction/services/cancelled-order.service';
import { RoleModules } from './models/rolemodules';
import { UserAccountService } from './services/user-account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [keyFrameAnimation],
})
export class AppComponent {
  showStatistics: boolean = false;
  WhRejects: Project[] = [];
  cancelledPoSummary: Project[] = [];
  roleModulesSummary: RoleModules[] = [];
  storeOrders: DryWhStoreOrders[] = [];
  projects: DryWhStoreOrders[] = [];
  totalPoRowCount: number = null;
  totalRoleModulesRowCount: number = null;
  totalPoRowCountCancelled: number = null;
  totalPoPartialReceiving: number = null;

  totalForLabtest: number = null;
  totalForApproval: number = null;
  activeUserRoleId: string = null;

  totalforlabtestforapproval: number = null;

  totalPoPartialReceivingNearlyExpiryApproval = null;
  //Rejection Call at back End
  totalPoPartialRejectatWH: number = null;

  totalPreparationBadge: number = null;
  totalPreparedOrdersCount: number = null;
  totalDispatchingRowCount: number = null;
  totalCancelledCount: number = null;
  totalStoreOrderRowCount: number;

  constructor(
    private dashboardService: DashboardService,
    public loginService: LoginService,
    private domSanitizer: DomSanitizer,
    private routerLoggerService: RouterLoggerService,
    private router: Router,
    private forLabtestService: ForLabtestService,
    private labtestForApprovalService: LabtestForApprovalService,
    private whCheckerDashboardService: WhCheckerDashboardService,
    private preparedOrderService: PreparedOrdersService,
    private cancelledOrderService: CancelledOrderService,
    private userAccountService: UserAccountService
  ) {}

  ngOnInit() {
    this.loginService.detectIfAlreadyLoggedIn();
    this.totalPreparationCount();
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     let userName = this.loginService.currentUserName
    //       ? this.loginService.currentUserName
    //       : 'anonymous';
    //     let logMsg =
    //       new Date().toLocaleString() +
    //       ': ' +
    //       userName +
    //       ' navigates to ' +
    //       event.url;
    //     this.routerLoggerService.log(logMsg).subscribe();
    //   }
    // });

    this.getPreparedOrdersCount();
    this.getCancelledTransactionCount();
    this.getDispatchingCount();
    this.getStoreOrderList();

    this.DashboardPoSummary();
    this.DashboardPoSummaryCancelled();
    this.DashboardPoSummaryPartialReceiving();
    this.DashboardPoSummaryPartialReceivingNearlyExpiryApproval();
    this.DashboardPoSummaryPartialReceivingRejectionWH();

    this.getForLabTest();
    this.getForApproval();
    this.totalForLabtestForApproval();
    this.activeUserRoleId = this.loginService.currentUserRole;
    // alert(this.activeUserRoleId);
    alert("Sample");
    this.getUserRoleModules();
  }

  getForLabTest() {
    this.forLabtestService
      .getForLabtestDetails()
      .subscribe((response: ForLabtest[]) => {
        if (response) {
          this.totalForLabtest = response.length;
        }
      });
  }

  getForApproval() {
    this.labtestForApprovalService
      .getApprovalDetails()
      .subscribe((response: LabtestApproval[]) => {
        if (response) {
          this.totalForApproval = response.length;
        }
      });
  }

  totalForLabtestForApproval() {
    this.totalforlabtestforapproval =
      this.totalForLabtest + this.totalForApproval;
  }

  // Preparation ******************************************************************************************
  getPreparedOrdersCount() {
    this.preparedOrderService.getPreparedOrderList().subscribe((response) => {
      if (response) {
        this.totalPreparedOrdersCount = response.length;
      }
    });
  }

  getDispatchingCount() {
    this.whCheckerDashboardService
      .getAllDispatchingStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.projects = response;
          this.totalDispatchingRowCount = response.length;
        }
      });
  }

  getCancelledTransactionCount() {
    this.cancelledOrderService.getCancelledOrderList().subscribe((response) => {
      if (response) {
        this.totalCancelledCount = response.length;
      }
    });
  }

  getStoreOrderList() {
    this.whCheckerDashboardService
      .getStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.storeOrders = response;
          this.totalStoreOrderRowCount = response.length;
        }
      });
  }

  totalPreparationCount() {
    this.totalPreparationBadge =
      this.totalPreparedOrdersCount + this.totalCancelledCount;
  }

  DashboardPoSummaryPartialReceivingRejectionWH() {
    this.dashboardService
      .getAllProjectsPartialReceivingReject()
      .subscribe((response: Project[]) => {
        // debugger;
        if (response) {
          this.WhRejects = response;
          this.totalPoPartialRejectatWH = response.length;
        }
      });
  }

  DashboardPoSummary() {
    this.dashboardService.getAllProjects().subscribe((response: Project[]) => {
      if (response) {
        this.cancelledPoSummary = response;
        this.totalPoRowCount = response.length;
      }
    });
  }

  DashboardPoSummaryCancelled() {
    this.dashboardService
      .getAllProjectsCancelledTransaction()
      .subscribe((response: Project[]) => {
        if (response) {
          this.cancelledPoSummary = response;
          this.totalPoRowCountCancelled = response.length;
        }
      });
  }

  DashboardPoSummaryPartialReceiving() {
    this.dashboardService
      .getAllProjectsPartialPoService()
      .subscribe((response: Project[]) => {
        if (response) {
          this.cancelledPoSummary = response;
          this.totalPoPartialReceiving = response.length;
        }
      });
  }

  DashboardPoSummaryPartialReceivingNearlyExpiryApproval() {
    this.dashboardService
      .getAllProjetPONearlyExpiryApprovalService()
      .subscribe((response: Project[]) => {
        if (response) {
          this.cancelledPoSummary = response;
          this.totalPoPartialReceivingNearlyExpiryApproval = response.length;
        }
      });
  }

  onSearchClick() {
    console.log(this.loginService.currentUserName);
  }


  getUserRoleModules() {
    this.userAccountService.getUserRoleList(this.activeUserRoleId).subscribe((response: RoleModules[]) => {
      if (response) {
        this.roleModulesSummary = response;
        this.totalRoleModulesRowCount = response.length;
        console.warn(response);
      }
    });
  }



  getState(outlet) {
    return outlet.isActivated
      ? outlet.activatedRoute.snapshot.url[0].path &&
          outlet.activatedRouteData['linkIndex']
      : 'none';
  }
}
