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

export const GET_LEADS_NEW = gql`
query Forms($id: ID) {
  websiteContactForms(filters: {
    users_permissions_user: {
      id: {
        eq: $id
      }
    }
  }){
    data{
      id
      attributes{
        Details
        isSeen
        createdAt
        updatedAt
        users_permissions_user{
          data{
            id
            attributes{
              username
              email
              Phone_Number
            }
          }
        }
      }
    }
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

export const ADD_LEADS_NEW = gql`
mutation addLead($id: ID, $details: JSON){ 
	createWebsiteContactForm(data: {
    users_permissions_user: $id,
    Details: $details
  }){
    data{
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

export const DELETE_LEAD_NEW = gql`
mutation deleteLead($id: ID!){ 
	deleteWebsiteContactForm(id: $id){
    data{
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

export const GET_LEADS_ID_NEW = gql`
query leadbyid($id: ID){
     websiteContactForms(filters: {
       id: {
         eq: $id
       }
     }){
       data{
         id
         attributes{
           Details
           isSeen
           createdAt
           updatedAt
           users_permissions_user{
             data{
               id
               attributes{
                 username
                 email
                 Phone_Number
               }
             }
           }
         }
       }
     }
   }
`

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

export const UPDATE_LEADS_NEW = gql`
mutation updateleads($id: ID, $details: JSON, $messageid: ID!){
     updateWebsiteContactForm(id: $messageid, data: {
       users_permissions_user: $id,
       Details: $details
     }){
       data{
         id
       }
     }
   }
`

export const UPDATE_SEEN = gql`
     mutation updateleads($seen: Boolean, $messageid: ID!) {
          updateWebsiteContactForm(input: { data: { isSeen: $seen }, where: { id: $messageid } }) {
               websiteContactForm {
                    id
               }
          }
     }
`;

export const UPDATE_SEEN_NEW = gql`
mutation updateleads($seen: Boolean, $id: ID!) {
     updateWebsiteContactForm(id: $id, data: {
       isSeen: $seen,
     }){
       data{
         id
       }
     }
   }
`