import { useMutation, useQuery } from '@apollo/client';
import React, { useContext, useImperativeHandle, useState } from 'react';
import { Subject } from 'rxjs';
import FinanceModal from 'components/financeModal/FinanceModal';
import StatusModal from 'components/StatusModal/StatusModal';
import authContext from 'context/auth-context';
import { schema, widgets } from './VouchersSchema';
import { CREATE_VOUCHER, DELETE_VOUCHER, EDIT_VOUCHER, TOGGLE_STATUS } from '../graphQL/mutations';
import { GET_VOUCHERS_BY_ID } from '../graphQL/queries';
import Toaster from 'components/Toaster';

interface Vouchers {
    voucher_name: string;
    percentage_discount: string | null;
    Start_date: string;
    expiry_date: string;
    Usage_restriction: number;
    flat_discount: string | null;
    discount: string;
}

interface VouchersForm {
    id: string;
    user_permissions_user: string;
    voucher_name: string;
    percentage_discount: string;
    Start_date: string;
    expiry_date: string;
    Usage_restriction: number;
    flat_discount: string;
}

interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete' | 'bank' | 'upi';
    current_status: string;
    rowData: unknown;
}

function VoucherAction(props: { callback: () => void }, ref): JSX.Element {
    const auth = useContext(authContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const modalTrigger = new Subject();
    const [formData, setFormData] = useState<Vouchers>({} as Vouchers);
    const formSchema = require('./voucher.json');
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isVoucherCreated, setIsVoucherCreated] = useState<boolean>(false);
    const [isVoucherDeleted, setIsVoucherDeleted] = useState<boolean>(false);
    const [isVoucherUpdated, setIsVoucherUpdated] = useState<boolean>(false);
    const [isVoucherStatusUpdated, setIsVoucherStatusUpdated] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // display status modal
            if (msg.actionType === 'toggle-status') {
                setShowStatusModal(true);
            }

            // display delete modal
            if (msg.actionType === 'delete') {
                setShowDeleteModal(true);
            }

            //restrict modal to render on delete and change status operation
            if (msg.actionType !== 'delete' && msg.actionType !== 'toggle-status') {
                modalTrigger.next(true);
            }
        }
    }));

    let name = '';
    switch (operation.actionType) {
        case 'create': {
            name = 'Create Voucher';
            break;
        }

        case 'view': {
            name = 'View Voucher';
            break;
        }

        case 'edit': {
            name = 'Edit Voucher';
            break;
        }
    }

    // View Voucher
    const FetchData = () =>
        useQuery(GET_VOUCHERS_BY_ID, {
            variables: {
                id: operation.id,
                users_permissions_user: auth.userid
            },
            onCompleted: (data) => FillData(data),
            skip: !operation.id
        });

    const FillData = (data) => {
        const updateFormData: Vouchers = {} as Vouchers;
        updateFormData.voucher_name = data.vouchers.data[0].attributes.voucher_name;
        updateFormData.percentage_discount = data.vouchers.data[0].attributes.discount_percentage
            ? JSON.stringify({ input: data.vouchers.data[0].attributes.discount_percentage })
            : null;
        updateFormData.expiry_date = data.vouchers.data[0].attributes.expiry_date;
        updateFormData.Start_date = data.vouchers.data[0].attributes.Start_date;
        updateFormData.Usage_restriction = data.vouchers.data[0].attributes.Usage_restriction;
        updateFormData.flat_discount = data.vouchers.data[0].attributes.flat_discount
            ? JSON.stringify({ input: data.vouchers.data[0].attributes.flat_discount })
            : null;
        updateFormData.discount = data.vouchers.data[0].attributes.discount_percentage
            ? 'Percentage'
            : 'Flat';

        setFormData(updateFormData);

        if (['edit', 'view'].indexOf(operation.actionType) > -1) {
            modalTrigger.next(true);
        }
    };

    FetchData();

    // Create Voucher
    const [createVoucher] = useMutation(CREATE_VOUCHER, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsVoucherCreated(!isVoucherCreated);
        }
    });

    const CreateVoucher = (form: VouchersForm) => {
        createVoucher({
            variables: {
                data: {
                    voucher_name: form.voucher_name,
                    discount_percentage: form.percentage_discount
                        ? JSON.parse(form.percentage_discount).input
                        : null,
                    expiry_date: form.expiry_date,
                    Start_date: form.Start_date,
                    Usage_restriction: form.Usage_restriction,
                    Status: 'Active',
                    users_permissions_user: form.user_permissions_user,
                    flat_discount: form.flat_discount ? JSON.parse(form.flat_discount).input : null
                }
            }
        });
    };

    //Edit Voucher
    const [editVoucher] = useMutation(EDIT_VOUCHER, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsVoucherUpdated(!isVoucherUpdated);
        }
    });

    const EditVoucher = (form: VouchersForm) => editVoucher({ variables: form });

    //Delete Voucher
    const [deleteVoucher] = useMutation(DELETE_VOUCHER, {
        onCompleted: () => {
            props.callback();
            modalTrigger.next(false);
            setIsVoucherDeleted(!isVoucherDeleted);
        }
    });

    const DeleteVoucher = (id: string | number) => deleteVoucher({ variables: { id: id } });

    //Toggle Status
    const [toggleVoucherStatus] = useMutation(TOGGLE_STATUS, {
        onCompleted: () => {
            props.callback();
            modalTrigger.next(false);
            setIsVoucherStatusUpdated(!isVoucherStatusUpdated);
        }
    });

    const ToggleVoucherStatus = (id: string, Status: string) => {
        toggleVoucherStatus({
            variables: {
                id: id,
                data: {
                    Status: Status === 'Active' ? 'Disabled' : 'Active'
                }
            }
        });
    };

    const OnSubmit = (form: VouchersForm) => {
        //bind user id
        if (form) {
            form.id = operation.id;
            form.user_permissions_user = auth.userid;
        }

        switch (operation.actionType) {
            case 'create':
                CreateVoucher(form);
                break;
            case 'edit':
                EditVoucher(form);
                break;
        }
    };

    return (
        <div>
            {/* Edit and View Modal */}
            <FinanceModal
                widgets={widgets}
                showErrorList={false}
                formUISchema={schema}
                modalTrigger={modalTrigger}
                formSchema={formSchema}
                name={name}
                formSubmit={(form: VouchersForm) => OnSubmit(form)}
                actionType={operation.actionType}
                formData={operation.actionType === 'create' ? {} : operation.id && formData}
            />

            {/* Status Modal */}
            {showStatusModal && (
                <StatusModal
                    show={showStatusModal}
                    onHide={() => setShowStatusModal(false)}
                    modalTitle="Change Status"
                    modalBody="Do you want to change status ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => ToggleVoucherStatus(operation.id, operation.current_status)}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this voucher ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => DeleteVoucher(operation.id)}
                />
            )}
            {isVoucherCreated ? (
                <Toaster
                    handleCallback={() => setIsVoucherCreated(!isVoucherCreated)}
                    type="success"
                    msg="New voucher has been created"
                />
            ) : null}

            {isVoucherUpdated ? (
                <Toaster
                    handleCallback={() => setIsVoucherUpdated(!isVoucherUpdated)}
                    type="success"
                    msg="Voucher has been updated"
                />
            ) : null}

            {isVoucherDeleted ? (
                <Toaster
                    handleCallback={() => setIsVoucherDeleted(!isVoucherDeleted)}
                    type="success"
                    msg="Voucher has been deleted"
                />
            ) : null}

            {isVoucherStatusUpdated ? (
                <Toaster
                    handleCallback={() => setIsVoucherStatusUpdated(!isVoucherStatusUpdated)}
                    type="success"
                    msg="Voucher has status been updated"
                />
            ) : null}
        </div>
    );
}

export default React.forwardRef(VoucherAction);
