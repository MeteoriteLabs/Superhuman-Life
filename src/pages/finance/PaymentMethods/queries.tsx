import { gql } from "@apollo/client";

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
`;

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
`;
