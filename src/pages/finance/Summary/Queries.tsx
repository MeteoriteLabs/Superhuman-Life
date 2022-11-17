import { gql } from "@apollo/client";

export const GET_EARNINGS_TRANSACTIONS = gql`
  query TransactionsQuery($receiverId: String) {
    transactions(
      pagination: { pageSize: 2000 }
      filters: { ReceiverID: { eq: $receiverId } }
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
