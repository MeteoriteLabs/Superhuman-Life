import { gql } from "@apollo/client";

export const GET_TRIGGERS = gql`
    query FetchTypesTriggers {
        mindsetmessagetypes{
            id
            type
          }
      }
    `;

 export const GET_MESSAGES = gql`
 query FeedSearchQuery($filter: String!,$id: String){   
     mindsetmessages(sort: "updatedAt",where: { title_contains: $filter, users_permissions_user: { id: $id}}){
         id
         title
         description
         minidescription
         tags
         updatedAt
         users_permissions_user{
             id
         }
         mindsetmessagetype{
             id
             type
         }
     }
     mindsetmessagetypes{
         id
         type
       }
   }
   
 `  

 export const ADD_MESSAGE = gql`
            mutation msg(
                $title: String
                $tags: String
                $minidesc: String
                $mindsetmessagetype: ID
                $mediaurl: String
                $user_permissions_user: ID
            ) {
                createMindsetmessage(
                input: {
                    data: {
                    title: $title
                    tags: $tags
                    mindsetmessagetype: $mindsetmessagetype
                    description: $minidesc
                    mediaurl: $mediaurl
                    users_permissions_user: $user_permissions_user
                
                    }
                }
                ) {
                    mindsetmessage {
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
            $mindsetmessagetype: ID
            $tags: String
            $mediaurl: String
            $userpermission: ID
            $messageid: ID!
        ) {
            updateMindsetmessage(
            input: {
                data: {
                title: $title
                description: $description
                minidescription: $minidesc
                mediaurl: $mediaurl
                tags: $tags
                mindsetmessagetype: $mindsetmessagetype
                users_permissions_user: $userpermission
                }
                where: { id: $messageid }
            }
            ) {
            mindsetmessage {
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

    export const DELETE_MESSAGE = gql`
    mutation deleteMessage($id: ID!) {
        deleteMindsetmessage(
            input: {
                where: { id : $id }
            }
        ) {
            mindsetmessage {
                id
                __typename
            }
        }
    }
`;
