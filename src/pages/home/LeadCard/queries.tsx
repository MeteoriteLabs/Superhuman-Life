import { gql } from "@apollo/client";

export const GET_LEADS = gql`
  query getLeads($id: ID) {
    websiteContactForms(
      filters: {
        isSeen: { eq: false }
        users_permissions_user: { id: { eq: $id } }
      }
    ) {
      data {
        id
        attributes {
          isSeen
          Details
          updatedAt
          users_permissions_user {
            data {
              id
            }
          }
          createdAt
        }
      }
    }
  }
`;
