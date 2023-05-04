import { gql } from '@apollo/client';

export const CREATE_CLIENT = gql`
  mutation createClient($data: UsersPermissionsUserInput!) {
    createUsersPermissionsUser(data: $data){
        data{
          id
          attributes{
            First_Name
            Last_Name
            Phone_Number
            email
          }
        }
      }
  }
`;

export const CREATE_CLIENT_BOOKING = gql`
  mutation createClientBooking($data: ClientBookingInput!) {
    createClientBooking(data: $data){
        data{
          id
        }
      }
  }
`;
