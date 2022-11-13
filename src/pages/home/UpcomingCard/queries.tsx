import { gql } from "@apollo/client";

export const GET_LEADS = gql`
  query getLeads($id: ID) {
    websiteContactForms(
      filters: {
        isSeen: { eq: false }
        users_permissions_user: { id: { eq: $id } }
      }
    ) {
      data {
        id
        attributes {
          isSeen
          Details
          updatedAt
          users_permissions_user {
            data {
              id
            }
          }
          createdAt
        }
      }
    }
  }
`;

export const GET_SESSIONS = gql`
  query getSessions($id: ID) {
    sessions(
      filters: { changemaker: { id: { eq: $id } }, Is_restday: { eq: false } }
    ) {
      data {
        id
        attributes {
          type
          start_time
          activity {
            data {
              id
              attributes {
                title
              }
            }
          }
          workout {
            data {
              id
              attributes {
                workouttitle
              }
            }
          }
        }
      }
    }
  }
`;
