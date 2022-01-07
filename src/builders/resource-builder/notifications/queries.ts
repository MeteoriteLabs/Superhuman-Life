import { gql } from "@apollo/client";

export const GET_TRIGGERS = gql`
     query FetchTypesTriggers {
          prerecordedtypes {
               id
               name
          }
          prerecordedtriggers {
               id
               name
          }
     }
`;

export const ADD_MESSAGE = gql`
     mutation msg(
          $title: String
          $description: String
          $minidesc: String
          $prerecordedtype: ID
          $prerecordedtrigger: ID
          $mediaurl: String
          $user_permissions_user: ID
     ) {
          createPrerecordedmessage(
               input: {
                    data: {
                         title: $title
                         description: $description
                         minidescription: $minidesc
                         prerecordedtype: $prerecordedtype
                         prerecordedtrigger: $prerecordedtrigger
                         mediaurl: $mediaurl
                         users_permissions_user: $user_permissions_user
                    }
               }
          ) {
               prerecordedmessage {
                    id
                    createdAt
                    updatedAt
                    title
                    description
                    minidescription
               }
          }
     }
`;

export const UPDATE_MESSAGE = gql`
     mutation updatemsg(
          $title: String
          $description: String
          $minidesc: String
          $prerecordedtype: ID
          $prerecordedtrigger: ID
          $mediaurl: String
          $userpermission: ID
          $messageid: ID!
     ) {
          updatePrerecordedmessage(
               input: {
                    data: {
                         title: $title
                         description: $description
                         minidescription: $minidesc
                         mediaurl: $mediaurl
                         prerecordedtype: $prerecordedtype
                         prerecordedtrigger: $prerecordedtrigger
                         users_permissions_user: $userpermission
                    }
                    where: { id: $messageid }
               }
          ) {
               prerecordedmessage {
                    id
                    title
                    description
                    minidescription
                    mediaurl
               }
          }
     }
`;

export const GET_MESSAGE = gql`
     query getmessage($id: ID!) {
          prerecordedmessage(id: $id) {
               id
               title
               description
               minidescription
               mediaurl
               status
               updatedAt
               prerecordedtrigger {
                    id
                    name
               }
               prerecordedtype {
                    id
                    name
               }
               users_permissions_user {
                    id
               }
          }
     }
`;

export const DELETE_MESSAGE = gql`
     mutation deleteMessage($id: ID!) {
          deletePrerecordedmessage(input: { where: { id: $id } }) {
               prerecordedmessage {
                    id
                    __typename
               }
          }
     }
`;

export const UPDATE_STATUS = gql`
     mutation updatestatus($status: Boolean, $messageid: ID!) {
          updatePrerecordedmessage(input: { data: { status: $status }, where: { id: $messageid } }) {
               prerecordedmessage {
                    id
                    title
                    description
                    minidescription
                    mediaurl
                    status
               }
          }
     }
`;
export const GET_NOTIFICATIONS = gql`
     query FeedSearchQuery($filter: String!, $id: String) {
          prerecordedmessages(
               sort: "updatedAt"
               where: { title_contains: $filter, users_permissions_user: { id: $id } }
          ) {
               id
               title
               minidescription
               prerecordedtrigger {
                    id
                    name
               }
               status
               updatedAt
               users_permissions_user {
                    id
               }
          }
          prerecordedtypes {
               id
               name
          }
          prerecordedtriggers {
               id
               name
          }
     }
`;
