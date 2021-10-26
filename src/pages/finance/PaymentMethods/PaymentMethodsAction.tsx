import { useMutation } from '@apollo/client';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import FinanceModal from '../../../components/financeModal/FinanceModal'


import authContext from '../../../context/auth-context';
import { CREATE_BANK_DETAIL, CREAT_UPI } from "../graphQL/mutations"

interface Operation {
    actionType: 'bank' | 'upi';
}

function PaymentMethodsAction(props, ref) {

    const auth = useContext(authContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [formData, setFormData] = useState<any>();


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            modalTrigger.next(true);
        }
    }));



    //Bank Account
    const [createBankDetail] = useMutation(CREATE_BANK_DETAIL, { onCompleted: (r: any) => { modalTrigger.next(false); } });

    const CreateBankDetail = (form: any) => {
        createBankDetail({
            variables: {
                Full_Name: form.Full_Name,
                Account_Number: form.Account_Number,
                Bank_Name: form.Bank_Name,
                IFSC_Code: form.IFSC_Code,
                PAN_Number: form.PAN_Number,
                GST_Number: form.GST_Number || "",
                Company_Name: form.Company_Name  || "",
                Company_Address: form.Company_Address  || "",
                users_permissions_user: form.user_permissions_user
            }
        })
    };



    // UPI
    const [createUPI] = useMutation(CREAT_UPI, { onCompleted: (r: any) => { modalTrigger.next(false); } });

    const CreateUPI = (form: any) => {
        createUPI({
            variables: {
                Full_Name: form.Full_Name,
                Phone_Number: form.Phone_Number,
                UPI_ID: form.UPI_ID,
                users_permissions_user: form.user_permissions_user
            }
        })
    };

    const OnSubmit = (frm: any) => {
        //bind user id
        if (frm) {
            frm.user_permissions_user = auth.userid;
        }

        switch (operation.actionType) {
            case 'bank':
                CreateBankDetail(frm);
                break;

            case 'upi':
                CreateUPI(frm);
                break;
        }
    };


    let name = ""
    let formSchema = ""
    switch (operation.actionType) {
        case "bank": {
            name = "Bank Account"
            formSchema = require("./bankAccount.json");
            break;
        }

        case "upi": {
            name = "UPI"
            formSchema = require("./upi.json");
            break;
        }
    };


    const uiSchema: any = {
        "GST":{
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        }
    }



    return (
        <div>
            <FinanceModal
                modalTrigger={modalTrigger}
                formSchema={formSchema}
                name={name}
                formSubmit={(frm: any) => OnSubmit(frm)}
                actionType={operation.actionType}
                formData={formData}
                formUISchema={uiSchema}
            />
        </div>
    )
}


export default React.forwardRef(PaymentMethodsAction)