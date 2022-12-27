import { gql } from "@apollo/client";

export const CREATE_VOUCHER = gql`
  mutation createVoucher($data: VoucherInput!) {
    createVoucher(data: $data) {
      data {
        id
        attributes {
          voucher_name
          discount_percentage
          expiry_date
          Start_date
          Usage_restriction
        }
      }
    }
  }
`;

export const EDIT_VOUCHER = gql`
  mutation updateVoucher(
    $id: ID!
    $voucher_name: String
    $discount_percentage: Float
    $expiry_date: DateTime
    $Start_date: DateTime
    $Usage_restriction: Int
    $users_permissions_user: ID
  ) {
    updateVoucher(
      id: $id
      data: {
        voucher_name: $voucher_name
        discount_percentage: $discount_percentage
        expiry_date: $expiry_date
        Start_date: $Start_date
        Usage_restriction: $Usage_restriction
        users_permissions_user: $users_permissions_user
      }
    ) {
      data {
        id
        attributes {
          voucher_name
          discount_percentage
          expiry_date
          Start_date
          Usage_restriction
        }
      }
    }
  }
`;

export const DELETE_VOUCHER = gql`
  mutation deleteVoucher($id: ID!) {
    deleteVoucher(id: $id) {
      data {
        id
      }
    }
  }
`;

export const TOGGLE_STATUS = gql`
  mutation updateVoucher($id: ID!, $data: VoucherInput!) {
    updateVoucher(id: $id, data: $data) {
      data {
        id
        attributes {
          voucher_name
          Status
        }
      }
    }
  }
`;

export const CREATE_FITNESS_PRICING_ASSIT = gql`
  mutation createSuggestedPricing($data: SuggestedPricingInput!) {
    createSuggestedPricing(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_FITNESS_PRICING_ASSITS = gql`
  mutation updateSuggestedPricing($id: ID!, $mrp: Float) {
    updateSuggestedPricing(id: $id, data: { mrp: $mrp }) {
      data {
        id
        attributes {
          mrp
        }
      }
    }
  }
`;

export const CREATE_UPI = gql`
  mutation createUpiDetailsChangemaker(
    $Full_Name: String
    $phone_number: String
    $UPI_ID: String
    $users_permissions_user: ID
    $publishedAt: DateTime
    $Is_Primary: Boolean
  ) {
    createUpiDetailsChangemaker(
      data: {
        Full_Name: $Full_Name
        phone_number: $phone_number
        UPI_ID: $UPI_ID
        users_permissions_user: $users_permissions_user
        publishedAt: $publishedAt
        Is_Primary: $Is_Primary
      }
    ) {
      data {
        id
        attributes {
          Full_Name
          phone_number
          UPI_ID
          Is_Primary
          
        }
      }
    }
  }
`;

export const CREATE_BANK_DETAIL = gql`
  mutation createBankDetail(
    $Full_Name: String
    $Account_Number: String
    $Bank_Name: String
    $IFSC_Code: String
    $PAN_Number: String
    $GST_Number: String
    $Company_Name: String
    $Company_Address: String
    $users_permissions_user: ID
    $publishedAt: DateTime
  ) {
    createBankDetail(
      data: {
        Full_Name: $Full_Name
        Account_Number: $Account_Number
        Bank_Name: $Bank_Name
        IFSC_Code: $IFSC_Code
        PAN_Number: $PAN_Number
        GST_Number: $GST_Number
        Company_Name: $Company_Name
        Company_Address: $Company_Address
        users_permissions_user: $users_permissions_user
        publishedAt: $publishedAt
      }
    ) {
      data {
        id
        attributes {
          Full_Name
          Account_Number
          Bank_Name
          IFSC_Code
          PAN_Number
          GST_Number
          Company_Name
          Company_Address
          Is_Primary
        }
      }
    }
  }
`;
