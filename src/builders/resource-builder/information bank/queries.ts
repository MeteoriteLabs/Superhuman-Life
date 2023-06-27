import { gql } from '@apollo/client'

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
`

export const ADD_MESSAGE = gql`
    mutation msg(
        $title: String
        $tags: String
        $minidesc: String
        $description: String
        $infomessagetype: ID
        $mediaurl: String
        $user_permissions_user: ID
        $upload: String
    ) {
        createInformationbankmessage(
            data: {
                title: $title
                tags: $tags
                resourcetype: $infomessagetype
                description: $description
                minidescription: $minidesc
                mediaurl: $mediaurl
                users_permissions_user: $user_permissions_user
                uploadID: $upload
            }
        ) {
            data {
                id
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
        $upload: String
    ) {
        updateInformationbankmessage(
            id: $messageid
            data: {
                title: $title
                description: $description
                minidescription: $minidesc
                mediaurl: $mediaurl
                tags: $tags
                informationbankmessagestype: $informationbankmessagestype
                users_permissions_user: $userpermission
                uploadID: $upload
            }
        ) {
            data {
                id
            }
        }
    }
`

export const GET_MESSAGES = gql`
    query FeedSearchQuery($filter: String!, $id: ID!) {
        informationbankmessages(
            sort: ["updatedAt:desc"]
            filters: { title: { containsi: $filter }, users_permissions_user: { id: { eq: $id } } }
        ) {
            data {
                id
                attributes {
                    tags
                    title
                    description
                    updatedAt
                    status
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
`
export const DELETE_MESSAGE = gql`
    mutation deleteMessage($id: ID!) {
        deleteInformationbankmessage(id: $id) {
            data {
                id
            }
        }
    }
`

export const UPDATE_STATUS = gql`
    mutation updatestatus($status: Boolean, $messageid: ID!) {
        updateInformationbankmessage(id: $messageid, data: { status: $status }) {
            data {
                id
            }
        }
    }
`
export const GET_MESSAGE = gql`
    query getmessage($id: ID!) {
        informationbankmessages(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    title
                    description
                    tags
                    minidescription
                    updatedAt
                    status
                    uploadID
                    mediaurl
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
    }
`
