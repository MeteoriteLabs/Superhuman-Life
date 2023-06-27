import { gql } from '@apollo/client';

export const GET_CONTACTS = gql`
    query ContactsQuery($id: ID) {
        contacts(
            pagination: { pageSize: 100 }
            filters: { ownedBy: { id: { eq: $id } }, isPayee: { eq: true } }
        ) {
            data {
                id
                attributes {
                    firstname
                    lastname
                    email
                    type
                    phone
                    createdAt
                    ownedBy {
                        data {
                            id
                        }
                    }
                    appDownloadStatus
                    paymentDetails
                    organisationDetails
                    isPayee
                }
            }
        }
    }
`;

export const GET_CONTACT = gql`
    query ContactQuery($id: ID) {
        contact(id: $id) {
            data {
                id
                attributes {
                    firstname
                    lastname
                    email
                    type
                    phone
                    createdAt
                    ownedBy {
                        data {
                            id
                        }
                    }
                    appDownloadStatus
                    paymentDetails
                    organisationDetails
                    isPayee
                }
            }
        }
    }
`;

export const GET_PAYMENT_SCHEDULES = gql`
    query PaymentSchedulesQuery($Destination_Contacts_ID: [Int], $Source_User_ID: Int) {
        paymentSchedules(
            pagination: { pageSize: 100 }
            filters: {
                Destination_Contacts_ID: { in: $Destination_Contacts_ID }
                Source_User_ID: { eq: $Source_User_ID }
                isActive: { eq: true }
            }
        ) {
            data {
                id
                attributes {
                    Payment_Cycle
                    PaymentCatagory
                    Payment_DateTime
                    Reminder_DateTime
                    frequency
                    Total_Amount
                    Total_Amount_Breakdown
                    Destination_Contacts_ID
                    Destination_User_ID
                    Source_User_ID
                    isActive
                }
            }
        }
    }
`;

export const ADD_CONTACT = gql`
    mutation contact($data: ContactInput!) {
        createContact(data: $data) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_CONTACT = gql`
    mutation updateContact($id: ID!, $data: ContactInput!) {
        updateContact(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;

export const DELETE_CONTACT = gql`
    mutation deleteContact($id: ID!) {
        deleteContact(id: $id) {
            data {
                id
            }
        }
    }
`;

export const ADD_PAYMENT_SCHEDULE = gql`
    mutation createPaymentSchedule($data: PaymentScheduleInput!) {
        createPaymentSchedule(data: $data) {
            data {
                id
            }
        }
    }
`;

export const FETCH_CONTACT_DETAILS = gql`
    query contactDetail($id: ID!) {
        contact(id: $id) {
            data {
                id
                attributes {
                    firstname
                    lastname
                    appDownloadStatus
                    organisationDetails
                    phone
                    email
                    isPayee
                }
            }
        }
    }
`;

export const FETCH_CHANGEMAKERS = gql`
    query fetchUsersProfileData {
        usersPermissionsUsers(pagination: { pageSize: 100 }) {
            data {
                id
                attributes {
                    username
                    First_Name
                    Last_Name
                    email
                    Phone_Number
                    Photo_ID
                    About_User
                    Website_URL
                    about_mini_description
                    designations {
                        data {
                            id
                            attributes {
                                Designation_title
                                description
                            }
                        }
                    }
                    instagram_url
                    Facebook_URL
                    Youtube_URL
                    LinkedIn_URL
                    Clubhouse_URL
                    Twitter_URL
                    Verification_ID
                    Photo_profile_banner_ID
                    educational_details(pagination: { pageSize: 100 }) {
                        data {
                            id
                            attributes {
                                Institute_Name
                                Type_of_degree
                                Specialization
                                Year
                            }
                        }
                    }
                    addresses(pagination: { pageSize: 100 }) {
                        data {
                            id
                            attributes {
                                city
                                address1
                                address2
                                type
                                zipcode
                                country
                                state
                                Title
                                type_address
                                House_Number
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_PAYMENT_SCHEDULES_FOR_CHANGEMAKER = gql`
    query PaymentSchedulesQuery($id: Int) {
        paymentSchedules(
            pagination: { pageSize: 100 }
            filters: { Source_User_ID: { eq: $id }, Destination_Contacts_ID: { null: true } }
        ) {
            data {
                id
                attributes {
                    Destination_User_ID
                    Source_User_ID
                    Destination_Contacts_ID
                    createdAt
                    Payment_Cycle
                    PaymentCatagory
                    Payment_DateTime
                    frequency
                    Reminder_DateTime
                    Total_Amount
                    isActive
                }
            }
        }
    }
`;
