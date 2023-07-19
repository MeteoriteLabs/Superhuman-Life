import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
    query TransactionsQuery($senderId: String, $start: Int, $limit: Int) {
        transactions(
            pagination: { start: $start, limit: $limit }
            filters: { SenderID: { eq: $senderId } }
            sort: ["TransactionDateTime:desc"]
        ) {
            meta {
                pagination {
                    pageCount
                    total
                }
            }
            data {
                id
                attributes {
                    Currency
                    TransactionStatus
                    TransactionRemarks
                    TransactionRefrenceID
                    ReceiverID
                    ReceiverType
                    ChangemakerAmount
                    SenderID
                    SenderType
                    SapienAmount
                    SapienGSTAmount
                    SapienGSTPercentage
                    createdAt
                    TransactionDateTime
                    TransactionStatus
                    TransactionAmount
                    PaymentScheduleID
                    TransactionRemarks
                    PaymentMode
                }
            }
        }
    }
`;
export const GET_TRANSACTION = gql`
    query TransactionQuery($id: ID) {
        transaction(
            id: $id 
            ) {
            data {
                id
                attributes {
                    Currency
                    TransactionStatus
                    TransactionRemarks
                    TransactionRefrenceID
                    ReceiverID
                    ReceiverType
                    ChangemakerAmount
                    SenderID
                    SenderType
                    SapienAmount
                    SapienGSTAmount
                    SapienGSTPercentage
                    createdAt
                    TransactionDateTime
                    TransactionStatus
                    TransactionAmount
                    PaymentScheduleID
                    TransactionRemarks
                    PaymentMode
                }
            }
        }
    }
`;

export const FETCH_CHANGEMAKERS = gql`
    query fetchUsersProfileData {
        usersPermissionsUsers(pagination: { pageSize: 1000 }) {
            data {
                id
                attributes {
                    First_Name
                    Last_Name
                }
            }
        }
    }
`;
export const FETCH_CHANGEMAKER = gql`
    query fetchUsersProfileData($id: ID) {
        usersPermissionsUser(
            id: $id 
        ) {
            data {
                id
                attributes {
                    First_Name
                    Last_Name
                    Phone_Number
                    DOB
                    email
                }
            }
        }
    }
`;

export const GET_CONTACTS = gql`
    query ContactsQuery($id: ID) {
        contacts(
            pagination: { pageSize: 1000 }
            filters: { ownedBy: { id: { eq: $id } }, isPayee: { eq: true } }
        ) {
            data {
                id
                attributes {
                    firstname
                    lastname
                    email
                    type
                    phone
                    createdAt
                }
            }
        }
    }
`;