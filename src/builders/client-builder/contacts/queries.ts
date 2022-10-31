import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query ContactsQuery($id: ID){
    contacts(pagination: { pageSize: 100 }, filters:{
      ownedBy:{
        id: {eq: $id}
      }
    } ) {
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

export const GET_CONTACT = gql`
  query ContactQuery($id: ID){
    contact(id: $id)
    {
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
  query PaymentSchedulesQuery{
    paymentSchedules(pagination: { pageSize: 100 }) {
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
        }
      }
    }
  }
`;

export const ADD_CONTACT = gql`
  mutation contact($data: ContactInput!) {
    createContact( data: $data ) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation updateContact($id: ID!, $data: ContactInput!) {
    updateContact(id: $id, data: $data ) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation deleteContact($id: ID!) {
    deleteContact(id: $id) {
      data {
        id
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