import { gql } from "@apollo/client";

export const GET_LEADS = gql`
  query Forms($id: ID) {
    websiteContactForms(
      filters: { users_permissions_user: { id: { eq: $id } } }
    ) {
      data {
        id
        attributes {
          createdAt
        }
      }
    }
  }
`;
