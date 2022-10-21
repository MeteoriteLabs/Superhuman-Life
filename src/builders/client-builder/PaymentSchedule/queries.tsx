import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query ContactsQuery{
    contacts(pagination: { pageSize: 100 }) {
      data {
        id
        attributes {
          firstname
          lastname
          email
          type
          phone
          createdAt
          ownedBy{
            data{
              id
            }
          }
          appDownloadStatus
          paymentDetails
          organisationDetails
          isPayee
        }
      }
    }
  }
`;

export const GET_PAYMENT_SCHEDULES = gql`
  query PaymentSchedulesQuery($Destination_Contacts_ID: Int, $Source_User_ID: Int){
    paymentSchedules(pagination: { pageSize: 100 },filters: {
      Source_User_ID: { eq: $Source_User_ID },
      Destination_Contacts_ID: { eq: $Destination_Contacts_ID }
    }) {
      data {
        id
        attributes {
          createdAt
          Payment_Cycle
          PaymentCatagory
          Payment_DateTime
          frequency
          Reminder_DateTime
          Total_Amount 
          isActive
        }
      }
    }
  }
`;

export const GET_PAYMENT_SCHEDULE = gql`
  query PaymentScheduleQuery($id: ID){
    paymentSchedule(id: $id) {
      data{
        id
        attributes{
          Payment_Cycle
          PaymentCatagory
          Payment_DateTime
          Reminder_DateTime
          frequency
          Total_Amount
          Total_Amount_Breakdown
          Destination_Contacts_ID
          Destination_User_ID
          Source_User_ID
          isActive
        }
      }
    }
  }
`;

export const ADD_PAYMENT_SCHEDULE = gql`
  mutation createPaymentSchedule($data: PaymentScheduleInput!) {
    createPaymentSchedule( data: $data ) {
      data {
        id
      }
    }
  }
`;

export const FETCH_CONTACT_DETAILS = gql`
  query contactDetail($id: ID!) {
    contact(id: $id) {
        data{
            id
            attributes{
              firstname
              lastname
              appDownloadStatus
              organisationDetails
              phone
              email
              isPayee
            }
          }
    }
  }
`;

export const DELETE_PAYMENT_SCHEDULE = gql`
  mutation deletePaymentSchedule($id: ID!) {
    deletePaymentSchedule(id: $id) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_PAYMENT_SCHEDULE = gql`
  mutation updatePaymentSchedule($id: ID!, $data: PaymentScheduleInput!) {
    updatePaymentSchedule(id: $id, data: $data ) {
      data {
        id
      }
    }
  }
`;
