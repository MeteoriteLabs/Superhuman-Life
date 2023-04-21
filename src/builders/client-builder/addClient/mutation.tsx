import { gql } from "@apollo/client";

export const CREATE_CLIENT = gql`
  mutation createClient(data: UsersPermissionsUserInput!) {
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