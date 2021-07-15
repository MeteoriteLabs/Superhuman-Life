import { gql } from "@apollo/client";

export const GET_TRIGGERS = gql`
    query FetchTypesTriggers {
        informationbankmessagestypes {
            id
            type
          }
      }
    `;

export const ADD_MESSAGE = gql`
            mutation msg(
                $title: String
                $tags: String
                $minidesc: String
                $description: String
                $infomessagetype: ID
                $mediaurl: String
                $user_permissions_user: ID
            ) {
                createInformationbankmessage(
                input: {
                    data: {
                    title: $title
                    tags: $tags
                    informationbankmessagestype: $infomessagetype
                    description: $description
                    minidescription: $minidesc
                    mediaurl: $mediaurl
                    users_permissions_user: $user_permissions_user
                
                    }
                }
                ) {
                    informationbankmessage {
                    id
                    createdAt
                    updatedAt
                    title
                    tags
                    minidescription
                }
                }
            }
      
    `
    export const UPDATE_MESSAGE = gql`
        mutation updatemsg(
            $title: String
            $description: String
            $minidesc: String
            $informationbankmessagestype: ID
            $tags: String
            $mediaurl: String
            $userpermission: ID
            $messageid: ID!
        ) {
            updateInformationbankmessage(
            input: {
                data: {
                title: $title
                description: $description
                minidescription: $minidesc
                mediaurl: $mediaurl
                tags: $tags
                informationbankmessagestype: $informationbankmessagestype
                users_permissions_user: $userpermission
                }
                where: { id: $messageid }
            }
            ) {
            informationbankmessage {
                id
                title
                tags
                description
                minidescription
                mediaurl
            }
            }
        }
      
    `

export const GET_MESSAGES = gql`
    query FeedSearchQuery($filter: String!,$id: String){
        informationbankmessages(sort: "updatedAt",where: { title_contains: $filter, users_permissions_user: { id: $id}}) {
          id
          title
          description
          updatedAt
          status
          users_permissions_user{
            id
        }
          informationbankmessagestype {
            id
            type
          }
        }
        informationbankmessagestypes {
          id
          type
        }
      }
      
    `
    export const DELETE_MESSAGE = gql`
    mutation deleteMessage($id: ID!) {
        deleteInformationbankmessage(
            input: {
                where: { id : $id }
            }
        ) {
            informationbankmessage {
                id
                __typename
            }
        }
    }
`;
 
export const UPDATE_STATUS = gql`
mutation updatestatus(
    $status: Boolean
    $messageid: ID!
) {
    updateInformationbankmessage(
        input: {
            data: {
            status: $status
            }
            where: { id: $messageid }
        }
    ) {
        informationbankmessage {
            id
            title
            description
            minidescription
            mediaurl
            status
        }
    }
}
`
export const GET_MESSAGE = gql`
    query getmessage($id: ID!) {
        informationbankmessages(id: $id) {
            id
          title
          description
          updatedAt
          status
          users_permissions_user{
            id
        }
          informationbankmessagestype {
            id
            type
          }
        }
    } 

`;

