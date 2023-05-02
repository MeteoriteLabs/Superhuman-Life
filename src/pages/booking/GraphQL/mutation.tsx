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
  mutation updateClientBookingQuery(
    $id: ID!
    $booking_status: ENUM_CLIENTBOOKING_BOOKING_STATUS
    $BookingID: String
  ) {
    updateClientBooking(id: $id, data: { booking_status: $booking_status, BookingID: $BookingID }) {
      data {
        id
        attributes{
          booking_date
          package_duration
          effective_date
          booking_status
          ClientUser{
            data{
              id
            }
          }
          fitnesspackages{
            data{
              id
            }
          }
        }
      }
    }
  }
`;


export const CREATE_TAG = gql`
  mutation createTag($name: String!, $fitnessPackageID: ID!) {
    createTag(data: { tag_name: $name, fitnesspackage: $fitnessPackageID }) {
      data {
        id
      }
    }
  }
`;

export const CREATE_USER_PACKAGE = gql`
  mutation createUserPackage(
    $data: ClientPackageInput!
  ) {
    createClientPackage(
      data: $data
    ) {
      data {
        id
        attributes{
          users_permissions_user{
            data{
              id
              attributes{
                username
              }
            }
          }
          fitnesspackages{
            data{
              id
              attributes{
                packagename
                fitness_package_type{
                  data{
                    id
                    attributes{
                      type
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation updateTag(
    $id: ID!
    $data: TagInput!
  ) {
    updateTag(id: $id, data: $data) {
      data {
        id
        attributes{
         tag_name
        }
      }
    }
  }
`;
