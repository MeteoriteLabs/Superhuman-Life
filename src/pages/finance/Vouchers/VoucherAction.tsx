import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import FinanceModal from '../../../components/financeModal/FinanceModal';
import StatusModal from '../../../components/StatusModal/StatusModal';
import authContext from '../../../context/auth-context';
import { CREATE_VOUCHER, DELETE_VOUCHER, EDIT_VOUCHER, TOGGLE_STATUS } from '../graphQL/mutations';
import { GET_VOUCHERS_BY_ID } from '../graphQL/queries';

interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete' | 'bank' | 'upi';
    current_status: boolean;
    rowData: any
}

function VoucherAction(props, ref) {

    const auth = useContext(authContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [formData, setFormData] = useState<any>();
    const formSchema = require("./voucher.json");

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            //restrict modal to render on delete and change status operation
            if (msg.actionType !== 'delete' && msg.actionType !== 'toggle-status') {
                modalTrigger.next(true);
            }
        }
    }));

    let name = ""
    switch (operation.actionType) {
        case "create": {
            name = "Create Voucher"
            break;
        }

        case 'view': {
            name = "View Voucher"
            break;
        }

        case 'edit': {
            name = "Edit Voucher"
            break;
        }
    }


    // View Voucher
    const FetchData = () => useQuery(GET_VOUCHERS_BY_ID, {
        variables: {
            id: operation.id,
            users_permissions_user: auth.userid
        },
        onCompleted: data => FillData(data),
        skip: (!operation.id),
    });

    const FillData = (data: any) => {
        let updateFormData: any = {};
        updateFormData.voucher_name = data.vouchers.data[0].attributes.voucher_name;
        updateFormData.discount_percentage = data.vouchers.data[0].attributes.discount_percentage;
        updateFormData.expiry_date = data.vouchers.data[0].attributes.expiry_date;
        updateFormData.Start_date = data.vouchers.data[0].attributes.Start_date;
        updateFormData.Usage_restriction = data.vouchers.data[0].attributes.Usage_restriction;

        setFormData(updateFormData)

        if (['edit', 'view'].indexOf(operation.actionType) > -1) {
            modalTrigger.next(true);
        }
        else {
            OnSubmit(null);
        }
    };

    FetchData()

    // Create Voucher
    const [createVoucher] = useMutation(CREATE_VOUCHER, { onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); } })
    const CreateVoucher = (form: any) => {
        createVoucher({
            variables: {
                data: {
                    voucher_name: form.voucher_name,
                    discount_percentage: form.discount_percentage,
                    expiry_date: form.expiry_date,
                    Start_date: form.Start_date,
                    Usage_restriction: form.Usage_restriction,
                    Status: "Active",
                    users_permissions_user: form.user_permissions_user
                }
            }
        })
    }

    //Edit Voucher
    const [editVoucher] = useMutation(EDIT_VOUCHER, { onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); } });
    const EditVoucher = (form: any) => editVoucher({ variables: form })

    //delete Voucher 
    const [deleteVoucher] = useMutation(DELETE_VOUCHER, {
        onCompleted: (e: any) => {
            props.callback();
            modalTrigger.next(false);
        }
    });
    const DeleteVoucher = (id) => deleteVoucher({ variables: { id: id } });

    //toggle status
    const [toggleVoucherStatus] = useMutation(TOGGLE_STATUS, {
        onCompleted: (e: any) => {
            props.callback();
            modalTrigger.next(false);
        }
    });
    const ToggleVoucherStatus = (id: String, Status) => {
        toggleVoucherStatus(
            {
                variables: {
                    id: id,
                    data:{
                        Status: Status === "Active" ? "Disabled" : "Active"
                    }
                }
            })
    };

    const OnSubmit = (frm: any) => {
        //bind user id
        if (frm) {
            frm.id = operation.id;
            frm.user_permissions_user = auth.userid;
        }

        switch (operation.actionType) {
            case 'create':
                CreateVoucher(frm);
                break;
            case 'edit':
                EditVoucher(frm);
                break;
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
                formData={operation.id && formData}
            />

            {operation.actionType === 'delete' &&
                <StatusModal
                    modalTile="Delete"
                    modalBody="Do you want to delete this voucher ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => DeleteVoucher(operation.id)}
                />}

            {operation.actionType === 'toggle-status' &&
                <StatusModal
                    modalTile="Change Status"
                    modalBody="Do you want to change status ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => ToggleVoucherStatus(operation.id, operation.current_status)}
                />
            }
        </div>
    )
}

export default React.forwardRef(VoucherAction)