import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_SETTINGS = gql`
  mutation createNotificationSetting($data: NotificationSettingInput!) {
    createNotificationSetting(data: $data) {
      data {
        id
        attributes {
          isUsersEmail
          isUsersPlatform
        }
      }
    }
  }
`;

export const GET_NOTIFICATION_SETTINGS = gql`
  query notificationSettings($id: ID) {
    notificationSettings(
      filters: { users_permissions_user: { id: { eq: $id } } }
    ) {
      data {
        id
        attributes {
          isUsersEmail
          isUsersPlatform
        }
      }
    }
  }
`;
