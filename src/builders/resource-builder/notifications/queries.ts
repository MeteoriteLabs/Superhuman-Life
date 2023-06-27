import { gql } from '@apollo/client';

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
        prerecordedtriggers {
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
        $title: String
        $description: String
        $minidesc: String
        $prerecordedtype: ID
        $prerecordedtrigger: ID
        $mediaurl: String
        $user_permissions_user: ID
    ) {
        createNotification(
            data: {
                title: $title
                description: $description
                minidescription: $minidesc
                prerecordedtype: $prerecordedtype
                prerecordedtrigger: $prerecordedtrigger
                mediaurl: $mediaurl
                users_permissions_user: $user_permissions_user
            }
        ) {
            data {
                id
                attributes {
                    title
                }
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
        updateNotification(
            id: $messageid
            data: {
                title: $title
                description: $description
                minidescription: $minidesc
                mediaurl: $mediaurl
                prerecordedtype: $prerecordedtype
                prerecordedtrigger: $prerecordedtrigger
                users_permissions_user: $userpermission
            }
        ) {
            data {
                id
            }
        }
    }
`;

export const GET_MESSAGE = gql`
    query getmessage($id: ID!, $start: Int, $limit: Int) {
        notifications(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: { id: { eq: $id } }
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
                    title
                    description
                    minidescription
                    mediaurl
                    status
                    updatedAt
                    prerecordedtype {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    prerecordedtrigger {
                        data {
                            id
                            attributes {
                                name
                            }
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

export const DELETE_MESSAGE = gql`
    mutation deleteMessage($id: ID!) {
        deleteNotification(id: $id) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_STATUS = gql`
    mutation updatestatus($status: Boolean, $messageid: ID!) {
        updateNotification(data: { status: $status }, id: $messageid) {
            data {
                id
            }
        }
    }
`;
export const GET_NOTIFICATIONS = gql`
    query FeedSearchQuery($filter: String!, $id: ID, $start: Int, $limit: Int) {
        notifications(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: { title: { containsi: $filter }, users_permissions_user: { id: { eq: $id } } }
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
                    title
                    minidescription
                    prerecordedtrigger {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    status
                    updatedAt
                    users_permissions_user {
                        data {
                            id
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
        prerecordedtriggers {
            data {
                id
                attributes {
                    name
                }
            }
        }
    }
`;
