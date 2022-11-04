import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DashboardService } from '../../../services/dashboard.service';
import { LoginService } from '../../../services/login.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { columnChartOptions } from '../../../charts/column-chart';
import { Project } from '../../../models/project';
import { interval, Observable, Subscription } from 'rxjs';
import { WhCheckerDashboardService } from '../../../services/wh-checker-dashboard.service';
import { DryWhStoreOrders } from '../../../models/dry-wh-store-orders';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  Designation: string;
  Username: string;
  NoOfTeamMembers: number;
  TotalCostOfAllProjects: number;
  PendingTasks: number;
  UpComingProjects: number;
  ProjectCost: number;
  CurrentExpenditure: number;
  AvailableFunds: number;
  ToDay: Date;

  Clients: string[];
  Projects: string[];
  Years: number[] = [];
  TeamMembersSummary = [];
  TeamMembers = [];

  //properties
  dashboardGridCols: number = 4;
  cardColspan: number = 2;
  WhRejects: Project[] = [];
  WhStoreOrders: DryWhStoreOrders[] = [];
  columnChart: Chart = new Chart(columnChartOptions);
  bookingsLoadingStarted: boolean = false;
  projects: Project[] = [];
  totalPoRowCount: number = 0;
  totalPoRowCountCancelled: number = 0;
  totalPoPartialReceiving: number = 0;
  totalPoPartialRejectatWH: number = 0;
  private updateSubscription: Subscription;
  totalPartialPoReceivingRejectRowCount: number = 0;

  totalStoreOrderRowCount: number = 0;
  totalStoreOrderPreparedDistinctRowCount: number = 0;

  totalCancelledTransactions: number = 0;
  totalStoreDispatching: number = 0;

  constructor(
    private dashboardService: DashboardService,
    public loginService: LoginService,
    private mediaObserver: MediaObserver,
    private whCheckerDashboardService: WhCheckerDashboardService,
    public appComponent: AppComponent
  ) {}

  ngOnInit() {
    //responsive dashbaord
    this.mediaObserver.asObservable().subscribe((media: MediaChange[]) => {
      if (media.some((mediaChange) => mediaChange.mqAlias == 'lt-sm')) {
        this.dashboardGridCols = 1;
        this.cardColspan = 1;
      } else if (media.some((mediaChange) => mediaChange.mqAlias == 'lt-md')) {
        this.dashboardGridCols = 2;
        this.cardColspan = 2;
      } else {
        this.dashboardGridCols = 4;
        this.cardColspan = 2;
      }
    });
   



    this.loginService.detectIfAlreadyLoggedIn();



    this.ToDay = new Date();

   

    this.DashboardPoSummary();
    this.DashboardPoSummaryCancelled();
    this.DashboardPoSummaryPartialReceiving();
    this.DashboardPoSummaryPartialReceivingRejectonWH();

    this.DashboardStoreOrder();
    this.DashboardDistinctPreparedStoreOrder();
    // this.DashboardDistinctCancelledPreparedStoreOrder();
    this.DashboardAllTotalCancelledItems();
    this.DashboardAllStoreTotalDispatchDistinct();
    // this.IntervalPageforRefresh();

    this.appComponent.getUserRoleModules();
  }

  IntervalPageforRefresh() {
    // this.updateSubscription = interval(1000).subscribe(
    //   (val) => { this.DashboardPoSummary()
    // }

    // );
    //in 10 seconds do something
    interval(10000).subscribe((x) => {
      this.DashboardPoSummary();
    });
  }

  DashboardPoSummary() {
    this.dashboardService.getAllProjects().subscribe((response: Project[]) => {
      if (response) {
        this.projects = response;
        this.totalPoRowCount = response.length;
      }
    });
  }

  DashboardPoSummaryCancelled() {
    this.dashboardService
      .getAllProjectsCancelledTransaction()
      .subscribe((response: Project[]) => {
        if (response) {
          this.projects = response;
          this.totalPoRowCountCancelled = response.length;
        }
      });
  }

  DashboardPoSummaryPartialReceiving() {
    this.dashboardService
      .getAllProjectsPartialPoService()
      .subscribe((response: Project[]) => {
        if (response) {
          this.projects = response;
          this.totalPoPartialReceiving = response.length;
        }
      });
  }

  DashboardPoSummaryPartialReceivingRejectonWH() {
    this.dashboardService
      .getAllProjectsPartialReceivingReject()
      .subscribe((response: Project[]) => {
        if (response) {
          this.WhRejects = response;
          this.totalPoPartialRejectatWH = response.length;
        }
      });
  }

  DashboardStoreOrder() {
    this.whCheckerDashboardService
      .getStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.WhStoreOrders = response;
          this.totalStoreOrderRowCount = response.length;
        }
      });
  }

  DashboardDistinctPreparedStoreOrder() {
    this.whCheckerDashboardService
      .getDistinctPreparedStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.WhStoreOrders = response;
          this.totalStoreOrderPreparedDistinctRowCount = response.length;
        }
      });
  }

  DashboardAllTotalCancelledItems() {
    this.whCheckerDashboardService
      .getAllPreparedCancelledStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.WhStoreOrders = response;
          this.totalCancelledTransactions = response.length;
        }
      });
  }

  DashboardAllStoreTotalDispatchDistinct() {
    this.whCheckerDashboardService
      .getAllDispatchingStoreOrders()
      .subscribe((response: DryWhStoreOrders[]) => {
        if (response) {
          this.WhStoreOrders = response;
          this.totalStoreDispatching = response.length;
        }
      });
  }
}
