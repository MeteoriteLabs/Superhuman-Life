import { gql } from '@apollo/client'

export const GET_EARNINGS_TRANSACTIONS = gql`
    query TransactionsEarningsQuery(
        $receiverId: String
        $transactionStartTime: DateTime
        $transactionEndTime: DateTime
    ) {
        transactions(
            pagination: { pageSize: 2000 }
            filters: {
                ReceiverType: { eq: "Changemaker" }
                ReceiverID: { eq: $receiverId }
                TransactionStatus: { eq: "Success" }
                TransactionDateTime: { gte: $transactionStartTime, lte: $transactionEndTime }
            }
        ) {
            data {
                id
                attributes {
                    ChangemakerAmount
                    TransactionDateTime
                    TransactionAmount
                }
            }
        }
    }
`

export const GET_EXPENSES_TRANSACTIONS = gql`
    query TransactionsExpensesQuery(
        $senderId: String
        $transactionStartTime: DateTime
        $transactionEndTime: DateTime
    ) {
        transactions(
            pagination: { pageSize: 2000 }
            filters: {
                SenderID: { eq: $senderId }
                TransactionStatus: { eq: "Success" }
                SenderType: { eq: "Changemaker" }
                TransactionDateTime: { gte: $transactionStartTime, lte: $transactionEndTime }
            }
        ) {
            data {
                id
                attributes {
                    TransactionDateTime
                    TransactionAmount
                }
            }
        }
    }
`

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
`
