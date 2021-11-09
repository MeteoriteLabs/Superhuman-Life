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
export const ADD_LEADS = gql`
     mutation addLead($id: ID, $details: JSON) {
          createWebsiteContactForm(input: { data: { users_permissions_user: $id, details: $details } }) {
               websiteContactForm {
                    id
               }
          }
     }
`;

export const DELETE_LEAD = gql`
     mutation deleteLead($id: ID!) {
          deleteWebsiteContactForm(input: { where: { id: $id } }) {
               websiteContactForm {
                    id
               }
          }
     }
`;
