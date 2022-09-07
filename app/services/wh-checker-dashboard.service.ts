import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DryWhStoreOrders } from '../models/dry-wh-store-orders';
import { StorePreparationLogs } from '../models/store-preparation-logs';

@Injectable({
  providedIn: 'root',
})
export class WhCheckerDashboardService {
  public MySubject: BehaviorSubject<boolean>;
  constructor(private httpClient: HttpClient) {
    this.MySubject = new BehaviorSubject<boolean>(false);
  }

  getStoreOrders(): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>('/api/store_orders', {
      responseType: 'json',
    });
  }

  getDistinctPreparedStoreOrders(): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/dry_wh_orders_checklist_distinct',
      { responseType: 'json' }
    );
  }

  SearchPreparedItems(
    searchBy: string,
    searchText: string
  ): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/store_orders/search/' + searchBy + '/' + searchText,
      { responseType: 'json' }
    );
  }

  SearchItems(id: number): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/store_orders/search/' + id,
      { responseType: 'json' }
    );
  }

  SearchPartialCancelled(
    searchBy: string,
    searchText: string,
    searchIndex: number
  ): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/store_orders_partial_cancel/search/' +
        searchBy +
        '/' +
        searchText +
        '/' +
        searchIndex,
      { responseType: 'json' }
    );
  }

  updateProject(
    existingProject: DryWhStoreOrders
  ): Observable<DryWhStoreOrders> {
    return this.httpClient.put<DryWhStoreOrders>(
      '/api/store_orders',
      existingProject,
      { responseType: 'json' }
    );
  }

  updateStoreOrderPerItem(
    existingProject: DryWhStoreOrders
  ): Observable<DryWhStoreOrders> {
    return this.httpClient.put<DryWhStoreOrders>(
      '/api/store_orders/cancelitems',
      existingProject,
      { responseType: 'json' }
    );
  }

  updateCancelledStoreOrderPerItemLogisticReturn(
    existingProject: DryWhStoreOrders
  ): Observable<DryWhStoreOrders> {
    return this.httpClient.put<DryWhStoreOrders>(
      '/api/store_orders/cancelreturnitemslogistic',
      existingProject,
      { responseType: 'json' }
    );
  }

  updateCancelledStoreOrderPerItemLogisticReturnCountState(
    existingProject: DryWhStoreOrders
  ): Observable<DryWhStoreOrders> {
    return this.httpClient.put<DryWhStoreOrders>(
      '/api/store_orders/cancelreturnitemslogisticstatecount',
      existingProject,
      { responseType: 'json' }
    );
  }

  updateStoreOrderPerItemCancelledCountOneToOne(
    existingProject: DryWhStoreOrders
  ): Observable<DryWhStoreOrders> {
    return this.httpClient.put<DryWhStoreOrders>(
      '/api/store_orders/cancelindividualitems',
      existingProject,
      { responseType: 'json' }
    );
  }

  updateStoreOrderPerItemReadLine(
    existingProject: StorePreparationLogs
  ): Observable<StorePreparationLogs> {
    return this.httpClient.put<StorePreparationLogs>(
      '/api/store_orders/cancelitems/readline',
      existingProject,
      { responseType: 'json' }
    );
  }

  getDistinctPreparedCancelledStoreOrders(): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/dry_wh_orders_checklist_distinct_cancelled',
      { responseType: 'json' }
    );
  }

  getAllPreparedCancelledStoreOrders(): Observable<DryWhStoreOrders[]> {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/getStoreOrderMaterialCancelled',
      { responseType: 'json' }
    );
  }

  getAllDispatchingStoreOrders(): Observable<any> {
    return this.httpClient.get(
      '/api/dry_wh_orders_distinct_store_dispatching',
      { responseType: 'json' }
    );
  }

  getDistinctPreparedStoreOrderHasPartialCancel(): Observable<
    DryWhStoreOrders[]
  > {
    return this.httpClient.get<DryWhStoreOrders[]>(
      '/api/dry_wh_orders_checklist_distinct_partial_cancel',
      { responseType: 'json' }
    );
  }
}
