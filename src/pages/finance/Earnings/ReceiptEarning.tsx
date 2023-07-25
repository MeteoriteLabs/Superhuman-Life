import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useLazyQuery, useQuery } from '@apollo/client';
import { GET_TRANSACTION, FETCH_CHANGEMAKER, FETH_CLIENTPACKAGES } from '../Outflow/queries';
import { flattenObj } from 'components/utils/responseFlatten';

function Receipt(): JSX.Element {
    const printReciept = () => {
        window.print();
    };
    const [receiptData, setReceiptData] = useState<any>([]);
    const [userProfile, setUserProfile] = useState<any>([]);
    const [clientPackages, setClientPackages] = useState<any>([]);
    const [fitnessPackages, setFitnessPackages] = useState<any>([]);
    const [fitnessPackagesType, setFitnessPackagesType] = useState<any>([]);
    const [quota, setQuota] = useState<any>({
        Type: '',
        Online: '',
        Offline: '',
        Recorded: ''
    });

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
            fethclientPackages({
                variables: { id: transactionId }
            });
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
    const [fethclientPackages] = useLazyQuery(FETH_CLIENTPACKAGES, {
        onCompleted: (data) => {
            const flattenClientPackages = flattenObj({ ...data.clientPackage });
            setClientPackages(flattenClientPackages);
            setFitnessPackages(flattenClientPackages.fitnesspackages[0]);
            setFitnessPackagesType(
                flattenClientPackages.fitnesspackages[0].fitness_package_type.type
            );

            const packageType = flattenClientPackages.fitnesspackages[0].fitness_package_type.type;

            if (packageType === 'Classic Class') {
                setQuota({
                    Type: 'Classic Class',
                    Online: null,
                    Offline: null,
                    Recorded: flattenClientPackages.fitnesspackages[0].recordedclasses
                });
            } else if (packageType === 'Live Stream Channel') {
                setQuota({
                    Type: 'Live Stream Channel',
                    Online: null,
                    Offline: null,
                    Recorded: null
                });
            } else if (packageType === 'One-On-One') {
                setQuota({
                    Type: 'One-On-One',
                    Online: flattenClientPackages.fitnesspackages[0].ptonline,
                    Offline: flattenClientPackages.fitnesspackages[0].ptoffline,
                    Recorded: null
                });
            } else if (packageType === 'On-Demand PT') {
                setQuota({
                    Type: 'On-Demand PT',
                    Online: null,
                    Offline: null,
                    Recorded: null
                });
            } else if (packageType === 'Group Class') {
                setQuota({
                    Type: 'Group Class',
                    Online: flattenClientPackages.fitnesspackages[0].grouponline,
                    Offline: flattenClientPackages.fitnesspackages[0].groupoffline,
                    Recorded: null
                });
            } else if (packageType === 'Event') {
                setQuota({
                    Type: 'Event',
                    Online: null,
                    Offline: null,
                    Recorded: null
                });
            } else if (packageType === 'Custom Fitness') {
                setQuota({
                    Type: 'Custom Fitness',
                    Online: null,
                    Offline: null,
                    Recorded: null
                });
            } else if (packageType === 'Cohort') {
                setQuota({
                    Type: 'Cohort',
                    Online: null,
                    Offline: null,
                    Recorded: null
                });
            }
        }
    });

    const timestamp = receiptData.TransactionDateTime;
    const dateObj = new Date(timestamp);
    const DateofPayment = dateObj.toLocaleDateString('en-US');

    return (
        <div>
            <div className="text-right mt-2 mb-1">
                <Button variant="dark" onClick={printReciept}>
                    Print
                </Button>
            </div>
            <div className="shadow">
                <div
                    className="ml-1"
                    style={{
                        backgroundColor: 'ButtonFace',
                        height: '50px',
                        fontSize: '30px',
                        fontWeight: '700',
                        borderBottom: '1px solid black'
                    }}
                >
                    Receipt
                </div>
                <div className="d-flex justify-content-between flex-wrap mt-2">
                    <div className="ml-2">
                        <p style={{ textTransform: 'capitalize' }}>
                            <b>Name of Recipient</b> :{' '}
                            {userProfile && userProfile.First_Name && userProfile.Last_Name
                                ? userProfile.First_Name + ' ' + userProfile.Last_Name
                                : null}
                        </p>
                        <p>
                            <b>Phone Number</b> :{' '}
                            {userProfile && userProfile.Phone_Number
                                ? userProfile.Phone_Number
                                : null}
                        </p>
                        <p>
                            <b>Email</b> :{' '}
                            {userProfile && userProfile.email ? userProfile.email : null}
                        </p>
                        <p>
                            <b>Entity</b> : N/A
                        </p>
                    </div>
                    <div className="mr-3">
                        <p>
                            <b>Date of Payment</b> : {DateofPayment}
                        </p>
                        <p style={{ display: 'flex' }}>
                            <b>Status</b> :{' '}
                            <p
                                style={{
                                    width: '100px',
                                    height: '28px',
                                    flexShrink: 0,
                                    borderRadius: '20px',
                                    backgroundColor:
                                        receiptData.TransactionStatus == 'SUCCESS'
                                            ? '#339B31'
                                            : '#dc3545',
                                    marginLeft: '5px',
                                    color: 'white',
                                    textAlign: 'center',
                                    fontWeight: '500'
                                }}
                            >
                                {receiptData.TransactionStatus}
                            </p>
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h5 style={{ fontWeight: '700' }}>Payment Details</h5>

                <Table striped bordered responsive className="text-center">
                    <thead>
                        <tr>
                            <th>Service name</th>
                            <th>Duration</th>
                            <th>Session Type</th>

                            {quota.Online !== null &&
                            quota.Online !== 0 &&
                            quota.Offline !== null &&
                            quota.Offline !== 0 ? (
                                <>
                                    <th>No of Online Session</th>
                                    <th>No of Offline Session</th>
                                </>
                            ) : quota.Online !== null && quota.Online !== 0 ? (
                                <th>No of Online Session</th>
                            ) : quota.Offline !== null && quota.Offline !== 0 ? (
                                <th>No of Offline Session</th>
                            ) : quota.Recorded !== null && quota.Recorded !== 0 ? (
                                <th>No of Recorded Session</th>
                            ) : (
                                <th>No of Session</th>
                            )}

                            <th>Type of payment</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <td>
                                {fitnessPackages && fitnessPackages.packagename
                                    ? fitnessPackages.packagename
                                    : null}
                            </td>

                            <td>
                                {clientPackages && clientPackages.package_duration
                                    ? clientPackages.package_duration
                                    : null}
                            </td>
                            <td>{fitnessPackagesType}</td>

                            {quota.Online !== null &&
                            quota.Online !== 0 &&
                            quota.Offline !== null &&
                            quota.Offline !== 0 ? (
                                <>
                                    <td>{quota.Online}</td>
                                    <td>{quota.Offline}</td>
                                </>
                            ) : quota.Online !== null && quota.Online !== 0 ? (
                                <td>{quota.Online}</td>
                            ) : quota.Offline !== null && quota.Offline !== 0 ? (
                                <td>{quota.Offline}</td>
                            ) : quota.Recorded !== null && quota.Recorded !== 0 ? (
                                <td>{quota.Recorded}</td>
                            ) : (
                                <td>No Session Data</td>
                            )}

                            <td>
                                {receiptData && receiptData.PaymentMode
                                    ? receiptData.PaymentMode
                                    : null}
                            </td>

                            <td>
                                {receiptData &&
                                receiptData.Currency &&
                                receiptData.TransactionAmount
                                    ? receiptData.Currency + ' ' + receiptData.TransactionAmount
                                    : null}
                            </td>
                        </tr>
                    </thead>

                    <tbody className="flex">
                        <tr>
                            <td>
                                <b>Net Amount</b>
                            </td>
                            {quota.Online !== null &&
                            quota.Online !== 0 &&
                            quota.Offline !== null &&
                            quota.Offline !== 0 ? (
                                <>
                                    <td></td>
                                    <td></td>
                                </>
                            ) : quota.Online !== null && quota.Online !== 0 ? (
                                <td></td>
                            ) : quota.Offline !== null && quota.Offline !== 0 ? (
                                <td></td>
                            ) : quota.Recorded !== null && quota.Recorded !== 0 ? (
                                <td></td>
                            ) : (
                                <td></td>
                            )}
                            <td></td>
                            <td></td>
                            <td></td>

                            <td>
                                <b>
                                    {receiptData &&
                                    receiptData.Currency &&
                                    receiptData.TransactionAmount
                                        ? receiptData.Currency + ' ' + receiptData.TransactionAmount
                                        : null}
                                </b>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <hr />
            </div>
        </div>
    );
}

export default Receipt;
