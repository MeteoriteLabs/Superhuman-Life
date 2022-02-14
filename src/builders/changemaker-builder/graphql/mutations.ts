import { gql } from "@apollo/client";

export const CREATE_CHANGEMAKER_HOLIDAY = gql`
  mutation createChangeMakerHoliday(
    $date: Date
    $description: String
    $users_permissions_user: ID!
  ) {
    createChangemakerHoliday(
      data: {
        date: $date
        description: $description
        users_permissions_user: $users_permissions_user
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const DELETE_CHANGEMAKER_HOLIDAY = gql`
  mutation deleteChangeMakerHoliday($id: ID!) {
    deleteChangemakerHoliday(id: $id) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_USER_DATA = gql`
  mutation updateUserData($changemaker_weekly_schedule: JSON, $id: ID!) {
    updateUsersPermissionsUser(
      id: $id
      data: { Changemaker_weekly_schedule: $changemaker_weekly_schedule }
    ) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_USER_BOOKING_TIME = gql`
  mutation updateUserBookingTime($id: ID!, $booking_Online_time: Int, $booking_Offline_time: Int) {
    updateUsersPermissionsUser(
      id: $id
      data:{ booking_lead_time_online_mins: $booking_Online_time, booking_lead_time_offline_mins: $booking_Offline_time}
    ){
      data{
        id
      }
    }
  }
`
