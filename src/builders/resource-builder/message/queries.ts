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

export const GET_MESSAGES = gql`
    query FeedSearchQuery($filter: String!, $id: ID!, $start: Int, $limit: Int) {
        prerecordedMessages(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: { Title: { containsi: $filter }, users_permissions_user: { id: { eq: $id } } }
        ) {
            meta {
                pagination {
                    pageCount
                    total
                }
            }
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
`

export const ADD_MESSAGE = gql`
    mutation msg($data: PrerecordedMessageInput!) {
        createPrerecordedMessage(data: $data) {
            data {
                id
            }
        }
    }
`

export const UPDATE_MESSAGE = gql`
    mutation updatemsg($id: ID!, $data: PrerecordedMessageInput!) {
        updatePrerecordedMessage(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`

export const DELETE_MESSAGE = gql`
    mutation deleteMessage($id: ID!) {
        deletePrerecordedMessage(id: $id) {
            data {
                id
            }
        }
    }
`

export const UPDATE_STATUS = gql`
    mutation updatestatus($status: Boolean, $messageid: ID!) {
        updatePrerecordedMessage(id: $messageid, data: { Status: $status }) {
            data {
                id
            }
        }
    }
`

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
`
