import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query Clients($id: ID) {
    clientPackages(filters: { users_permissions_user: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          accepted_date
          PackageMRP
        }
      }
    }
  }
`;
