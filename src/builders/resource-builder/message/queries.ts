import { gql } from "@apollo/client";

export const GET_TRIGGERS = gql`
  query FetchTypesTriggers {
    prerecordedtypes {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query FeedSearchQuery($filter: String!, $id: ID!) {
    prerecordedMessages(
      pagination: { pageSize: 100 }
      sort: ["updatedAt"]
      filters: {
        Title: { containsi: $filter }
        users_permissions_user: { id: { eq: $id } }
      }
    ) {
      data {
        id
        attributes {
          Title
          Description
          tags
          Status
          Image_URL
          uploadID
          updatedAt
          minidescription
          users_permissions_user {
            data {
              id
            }
          }
          resourcetype {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
    prerecordedtypes {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation msg(
    $data: PrerecordedMessageInput!
  ) {
    createPrerecordedMessage(
      data: $data
    ) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation updatemsg(
    $title: String
    $description: String
    $minidesc: String
    $mindsetmessagetype: ID
    $tags: String
    $mediaurl: String
    $userpermission: ID
    $messageid: ID!
    $upload: String
  ) {
    updatePrerecordedMessage(
      id: $messageid
      data: {
        Title: $title
        Description: $description
        minidescription: $minidesc
        Image_URL: $mediaurl
        tags: $tags
        resourcetype: $mindsetmessagetype
        users_permissions_user: $userpermission
        uploadID: $upload
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($id: ID!) {
    deletePrerecordedMessage(id: $id) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_STATUS = gql`
  mutation updatestatus($status: Boolean, $messageid: ID!) {
    updatePrerecordedMessage(id: $messageid, data: { Status: $status }) {
      data {
        id
      }
    }
  }
`;

export const GET_MESSAGE = gql`
  query getmessage($id: ID!) {
    prerecordedMessage(id: $id) {
      data {
        id
        attributes {
          Title
          Description
          minidescription
          tags
          Status
          Image_URL
          uploadID
          updatedAt
          users_permissions_user {
            data {
              id
            }
          }
          resourcetype {
            data {
              id
            }
          }
          users_permissions_user {
            data {
              id
            }
          }
        }
      }
    }
  }
`;
