import { gql } from '@apollo/client'

export const CREATE_CHANGEMAKER_HOLIDAY = gql`
    mutation createChangeMakerHoliday(
        $date: Date
        $description: String
        $users_permissions_user: ID!
    ) {
        createChangemakerHoliday(
            data: {
                date: $date
                description: $description
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`

export const CREATE_CANGEMAKER_WORK_HOUR = gql`
    mutation createChangeMakerWorkHour(
        $date: Date
        $From_time: Time
        $To_time: Time
        $Mode: ENUM_CHANGEMAKERWORKHOUR_MODE
        $users_permissions_user: ID!
    ) {
        createChangemakerWorkhour(
            data: {
                date: $date
                To_Time: $From_time
                From_time: $To_time
                Mode: $Mode
                is_disabled: false
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`

export const DELETE_CHANGEMAKER_HOLIDAY = gql`
    mutation deleteChangeMakerHoliday($id: ID!) {
        deleteChangemakerHoliday(id: $id) {
            data {
                id
            }
        }
    }
`

export const UPDATE_USER_DATA = gql`
    mutation updateUserData($changemaker_weekly_schedule: JSON, $id: ID!) {
        updateUsersPermissionsUser(
            id: $id
            data: { Changemaker_weekly_schedule: $changemaker_weekly_schedule }
        ) {
            data {
                id
            }
        }
    }
`

export const UPDATE_USER_BOOKING_TIME = gql`
    mutation updateUserBookingTime(
        $id: ID!
        $booking_Online_time: Int
        $booking_Offline_time: Int
    ) {
        updateUsersPermissionsUser(
            id: $id
            data: {
                booking_lead_time_online_mins: $booking_Online_time
                booking_lead_time_offline_mins: $booking_Offline_time
            }
        ) {
            data {
                id
            }
        }
    }
`

export const CREATE_CHANGEMAKER_AVAILABILITY_HOLIDAY = gql`
    mutation createChangeMakerAvailabilityHoliday(
        $date: Date
        $description: String
        $users_permissions_user: ID!
    ) {
        createChangemakerAvailabilty(
            data: {
                date: $date
                holiday_title: $description
                users_permissions_user: $users_permissions_user
                Is_Holiday: true
            }
        ) {
            data {
                id
            }
        }
    }
`

export const DELETE_CHANGEMAKER_AVAILABILITY_HOLIDAY = gql`
    mutation deleteChangeMakerHoliday($id: ID!) {
        deleteChangemakerAvailabilty(id: $id) {
            data {
                id
            }
        }
    }
`

export const CREATE_CHANGEMAKER_AVAILABILITY_WORKHOURS = gql`
    mutation createChangeMakerAvailabilityWorkHours($slots: JSON, $id: ID!, $date: Date) {
        createChangemakerAvailabilty(
            data: { AllSlots: $slots, Is_Holiday: false, users_permissions_user: $id, date: $date }
        ) {
            data {
                id
            }
        }
    }
`

export const UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS = gql`
    mutation updateCHageMakerAvailabilityWorkHour($id: ID!, $slots: JSON) {
        updateChangemakerAvailabilty(id: $id, data: { AllSlots: $slots }) {
            data {
                id
                attributes {
                    date
                }
            }
        }
    }
`

export const UPDATE_CHANGEMAKER_AVAILABILITY_HOLIDAY = gql`
    mutation updateCHageMakerAvailabilityWorkHour($id: ID!, $title: String) {
        updateChangemakerAvailabilty(id: $id, data: { holiday_title: $title, Is_Holiday: true }) {
            data {
                id
            }
        }
    }
`
