import { gql } from '@apollo/client'

export const GET_UPI_DETAILS = gql`
    query UPIQuery($id: ID) {
        upiDetailsChangemakers(
            pagination: { pageSize: 100 }
            filters: { users_permissions_user: { id: { eq: $id } } }
        ) {
            data {
                id
                attributes {
                    Is_Primary
                    Full_Name
                    UPI_ID
                    createdAt
                    updatedAt
                    phone_number
                }
            }
        }
    }
`

export const GET_BANK_DETAILS = gql`
    query bankDetailsQuery($id: ID) {
        bankDetails(
            pagination: { pageSize: 100 }
            filters: { users_permissions_user: { id: { eq: $id } } }
        ) {
            data {
                id
                attributes {
                    Full_Name
                    GST_Number
                    Bank_Name
                    PAN_Number
                    updatedAt
                    Account_Number
                    IFSC_Code
                    Company_Name
                    Company_Address
                    Is_Primary
                }
            }
        }
    }
`

export const GET_BANK_DETAILS_IS_PRIMARY = gql`
    query bankDetailsQuery($id: ID) {
        bankDetails(
            pagination: { pageSize: 100 }
            filters: { users_permissions_user: { id: { eq: $id } }, Is_Primary: { eq: true } }
        ) {
            data {
                id
                attributes {
                    Full_Name
                    GST_Number
                    Bank_Name
                    PAN_Number
                    updatedAt
                    Account_Number
                    IFSC_Code
                    Company_Name
                    Company_Address
                    Is_Primary
                }
            }
        }
    }
`

export const GET_UPI_DETAILS_IS_PRIMARY = gql`
    query UPIQuery($id: ID) {
        upiDetailsChangemakers(
            pagination: { pageSize: 100 }
            filters: { users_permissions_user: { id: { eq: $id } }, Is_Primary: { eq: true } }
        ) {
            data {
                id
                attributes {
                    Is_Primary
                    Full_Name
                    UPI_ID
                    createdAt
                    updatedAt
                    phone_number
                }
            }
        }
    }
`

export const GET_BANK_DETAIL = gql`
    query bankDetailsQuery($id: ID) {
        bankDetail(id: $id) {
            data {
                id
                attributes {
                    Full_Name
                    GST_Number
                    Bank_Name
                    PAN_Number
                    updatedAt
                    Account_Number
                    IFSC_Code
                    Company_Name
                    Company_Address
                    Is_Primary
                }
            }
        }
    }
`

export const GET_UPI_DETAIL = gql`
    query upiDetailQuery($id: ID) {
        upiDetailsChangemaker(id: $id) {
            data {
                id
                attributes {
                    Is_Primary
                    Full_Name
                    UPI_ID
                    createdAt
                    updatedAt
                    phone_number
                }
            }
        }
    }
`

export const DELETE_UPI = gql`
    mutation deleteUpiDetailsChangemaker($id: ID!) {
        deleteUpiDetailsChangemaker(id: $id) {
            data {
                id
                attributes {
                    Is_Primary
                    Full_Name
                    UPI_ID
                    createdAt
                    updatedAt
                    phone_number
                }
            }
        }
    }
`

export const DELETE_BANK_DETAILS = gql`
    mutation deleteBankDetails($id: ID!) {
        deleteBankDetail(id: $id) {
            data {
                id
                attributes {
                    Full_Name
                    GST_Number
                    Bank_Name
                    PAN_Number
                    updatedAt
                    Account_Number
                    IFSC_Code
                    Company_Name
                    Company_Address
                    Is_Primary
                }
            }
        }
    }
`

export const UPDATE_UPI = gql`
    mutation updateUpiDetailsChangemaker($id: ID!, $data: UpiDetailsChangemakerInput!) {
        updateUpiDetailsChangemaker(id: $id, data: $data) {
            data {
                id
                attributes {
                    Is_Primary
                }
            }
        }
    }
`

export const CREATE_BANK_DETAIL = gql`
    mutation createBankDetail($data: BankDetailInput!) {
        createBankDetail(data: $data) {
            data {
                id
                attributes {
                    Is_Primary
                }
            }
        }
    }
`

export const UPDATE_BANK_DETAILS = gql`
    mutation updateBankDetail($id: ID!, $data: BankDetailInput!) {
        updateBankDetail(id: $id, data: $data) {
            data {
                id
                attributes {
                    Full_Name
                    GST_Number
                    Bank_Name
                    PAN_Number
                    updatedAt
                    Account_Number
                    IFSC_Code
                    Company_Name
                    Company_Address
                    Is_Primary
                }
            }
        }
    }
`
