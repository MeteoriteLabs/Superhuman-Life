import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query Clients($id: ID, $startDateTime: DateTime, $endDateTime: DateTime) {
    clientPackages(
      filters: {
        users_permissions_user: { id: { eq: $id } }
        createdAt: { gte: $startDateTime, lte: $endDateTime }
      }
    ) {
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
