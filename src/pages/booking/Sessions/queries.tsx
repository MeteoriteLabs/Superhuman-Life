import { gql } from '@apollo/client';

export const GET_TAGS = gql`
    query getTags(
        $id: ID
        $today: Date
        $dayAfterTomorrow: Date
        $tag_name: String
        $start_time: String
        $end_time: String
    ) {
        tags(
            filters: {
                tag_name: { eq: $tag_name }
                sessions: {
                    changemaker: { id: { eq: $id } }
                    session_date: { gte: $today, lte: $dayAfterTomorrow }
                    start_time: { gte: $start_time }
                    end_time: { lte: $end_time }
                }
            }
        ) {
            data {
                id
                attributes {
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                start_time
                                end_time
                                session_date
                                tag
                                mode
                                activity {
                                    data {
                                        id
                                        attributes {
                                            title
                                        }
                                    }
                                }
                                workout {
                                    data {
                                        id
                                        attributes {
                                            workouttitle
                                        }
                                    }
                                }
                                sessions_bookings {
                                    data {
                                        id
                                        attributes {
                                            Session_booking_status
                                            session {
                                                data {
                                                    id
                                                    attributes {
                                                        session_date
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSIONS = gql`
    query getSessions(
        $filter: String!
        $id: ID
        $session_date: Date
        $start_time_filter: String
        $end_time_filter: String
    ) {
        sessions(
            filters: {
                tag: { containsi: $filter }
                changemaker: { id: { eq: $id } }
                Is_restday: { eq: false }
                session_date: { eq: $session_date }
                start_time: { containsi: $start_time_filter }
                end_time: { containsi: $end_time_filter }
            }
            sort: ["start_time"]
        ) {
            data {
                id
                attributes {
                    type
                    start_time
                    end_time
                    mode
                    tag
                    session_date
                    activity {
                        data {
                            id
                            attributes {
                                title
                            }
                        }
                    }
                    workout {
                        data {
                            id
                            attributes {
                                workouttitle
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSION_BOOKINGS = gql`
    query getSessionBookings($id: ID) {
        sessionsBookings(filters: { session: { id: { eq: $id } } }, pagination: { pageSize: 100 }) {
            data {
                id
                attributes {
                    createdAt
                    session {
                        data {
                            id
                            attributes {
                                start_time
                                session_date
                                end_time
                                tag
                            }
                        }
                    }
                    session_date
                    session_time
                    Session_booking_status
                    client {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSION_BOOKINGS_FOR_CLIENTS = gql`
    query getSessionBookings(
        $id: ID
        $session_starts_date_filter: Date
        $session_ends_date_filter: Date
        $loginUserId: ID
        $status: [String]
    ) {
        sessionsBookings(
            pagination: { pageSize: 500 }
            filters: {
                Session_booking_status: { in: $status }
                session: {
                    session_date: {
                        gte: $session_starts_date_filter
                        lte: $session_ends_date_filter
                    }
                    changemaker: { id: { eq: $loginUserId } }
                }
                client: { id: { eq: $id } }
            }
        ) {
            data {
                id
                attributes {
                    createdAt
                    session {
                        data {
                            id
                            attributes {
                                type
                                activity {
                                    data {
                                        id
                                        attributes {
                                            title
                                        }
                                    }
                                }
                                workout {
                                    data {
                                        id
                                        attributes {
                                            workouttitle
                                        }
                                    }
                                }
                                start_time
                                end_time
                                session_date
                                tag
                                mode
                            }
                        }
                    }
                    Session_booking_status
                    client {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_CLIENTS = gql`
    query clientPackages($id: ID, $filter: String) {
        clientPackages(
            pagination: { pageSize: 100 }
            filters: {
                users_permissions_user: { username: { containsi: $filter } }
                fitnesspackages: { users_permissions_user: { id: { eq: $id } } }
            }
        ) {
            data {
                id
                attributes {
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                                First_Name
                                Last_Name
                            }
                        }
                    }
                    fitnesspackages {
                        data {
                            id
                            attributes {
                                packagename
                                users_permissions_user {
                                    data {
                                        id
                                        attributes {
                                            username
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_STATUS = gql`
    mutation updateStatus($id: ID!, $data: SessionsBookingInput!) {
        updateSessionsBooking(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_SCHEDULE = gql`
    mutation updateSchedule($id: ID!, $data: SessionInput!) {
        updateSession(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;

export const CREATE_SCHEDULE = gql`
    mutation createSchedule($data: SessionInput!) {
        createSession(data: $data) {
            data {
                id
            }
        }
    }
`;

export const GET_FUTURE_SESSIONS = gql`
    query getSessions($id: ID, $session_date: Date, $tag: String) {
        sessions(
            pagination: { pageSize: 100 }
            filters: {
                changemaker: { id: { eq: $id } }
                Is_restday: { eq: false }
                session_date: { eq: $session_date }
                tag: { eq: $tag }
            }
        ) {
            data {
                id
                attributes {
                    Is_restday
                    mode
                    end_time
                    tag
                    session_date
                    Is_program_template
                    start_time
                    type
                    day_of_program
                    activity_target
                    changemaker {
                        data {
                            id
                        }
                    }
                    sessions_bookings {
                        data {
                            id
                        }
                    }
                    feedback_notes {
                        data {
                            id
                        }
                    }
                    Is_program_template
                    activity {
                        data {
                            id
                            attributes {
                                title
                            }
                        }
                    }
                    workout {
                        data {
                            id
                            attributes {
                                workouttitle
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSION = gql`
    query getSession($id: ID) {
        session(id: $id) {
            data {
                id
                attributes {
                    Is_restday
                    mode
                    end_time
                    tag
                    session_date
                    Is_program_template
                    start_time
                    type
                    day_of_program
                    activity_target
                    workout {
                        data {
                            id
                            attributes {
                                workouttitle
                            }
                        }
                    }
                    activity {
                        data {
                            id
                            attributes {
                                title
                            }
                        }
                    }
                    changemaker {
                        data {
                            id
                        }
                    }
                    sessions_bookings {
                        data {
                            id
                        }
                    }
                    feedback_notes {
                        data {
                            id
                        }
                    }
                    Is_program_template
                }
            }
        }
    }
`;
