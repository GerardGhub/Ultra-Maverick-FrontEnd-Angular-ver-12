import { NgModule } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule, Routes } from "@angular/router";
import { ChartModule } from "angular-highcharts";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  { path: '', component: DashboardComponent },
]
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    ChartModule,
  ]
})

export class DashboardModule {

}
