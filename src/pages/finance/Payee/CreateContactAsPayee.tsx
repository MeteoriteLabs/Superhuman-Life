import React, { useContext, useImperativeHandle, useState } from 'react';
import ModalView from 'components/modal/index';
import { ADD_PAYMENT_SCHEDULE, UPDATE_CONTACT } from './queries';
import { useMutation } from '@apollo/client';
import AuthContext from 'context/auth-context';
import { schema, widgets } from './PayeeSchema';
import { Subject } from 'rxjs';
import Toaster from 'components/Toaster';
import {
    phoneCustomFormats,
    phoneTransformErrors
} from 'components/utils/ValidationPatterns';

interface Operation {
    id: string;
    modal_status: boolean;
    type: 'create';
    current_status: boolean;
}

function CreateContactAsPayee(props: any, ref: any) {
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const auth = useContext(AuthContext);
    const payeeJson: Record<string, unknown> = require('./ContactPayee.json');
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const modalTrigger = new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            modalTrigger.next(true);
        }
    }));

    const [updateContact] = useMutation(UPDATE_CONTACT);

    const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE);

    function CreateContact(frm: any) {
        frm.searchContact = frm.searchContact ? JSON.parse(frm.searchContact) : null; //existing contact id

        updateContact({
            variables: {
                id: Number(
                    frm.searchContact
                        .map((item: any) => {
                            return item.id;
                        })
                        .toString()
                ),
                data: {
                    isPayee: true,
                    paymentDetails: {
                        upi: frm.UPI_ID ? frm.UPI_ID : null,
                        phoneNumber: frm.upiPhoneNumber ? frm.upiPhoneNumber : null,
                        branch: frm.Branch ? frm.Branch : null,
                        IFSCCode: frm.ifscCode ? frm.ifscCode : null,
                        bankName: frm.BankName ? frm.BankName : null,
                        accountType: frm.accountType ? frm.accountType : null,
                        accountNumber: frm.AccountNumber ? frm.AccountNumber : null
                    }
                }
            },
            onCompleted: () => {
                createPaymentSchedule({
                    variables: {
                        data: {
                            Destination_Contacts_ID: Number(
                                frm.searchContact
                                    .map((item: any) => {
                                        return item.id;
                                    })
                                    .toString()
                            ),
                            Destination_User_ID: null,
                            Effective_Date: frm.effectiveDate,
                            PaymentCatagory: frm.PaymentCategory,
                            Payment_Cycle: frm.paymentCycle,
                            Payment_DateTime: frm.paymentDueOn,
                            Reminder_DateTime: frm.setReminder,
                            Source_User_ID: Number(auth.userid),
                            Total_Amount: Number(frm.amountToBePaid),
                            frequency: frm.FrequencyOfPayment,
                            Total_Amount_Breakdown: {
                                basicPay: frm.basicPay ? frm.basicPay : null,
                                HRA: frm.HRA ? frm.HRA : null,
                                Gratuity: frm.Gratuity ? frm.Gratuity : null,
                                LTA: frm.LTA ? frm.LTA : null,
                                ESI: frm.ESI ? frm.ESI : null,
                                MedicalReimbursement: frm.MedicalReimbursement
                                    ? frm.MedicalReimbursement
                                    : null,
                                ChildCare: frm.ChildCare ? frm.ChildCare : null,
                                SpecialAllowance: frm.SpecialAllowance
                                    ? frm.SpecialAllowance
                                    : null,
                                ProfessionalTax: frm.ProfessionalTax ? frm.ProfessionalTax : null,
                                TDS: frm.TDS ? frm.TDS : null,
                                ProvidentFund: frm.ProvidentFund ? frm.ProvidentFund : null
                            }
                        }
                    },
                    onCompleted: () => {
                        props.refetchContacts();
                        props.refetchChangemakersPaymentSchedules();
                        modalTrigger.next(false);
                        setIsCreated(!isCreated);
                    }
                });
            }
        });
    }

    const onSubmit = (frm: any) => {
        CreateContact(frm);
    };

    return (
        <>
            {/* Payee create modal */}
            <ModalView
                name={'Create Contact as Payee'}
                isStepper={true}
                showErrorList={false}
                formUISchema={schema}
                formSchema={payeeJson}
                formSubmit={(frm: any) => {
                    onSubmit(frm);
                }}
                formData={
                    operation.type === 'create'
                        ? {
                              PaymentMode: 'UPI',
                              FrequencyOfPayment: 0,
                              provideBreakdown: 'No',
                              type: 'Client',
                              PaymentCategory: 'Vendor'
                          }
                        : {}
                }
                stepperValues={['Payee Basic Details', 'Payment Settings', 'Payment Mode']}
                widgets={widgets}
                modalTrigger={modalTrigger}
                customFormats={phoneCustomFormats}
                transformErrors={phoneTransformErrors}
            />

            {/* success toaster notification */}
            {isCreated && (
                <Toaster
                    handleCallback={() => setIsCreated(!isCreated)}
                    type="success"
                    msg="Existing contact has been added as Payee successfully"
                />
            )}
        </>
    );
}

export default React.forwardRef(CreateContactAsPayee);
