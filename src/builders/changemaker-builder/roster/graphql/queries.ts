import { gql } from '@apollo/client';

export const GET_SESSION_AND_SESSION_BOOKINGS = gql`
    query getSessionAndSessionsBookings($id: ID!) {
        sessionsBookings(filters: { session: { id: { eq: $id }, type: { ne: "restday" } } }) {
            data {
                id
                attributes {
                    Session_booking_status
                    client {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                    session {
                        data {
                            id
                            attributes {
                                start_time
                                end_time
                                activity {
                                    data {
                                        id
                                        attributes {
                                            title
                                        }
                                    }
                                }
                                activity_target
                                tag
                                type
                                mode
                                session_date
                                workout {
                                    data {
                                        id
                                        attributes {
                                            workouttitle
                                            About
                                            Benifits
                                            fitnessdisciplines {
                                                data {
                                                    id
                                                    attributes {
                                                        disciplinename
                                                    }
                                                }
                                            }
                                            level
                                            intensity
                                            calories
                                            warmup
                                            mainmovement
                                            cooldown
                                            workout_text
                                            workout_URL
                                            muscle_groups {
                                                data {
                                                    id
                                                    attributes {
                                                        name
                                                    }
                                                }
                                            }
                                            equipment_lists {
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
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSIONS_BASED_ON_DATE = gql`
    query getSessionsBasedOnDate($date: Date!, $id: ID!) {
        sessions(filters: { changemaker: { id: { eq: $id } }, session_date: { eq: $date } }) {
            data {
                id
                attributes {
                    start_time
                }
            }
        }
    }
`;

export const GET_TAG_BASED_ON_SESSION = gql`
    query getTagBasedOnSession($id: ID!, $lowerDate: Date!, $upperDate: Date!, $userid: ID!) {
        tags(filters: { sessions: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    tag_name
                    sessions(
                        filters: {
                            session_date: { between: [$lowerDate, $upperDate] }
                            changemaker: { id: { eq: $userid } }
                        }
                        pagination: { limit: 1000 }
                    ) {
                        data {
                            id
                            attributes {
                                start_time
                                end_time
                                tag
                                type
                                mode
                                session_date
                                Is_restday
                                activity {
                                    data {
                                        id
                                        attributes {
                                            title
                                        }
                                    }
                                }
                                activity_target
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
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                address {
                                    data {
                                        id
                                        attributes {
                                            address1
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

export const UPDATE_ATTENDANCE_DATA = gql`
    mutation updateAttendanceData($id: ID!, $status: ENUM_SESSIONSBOOKING_SESSION_BOOKING_STATUS!) {
        updateSessionsBooking(id: $id, data: { Session_booking_status: $status }) {
            data {
                id
            }
        }
    }
`;

export const GET_PARTICULAR_CLIENT = gql`
    query getParticularClient($id: ID!, $username: String) {
        sessionsBookings(
            filters: {
                Session_booking_status: { in: ["Attended", "Booked", "Absent"] }
                session: { id: { eq: $id } }
                client: { username: { containsi: $username } }
            }
        ) {
            data {
                id
                attributes {
                    session {
                        data {
                            id
                            attributes {
                                session_date
                            }
                        }
                    }
                    Session_booking_status
                    client {
                        data {
                            id
                            attributes {
                                username
                                Gender
                            }
                        }
                    }
                }
            }
        }
    }
`;
