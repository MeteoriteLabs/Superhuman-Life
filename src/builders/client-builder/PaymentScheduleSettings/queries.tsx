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
            }
          }
    }
  }
`;