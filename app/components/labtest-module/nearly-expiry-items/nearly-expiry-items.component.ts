import { Component, OnInit } from '@angular/core';
import { NearlyExpiryItems } from '../../../models/nearly-expiry-items';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { TblNearlyExpiryMgmtService } from '../../../services/tbl-nearly-expiry-mgmt.service';
import { ForLabtest } from '../models/for-labtest';

@Component({
  selector: 'app-nearly-expiry-items',
  templateUrl: './nearly-expiry-items.component.html',
  styleUrls: ['./nearly-expiry-items.component.scss']
})
export class NearlyExpiryItemsComponent implements OnInit {

  constructor(
    private tblNearlyExpiryMgmtService: TblNearlyExpiryMgmtService
  ) { }

  NearlyExpiryList: NearlyExpiryItems[] = [];
  searchByNE: string = 'item_code';
  searchTextNE: string = '';

  sortByNE: string = 'item_code';
  sortOrderNE: string = 'ASC';

  currentPageIndexNE: number = 0;
  pagesNE: any[] = [];
  pageSize: number = 7;
  showLoading: boolean = true;
  totalNearlyExpiryItems: number = 0;

  ngOnInit(): void {
    this.getLabRecordsLists();
  }

  getLabRecordsLists() {
    this.tblNearlyExpiryMgmtService
      .getAllItemsNearlyExpiry()
      .subscribe((response: NearlyExpiryItems[]) => {
        this.NearlyExpiryList = response;
        this.showLoading = false;
        this.calculateNoOfPagesNE();
        if (response) {
          this.totalNearlyExpiryItems = response.length;
        }
      });
  }

  onSearchTextKeyup(event: any) {
    this.calculateNoOfPagesNE();
  }

  onPageIndexClickedNE(pageIndex: number) {
    this.currentPageIndexNE = pageIndex;
  }

  calculateNoOfPagesNE() {
    //Get no. of Pages
    let filterPipe = new FilterPipe();
    var forLabtest = filterPipe.transform(
      this.NearlyExpiryList,
      this.searchByNE,
      this.searchTextNE
    );
    var noOfPages = Math.ceil(forLabtest.length / this.pageSize);

    this.pagesNE = [];

    //Generate Pages
    for (let i = 0; i < noOfPages; i++) {
      this.pagesNE.push({ pageIndex: i });
    }
    this.currentPageIndexNE = 0;
  }

}
