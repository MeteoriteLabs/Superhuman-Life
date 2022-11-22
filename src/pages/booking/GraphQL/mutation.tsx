import { gql } from "@apollo/client";

export const UPDATE_BOOKING_CONFIG = gql`
  mutation updateBookingConfig(
    $id: ID!
    $isAuto: Boolean
    $bookingsPerDay: Int
    $BookingsPerMonth: Int
  ) {
    updateBookingConfig(
      id: $id
      data: {
        isAuto: $isAuto
        bookingsPerDay: $bookingsPerDay
        BookingsPerMonth: $BookingsPerMonth
      }
    ) {
      data {
        id
        attributes {
          isAuto
          bookingsPerDay
          BookingsPerMonth
        }
      }
    }
  }
`;

export const UPDATE_BOOKING_STATUS = gql`
  mutation updateClientBooking(
    $id: ID!
    $booking_status: ENUM_CLIENTBOOKING_BOOKING_STATUS
  ) {
    updateClientBooking(id: $id, data: { booking_status: $booking_status }) {
      data {
        id
      }
    }
  }
`;

export const CREATE_USER_PACKAGE = gql`
  mutation createUserPackage(
    $users_permissions_user: ID
    $fitnesspackages: [ID]
    $accepted_date: DateTime!
    $package_duration: Int!
    $effective_date: DateTime!
    $program_managers: [ID]
  ) {
    createClientPackage(
      data: {
        users_permissions_user: $users_permissions_user
        fitnesspackages: $fitnesspackages
        accepted_date: $accepted_date
        package_duration: $package_duration
        effective_date: $effective_date
        program_managers: $program_managers
      }
    ) {
      data {
        id
      }
    }
  }
`;
