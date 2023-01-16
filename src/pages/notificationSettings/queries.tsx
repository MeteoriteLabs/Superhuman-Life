import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_SETTINGS = gql`
  mutation createNotificationSetting($data: NotificationSettingInput!) {
    createNotificationSetting(
      data: $data
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
