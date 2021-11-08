import { gql } from "@apollo/client";

export const GET_LEADS = gql`
     query Forms($id: ID) {
          websiteContactForms(where: { users_permissions_user: { id: $id } }) {
               id
               users_permissions_user {
                    id
                    username
                    email
                    Phone
               }
               details
               isSeen
               createdAt
               updatedAt
          }
     }
`;
