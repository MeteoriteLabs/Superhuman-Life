import { gql } from '@apollo/client';

export const GET_CHANGEMAKER_NOTIFICATION = gql`
  query changemakerNotifications($id: ID, $start: Int) {
    changemakerNotifications(
      pagination: { limit: 5, start: $start }
      filters: { users_permissions_user: { id: { eq: $id } } }
    ) {
      data {
        id
        attributes {
          DateTime
          Title
          Body
          OnClickRoute
          ContactID
          type
          IsRead
        }
      }
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation updateChangemakerNotification($id: ID!, $IsRead: Boolean) {
    updateChangemakerNotification(id: $id, data: { IsRead: $IsRead }) {
      data {
        id
        attributes {
          IsRead
        }
      }
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation updateChangemakerNotification($id: ID!) {
    deleteChangemakerNotification(id: $id) {
      data {
        id
      }
    }
  }
`;
