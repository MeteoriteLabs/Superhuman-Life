import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query TransactionsQuery {
    transactions(pagination: { pageSize: 2000 }, sort: ["TransactionDateTime:desc"]) {
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
