import { gql } from "@apollo/client";

export const FETCH_CONTACT_DETAILS = gql`
  query contactDetail($id: ID!) {
    contact(id: $id) {
      data {
        id
        attributes {
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

