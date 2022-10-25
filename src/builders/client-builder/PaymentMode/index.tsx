import { useState, useRef } from 'react';
import Form from "@rjsf/core";
import { schema } from "./paymentModeSchema";
import { GET_CONTACTS, UPDATE_CONTACT } from "../contacts/queries";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { Col } from 'react-bootstrap';
import Toaster from '../../../components/Toaster';

function PaymentMode() {
    let [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const formRef = useRef<any>(null);
    const paymentModeJson: { [name: string]: any } = require("./paymentmode.json");
    const [paymentModeDetails, setPaymentModeDetails] = useState<any>({});
    const query = window.location.search;
    const params = new URLSearchParams(query);
    const id = params.get('id');

    useQuery(GET_CONTACTS, { onCompleted: (e: any) => { let flattenData = flattenObj(e.contacts); FillDetails(flattenData) } });
    const [updateContact] = useMutation(UPDATE_CONTACT, { onCompleted: (e: any) => { setIsFormSubmitted(!isFormSubmitted) }, refetchQueries: [GET_CONTACTS] });

    function EditPaymentModeDetails(frm: any) {

        updateContact({
            variables: {
                id: Number(id),
                data: {
                    paymentDetails: {
                        upi: frm.UPI_ID,
                        phoneNumber: frm.upiPhoneNumber,
                        branch: frm.Branch,
                        IFSCCode: frm.ifscCode,
                        bankName: frm.BankName,
                        accountType: frm.accountType,
                        accountNumber: frm.AccountNumber
                    }
                }
            }
        });
    }

    function OnSubmit(frm: any) {
        EditPaymentModeDetails(frm.formData);
    }

    //fillDetails
    function FillDetails(data: any) {

        const paymentDetailToUpdate = data && data.length && data.find((currentValue) => currentValue.id === id);

        if (data) {
            setPaymentModeDetails({
                UPI_ID: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.upi ,
                upiPhoneNumber: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.phoneNumber,
                Branch: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.upi,
                ifscCode: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.IFSCCode,
                BankName: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.bankName,
                accountType: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.accountType,
                AccountNumber: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.accountNumber,
                bankAccount: paymentDetailToUpdate.paymentDetails && paymentDetailToUpdate.paymentDetails.accountNumber ? true : false
            });
        }
    }

    return (
        <>
            {/* Payment mode details Form */}
            <Col >
                <Form
                    uiSchema={schema}
                    schema={paymentModeJson}
                    ref={formRef}
                    onSubmit={(frm: any) => { OnSubmit(frm) }}
                    formData={paymentModeDetails}
                    showErrorList={false}
                />
            </Col>

            {/* success toaster notification */}
            {isFormSubmitted ?
                <Toaster type="success" handleCallback={() => setIsFormSubmitted(!isFormSubmitted)} msg="Payment details has been added successfully" />
                : null}

        </>
    )
}

export default PaymentMode;
