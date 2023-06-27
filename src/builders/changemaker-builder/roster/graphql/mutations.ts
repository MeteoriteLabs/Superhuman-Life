import { gql } from '@apollo/client';

export const UPDATE_SESSION_TIME = gql`
    mutation updateSessionTime($id: ID!, $start_time: String!, $end_time: String!) {
        updateSession(id: $id, data: { start_time: $start_time, end_time: $end_time }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_SESSION_MODE = gql`
    mutation updateSessionMode($id: ID!, $mode: String!) {
        updateSession(id: $id, data: { mode: $mode }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_SESSION_BOOKING_STATUS = gql`
    mutation updateSessionBookingStatus(
        $id: ID!
        $status: ENUM_SESSIONSBOOKING_SESSION_BOOKING_STATUS
    ) {
        updateSessionsBooking(id: $id, data: { Session_booking_status: $status }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_SESSION_DATE = gql`
    mutation updateSessionDate($id: ID!, $date: Date!) {
        updateSession(id: $id, data: { session_date: $date }) {
            data {
                id
            }
        }
    }
`;
