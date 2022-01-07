import { gql } from "@apollo/client";

export const GET_LEADS = gql`
     query Forms($id: ID) {
          websiteContactForms(sort: "updatedAt:desc", where: { users_permissions_user: { id: $id } }) {
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

export const GET_LEADS_ID = gql`
     query leadbyid($id: ID) {
          websiteContactForms(where: { id: $id }) {
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

export const UPDATE_LEADS = gql`
     mutation updateleads($id: ID, $details: JSON, $messageid: ID!) {
          updateWebsiteContactForm(
               input: { data: { users_permissions_user: $id, details: $details }, where: { id: $messageid } }
          ) {
               websiteContactForm {
                    id
               }
          }
     }
`;

export const UPDATE_SEEN = gql`
     mutation updateleads($seen: Boolean, $messageid: ID!) {
          updateWebsiteContactForm(input: { data: { isSeen: $seen }, where: { id: $messageid } }) {
               websiteContactForm {
                    id
               }
          }
     }
`;
