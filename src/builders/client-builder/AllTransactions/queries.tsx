import { gql } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
    query ContactsQuery($senderId: String, $receiverId: String, $receiverType: String) {
        transactions(
            pagination: { pageSize: 1000 }
            sort: ["TransactionDateTime:desc"]
            filters: {
                SenderID: { eq: $senderId }
                ReceiverID: { eq: $receiverId }
                ReceiverType: { eq: $receiverType }
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
                }
            }
        }
    }
`

export const GET_PAYMENT_SCHEDULE = gql`
    query PaymentScheduleQuery {
        paymentSchedules(pagination: { pageSize: 1000 }) {
            data {
                id
                attributes {
                    PaymentCatagory
                }
            }
        }
    }
`
