import { gql } from "@apollo/client";

export const GET_BOOKINGS = gql`
  query Sessions($id: ID, $startDateTime: DateTime, $endDateTime: DateTime) {
    clientBookings(
      filters: {
        booking_status: { eq: "accepted" }
        users_permissions_users: { id: { eq: $id } }
        booking_date: { gte: $startDateTime, lte: $endDateTime }
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
