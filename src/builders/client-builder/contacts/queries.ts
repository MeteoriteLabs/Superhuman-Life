import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query ContactsQuery{
    contacts(pagination: { pageSize: 100 }) {
      data {
        id
        attributes {
            firstname
            lastname
            email
            type
            phone
            createdAt
            ownedBy{
              data{
                id
              }
            }
            appDownloadStatus
        }
      }
    }
  }
`;

export const ADD_CONTACT = gql`
     mutation contact($data: ContactInput!) {
          createContact(
               input: {
                    data: $data
               }
          ) {
               data {
                    id
               }
          }
     }
`;

export const UPDATE_CONTACT = gql`
     mutation contact($id: ID!, $data: ContactInput!) {
          updateContact(
               input: {
                    id: $id,
                    data: $data
               }
          ) {
               data {
                    id
               }
          }
     }
`;

export const DELETE_CONTACT = gql`
     mutation deleteContact($id: ID!) {
          deleteContact(
               input: {
                    id: $id
               }
          ) {
               data {
                    id
               }
          }
     }
`;

