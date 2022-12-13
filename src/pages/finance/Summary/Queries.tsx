import { gql } from "@apollo/client";

export const GET_EARNINGS_TRANSACTIONS = gql`
  query TransactionsQuery($receiverId: String, $transactionStatus: String,
    $transactionStartTime: DateTime,
    $transactionEndTime: DateTime) {
    transactions(
      pagination: { pageSize: 2000 }
      filters: { 
        ReceiverID: { eq: $receiverId } 
        ReceiverType: { eq: $receiverType }
        TransactionStatus: { eq: $transactionStatus }
        TransactionDateTime: {
          gte: $transactionStartTime
          lte: $transactionEndTime
        }
      }
    ) {
      data {
        id
        attributes {
          Currency
          TransactionStatus
          TransactionRemarks
          TransactionRefrenceID
          ReceiverID
          PaymentMode
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

export const GET_EXPENSES_TRANSACTIONS = gql`
  query TransactionsQuery($senderId: String) {
    transactions(
      pagination: { pageSize: 2000 }
      filters: { SenderID: { eq: $senderId } }
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

export const GET_EARNINGS_TRANSACTIONS_GRAPH = gql`
  query TransactionsQuery(
    $receiverId: String
    $transactionStartTime: DateTime
    $transactionEndTime: DateTime
  ) {
    transactions(
      pagination: { pageSize: 2000 }
      filters: {
        ReceiverType: {eq: "Changemaker"}
        ReceiverID: { eq: $receiverId }
        TransactionStatus: { eq: "Success" }
        TransactionDateTime: {
          gte: $transactionStartTime
          lte: $transactionEndTime
        }
      }
    ) {
      data {
        id
        attributes {
          ChangemakerAmount
          TransactionDateTime
          TransactionAmount
          ReceiverID
        }
      }
    }
  }
`;

export const GET_EXPENSES_TRANSACTIONS_GRAPH = gql`
  query TransactionsQuery(
    $senderId: String
    $transactionStartTime: DateTime
    $transactionEndTime: DateTime
  ) {
    transactions(
      pagination: { pageSize: 2000 }
      filters: {
        SenderID: { eq: $senderId }
        TransactionStatus: { eq: "Success" }
        ReceiverType: {eq: "Changemaker"}
        TransactionDateTime: {
          gte: $transactionStartTime
          lte: $transactionEndTime
        }
      }
    ) {
      data {
        id
        attributes {
          TransactionDateTime
          TransactionAmount
          SenderID
        }
      }
    }
  }
`;

export const GET_USERS_JOINED_DATE = gql`
  query userPermissionUser($id: ID) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          createdAt
        }
      }
    }
  }
`;
