import React, { useContext, useImperativeHandle, useState } from 'react';
import ModalView from '../../../components/modal/index';
import { ADD_CONTACT, ADD_PAYMENT_SCHEDULE } from './queries';
import { useMutation } from '@apollo/client';
import AuthContext from '../../../context/auth-context';
import { schema, widgets } from './PayeeSchema';
import { Subject } from 'rxjs';
import Toaster from '../../../components/Toaster';
import {
    phoneCustomFormats,
    phoneTransformErrors
} from '../../../components/utils/ValidationPatterns';

interface Operation {
    id: string;
    modal_status: boolean;
    type: 'create';
    current_status: boolean;
}

function CreateEditPayee(props: any, ref: any) {
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const auth = useContext(AuthContext);
    const payeeJson: Record<string, unknown> = require('./Payee.json');
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const modalTrigger = new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            modalTrigger.next(true);
        }
    }));

    const [createContact] = useMutation(ADD_CONTACT);

    const [createPaymentSchedule] = useMutation(ADD_PAYMENT_SCHEDULE);

    function CreateContact(frm: any) {
        createContact({
            variables: {
                data: {
                    firstname: frm.PayeeFirstName,
                    lastname: frm.PayeeLastName,
                    email: frm.Email,
                    phone: frm.Phone_Number,
                    isPayee: true,
                    ownedBy: auth.userid,
                    type: frm.type,
                    organisationDetails: {
                        organisationEmail: frm.organisationEmail,
                        organisationName: frm.organisationName,
                        gst: frm.GSTNumber,
                        state: frm.state,
                        zipcode: frm.zipcode,
                        city: frm.city,
                        country: frm.country,
                        address1: frm.address1,
                        address2: frm.address2
                    },
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
            onCompleted: (data: any) => {
                createPaymentSchedule({
                    variables: {
                        data: {
                            PaymentCatagory: frm.PaymentCategory,
                            Source_User_ID: Number(auth.userid),
                            Destination_Contacts_ID: Number(data.createContact.data.id),
                            Destination_User_ID: null,
                            frequency: frm.FrequencyOfPayment,
                            Payment_Cycle: frm.paymentCycle,
                            Total_Amount: Number(frm.amountToBePaid),
                            Payment_DateTime: frm.paymentDueOn,
                            Reminder_DateTime: frm.setReminder,
                            Effective_Date: frm.effectiveDate,
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
                    }
                });

                modalTrigger.next(false);
                setIsCreated(!isCreated);
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
                name={'Create Payee'}
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
                    msg="Payee has been created successfully"
                />
            )}
        </>
    );
}

export default React.forwardRef(CreateEditPayee);
