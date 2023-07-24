import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_TRANSACTION, FETCH_CHANGEMAKER } from './queries';
import { flattenObj } from 'components/utils/responseFlatten';

function Receipt(): JSX.Element {
    const printReciept = () => {
        window.print();
    };
    const [receiptData, setReceiptData] = useState<any>([]);
    const [userProfile, setUserProfile] = useState<any>([]);

    const getIDFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    };
    const transactionId = getIDFromURL();

    useQuery(GET_TRANSACTION, {
        variables: { id: transactionId },
        onCompleted: (data) => {
            const flattenReceiptData = flattenObj({ ...data.transaction });
            setReceiptData(flattenReceiptData);
            fetchChangeMakerQuery({
                variables: { id: flattenReceiptData.SenderID }
            });
        }
    });

    const [fetchChangeMakerQuery] = useLazyQuery(FETCH_CHANGEMAKER, {
        onCompleted: (data) => {
            const flattenUserProfileData = flattenObj({ ...data.usersPermissionsUser });
            setUserProfile(flattenUserProfileData);
        }
    });
    const timestamp = receiptData.TransactionDateTime;
    const dateObj = new Date(timestamp);
    const DateofPayment = dateObj.toLocaleDateString('en-US');

    return (
        <div>
            <h4 className="text-center">Payment Details</h4>
            <div className="d-flex justify-content-between flex-wrap">
                <div>
                    <p style={{ textTransform: 'capitalize' }}>
                        <b>Name of Recipient</b> :{' '}
                        {userProfile.First_Name + ' ' + userProfile.Last_Name}
                    </p>
                    <p>
                        <b>Phone Number</b> : {userProfile.Phone_Number}
                    </p>
                    <p>
                        <b>Email</b> : {userProfile.email}
                    </p>
                    <p>
                        <b>Entity</b> : N/A
                    </p>
                </div>
                <div>
                    <p>
                        <b>Date of Payment</b> : {DateofPayment}
                    </p>
                </div>
            </div>

            <Table striped bordered responsive>
                <thead>
                    <tr>
                        <th>Payment Cycle</th>
                        <th>Payment Frequency</th>
                        <th>Type of Payment</th>
                        <th>Department</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>{receiptData.PaymentMode}</td>
                        <td>N/A</td>
                        <td>{receiptData.Currency + ' ' + receiptData.TransactionAmount}</td>
                    </tr>
                </tbody>
            </Table>

            <hr />
            <div className="flex">
                <p className="float-left">
                    <b>Net Amount</b>
                </p>
                <p className="float-right">
                    <b>{receiptData.Currency + ' ' + receiptData.TransactionAmount}</b>
                </p>
            </div>
            <div className="text-center mt-5">
                <Button variant="dark" onClick={printReciept}>
                    Print
                </Button>
            </div>
        </div>
    );
}

export default Receipt;
