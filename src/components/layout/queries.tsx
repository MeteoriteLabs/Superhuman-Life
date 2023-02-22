import { gql } from "@apollo/client";

export const GET_CHANGEMAKER_NOTIFICATION = gql`
  query changemakerNotifications($id: ID) {
    changemakerNotifications(
      filters: { IsRead: {eq: false} , users_permissions_user: { id: { eq: $id } } }
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
