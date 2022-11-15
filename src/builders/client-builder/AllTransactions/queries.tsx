import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query ContactsQuery($senderId: String, $recieverId: String) {
    transactions(
      pagination: { pageSize: 100 }
      filters: { SenderID: { eq: $senderId }, ReceiverID: { eq: $recieverId } }
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
        }
      }
    }
  }
`;

export const FETCH_CHANGEMAKERS = gql`
  query fetchUsersProfileData {
    usersPermissionsUsers(pagination: { pageSize: 100 }) {
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
      pagination: { pageSize: 100 }
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

export const GET_PAYMENT_SCHEDULE = gql`
  query PaymentScheduleQuery{
    paymentSchedules(pagination: { pageSize: 100 }) {
      data {
        id
        attributes {
          Reminder_DateTime
          frequency
          PaymentCatagory
        }
      }
    }
  }
`;
