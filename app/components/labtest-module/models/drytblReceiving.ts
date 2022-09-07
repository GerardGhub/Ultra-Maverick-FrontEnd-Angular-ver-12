export class drytblReceiving
{
            id: number;
            lab_status: string;
            lab_result_remarks: string;
            lab_result_released_by: string;
            lab_result_released_date: string;
            lab_sub_remarks: string;
            laboratory_procedure: string;
            // lab_exp_date_extension: string;

    constructor()
    {
        this.id = null;
        this.lab_status = null;
        this.lab_result_remarks = null; 
        this.lab_result_released_by = null;
        this.lab_result_released_date = null;
        this.lab_sub_remarks = null;
        this.laboratory_procedure = null;
        // this.lab_exp_date_extension = null;
    }
}
