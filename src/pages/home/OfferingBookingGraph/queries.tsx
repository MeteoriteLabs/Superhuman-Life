import { gql } from "@apollo/client";

export const GET_BOOKINGS = gql`
  query Sessions($id: ID) {
    clientBookings(
      filters: {
        booking_status: { eq: "accepted" }
        users_permissions_users: { id: { eq: $id } }
      }
    ) {
      data {
        id
        attributes {
          booking_date
        }
      }
    }
  }
`;
