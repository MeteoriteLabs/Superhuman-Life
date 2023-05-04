import { gql } from "@apollo/client";

export const GET_BOOKINGS = gql`
  query Sessions($id: ID, $startDateTime: DateTime, $endDateTime: DateTime) {
    clientBookings(
      filters: {
        Booking_status: { eq: "accepted" }
        ClientUser: { id: { eq: $id } }
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
