import { gql } from '@apollo/client';

export const GET_ALL_SUGGESTED_PRICING = gql`
    query suggestedPricings($id: ID!) {
        suggestedPricings(filters: { users_permissions_users: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    updatedAt
                    Mode
                    mrp
                    fitness_package_type {
                        data {
                            id
                            attributes {
                                type
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_VOUCHERS = gql`
    query vouchers($id: ID, $start: Int, $limit: Int) {
        vouchers(
            pagination: { start: $start, limit: $limit }
            filters: { users_permissions_user: { id: { eq: $id } } }
            sort: ["updatedAt:desc"]
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
                    voucher_name
                    discount_percentage
                    expiry_date
                    Start_date
                    Usage_restriction
                    Status
                    flat_discount
                }
            }
        }
    }
`;

export const GET_VOUCHERS_BY_ID = gql`
    query vouchers($id: ID!) {
        vouchers(filters: { id: { eq: $id } }) {
            data {
                attributes {
                    voucher_name
                    discount_percentage
                    expiry_date
                    Start_date
                    Usage_restriction
                    Status
                    flat_discount
                }
            }
        }
    }
`;

export const GET_ALL_BOOKINGS_FINANCE = gql`
    query clientBookings($id: ID!) {
        clientBookings(filters: { ClientUser: { id: { eq: $id } } }) {
            data {
                attributes {
                    ClientUser {
                        data {
                            attributes {
                                username
                                Phone_Number
                                addresses {
                                    data {
                                        attributes {
                                            address1
                                            city
                                            state
                                            country
                                            zipcode
                                        }
                                    }
                                }
                            }
                        }
                    }
                    package_duration
                    effective_date
                    Booking_status
                    booking_date
                    package_duration
                    fitnesspackages {
                        data {
                            attributes {
                                packagename
                                mode
                                fitness_package_type {
                                    data {
                                        attributes {
                                            type
                                        }
                                    }
                                }
                                fitnesspackagepricing
                                users_permissions_user {
                                    data {
                                        attributes {
                                            Phone_Number
                                            First_Name
                                            Last_Name
                                            email
                                        }
                                    }
                                }
                                ptoffline
                                ptonline
                                grouponline
                                groupoffline
                                recordedclasses
                            }
                        }
                    }
                }
            }
        }
    }
`;
