import { Component } from "@angular/core";
import { QCService } from "../admin/components/projects/services/qcmodule.service";

@Component({
  selector: 'sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})

export class SandboxComponent {

  constructor(
    public qcService: QCService
  ) {}


  datas: any = []

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.qcService.getQcChecklistSandBox().subscribe({
    //   next: (response) => {
    //     this.datas = response.map((checkList: any) => {
    //       return {
    //         parent_chck_id: checkList.parent_chck_id,
    //         parent_chck_details: checkList.parent_chck_details,
    //         childCheckLists: checkList.childCheckLists.map((child: any) => {
    //           return {
    //             grandChildCheckLists: child.grandChildCheckLists.map((gc: any) => {
    //               return {
    //                 gc_id: gc.gc_id,
    //                 gc_description: gc.gc_description,
    //                 parameter: ""
    //               }
    //             })
    //           }
    //         })
    //       }
    //     })

    //     console.log(`data`,this.datas)

    //   }
    // })
  }


}
