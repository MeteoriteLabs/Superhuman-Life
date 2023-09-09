import { gql } from '@apollo/client';

export const CREATE_PACKAGE = gql`
    mutation createFitnesspackage(
        $Industry: ID
        $Status: Boolean
        $SubscriptionDuration: JSON
        $packagename: String
        $tags: String
        $level: ENUM_FITNESSPACKAGE_LEVEL
        $intensity: ENUM_FITNESSPACKAGE_INTENSITY
        $aboutpackage: String
        $benefits: String
        $mode: ENUM_FITNESSPACKAGE_MODE
        $address: ID
        $disciplines: [ID]
        $languages: [ID]
        $duration: Int
        $ptoffline: Int
        $ptonline: Int
        $grouponline: Int
        $groupoffline: Int
        $recordedclasses: Int
        $restdays: Int
        $bookingleadday: Int
        $bookingleadtime: String
        $groupinstantbooking: Boolean
        $Is_free_demo: Boolean
        $is_private: Boolean
        $fitness_package_type: ID
        $fitnesspackagepricing: JSON
        $ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE
        $classsize: Int
        $users_permissions_user: ID!
        $publishing_date: DateTime
        $expiry_date: DateTime
        $thumbnail: String
        $upload: String
        $equipmentList: [ID]
        $videoUrl: String
        $End_date: DateTime
        $Start_date: DateTime
        $client_address: String
    ) {
        createFitnesspackage(
            data: {
                Industry: $Industry
                Status: $Status
                client_address: $client_address
                SubscriptionDuration: $SubscriptionDuration
                packagename: $packagename
                tags: $tags
                level: $level
                Intensity: $intensity
                aboutpackage: $aboutpackage
                benefits: $benefits
                mode: $mode
                address: $address
                fitnessdisciplines: $disciplines
                duration: $duration
                ptoffline: $ptoffline
                ptonline: $ptonline
                grouponline: $grouponline
                groupoffline: $groupoffline
                recordedclasses: $recordedclasses
                restdays: $restdays
                bookingleadday: $bookingleadday
                is_private: $is_private
                bookingleadtime: $bookingleadtime
                groupinstantbooking: $groupinstantbooking
                Is_free_demo: $Is_free_demo
                fitness_package_type: $fitness_package_type
                fitnesspackagepricing: $fitnesspackagepricing
                Ptclasssize: $ptclasssize
                classsize: $classsize
                users_permissions_user: $users_permissions_user
                publishing_date: $publishing_date
                expiry_date: $expiry_date
                Thumbnail_ID: $thumbnail
                Upload_ID: $upload
                equipment_lists: $equipmentList
                video_URL: $videoUrl
                languages: $languages
                Start_date: $Start_date
                End_date: $End_date
            }
        ) {
            data {
                id
                attributes {
                    packagename
                    groupinstantbooking
                    fitness_package_type {
                        data {
                            id
                            attributes {
                                type
                            }
                        }
                    }
                    classsize
                    duration
                }
            }
        }
    }
`;

export const DELETE_PACKAGE = gql`
    mutation deleteFitnesspackage($id: ID!) {
        deleteFitnesspackage(id: $id) {
            data {
                id
            }
        }
    }
`;

export const DELETE_OFFERING_INVENTORY = gql`
    mutation deleteOfferingInventory($id: ID!) {
        deleteOfferingInventory(id: $id) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_PACKAGE_PRIVATE = gql`
    mutation updateFitnesspackage($id: ID!, $is_private: Boolean) {
        updateFitnesspackage(id: $id, data: { is_private: $is_private }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_OFFERING_INVENTORY = gql`
    mutation updateOfferingInventory($id: ID!, $data: OfferingInventoryInput!) {
        updateOfferingInventory(id: $id, data: $data) {
            data {
                id
                attributes {
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const CREATE_NOTIFICATION = gql`
    mutation createChangemakerNotification($data: ChangemakerNotificationInput!) {
        createChangemakerNotification(data: $data) {
            data {
                id
                attributes {
                    IsRead
                    type
                    Title
                    DateTime
                    Body
                    OnClickRoute
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

export const CREATE_OFFERING_INVENTORY = gql`
    mutation createOfferingInventory($data: OfferingInventoryInput!) {
        createOfferingInventory(data: $data) {
            data {
                id
            }
        }
    }
`;

export const EDIT_PACKAGE = gql`
    mutation fitnesspackages(
        $SubscriptionDuration: JSON
        $id: ID!
        $packagename: String
        $tags: String
        $level: ENUM_FITNESSPACKAGE_LEVEL
        $intensity: ENUM_FITNESSPACKAGE_INTENSITY
        $aboutpackage: String
        $benefits: String
        $mode: ENUM_FITNESSPACKAGE_MODE
        $address: ID
        $disciplines: [ID]
        $languages: [ID]
        $duration: Int
        $ptoffline: Int
        $ptonline: Int
        $grouponline: Int
        $groupoffline: Int
        $recordedclasses: Int
        $restdays: Int
        $bookingleadday: Int
        $bookingleadtime: String
        $groupinstantbooking: Boolean
        $Is_free_demo: Boolean
        $is_private: Boolean
        $fitness_package_type: ID
        $fitnesspackagepricing: JSON
        $ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE
        $classsize: Int
        $users_permissions_user: ID!
        $publishing_date: DateTime
        $expiry_date: DateTime
        $thumbnail: String
        $upload: String
        $equipmentList: [ID]
        $videoUrl: String
        $End_date: DateTime
        $Start_date: DateTime
        $client_address: String
    ) {
        updateFitnesspackage(
            id: $id
            data: {
                client_address: $client_address
                SubscriptionDuration: $SubscriptionDuration
                packagename: $packagename
                tags: $tags
                level: $level
                Intensity: $intensity
                aboutpackage: $aboutpackage
                benefits: $benefits
                mode: $mode
                address: $address
                fitnessdisciplines: $disciplines
                duration: $duration
                ptoffline: $ptoffline
                ptonline: $ptonline
                grouponline: $grouponline
                groupoffline: $groupoffline
                is_private: $is_private
                recordedclasses: $recordedclasses
                restdays: $restdays
                bookingleadday: $bookingleadday
                bookingleadtime: $bookingleadtime
                groupinstantbooking: $groupinstantbooking
                Is_free_demo: $Is_free_demo
                fitness_package_type: $fitness_package_type
                fitnesspackagepricing: $fitnesspackagepricing
                Ptclasssize: $ptclasssize
                classsize: $classsize
                users_permissions_user: $users_permissions_user
                publishing_date: $publishing_date
                expiry_date: $expiry_date
                Thumbnail_ID: $thumbnail
                Upload_ID: $upload
                equipment_lists: $equipmentList
                video_URL: $videoUrl
                languages: $languages
                Start_date: $Start_date
                End_date: $End_date
            }
        ) {
            data {
                id
                attributes {
                    classsize
                    groupinstantbooking
                    duration
                }
            }
        }
    }
`;

export const CREATE_BOOKING_CONFIG_AND_TAG_CHANNEL = gql`
    mutation createBookingconfig(
        $id: ID!
        $isAuto: Boolean
        $bookings_per_day: Int
        $bookings_per_month: Int
    ) {
        createBookingConfig(
            data: {
                isAuto: $isAuto
                fitnesspackage: $id
                bookingsPerDay: $bookings_per_day
                BookingsPerMonth: $bookings_per_month
            }
        ) {
            data {
                id
            }
        }
        createTag(data: { tag_name: $tagName, fitnesspackage: $packageId }) {
            data {
                id
            }
        }
    }
`;

export const CREATE_TAG = gql`
    mutation createTag($id: ID!, $tagName: String) {
        createTag(data: { tag_name: $tagName, fitnesspackage: $id }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_PACKAGE_STATUS = gql`
    mutation updateFitnesspackageStatus($id: ID!, $Status: Boolean) {
        updateFitnesspackage(id: $id, data: { Status: $Status }) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_CHANNEL_COHORT_PACKAGE = gql`
    mutation updateChannelCohortPackage(
        $id: ID!
        $aboutpackage: String
        $benefits: String
        $packagename: String
        $channelinstantBooking: Boolean
        $Is_free_demo: Boolean
        $expiry_date: DateTime
        $level: ENUM_FITNESSPACKAGE_LEVEL
        $fitnesspackagepricing: JSON
        $publishing_date: DateTime
        $tags: String
        $users_permissions_user: ID
        $fitness_package_type: ID
        $is_private: Boolean
        $classsize: Int
        $address: ID
        $mode: ENUM_FITNESSPACKAGE_MODE
        $residential_type: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE
        $languages: [ID]
        $End_date: DateTime
        $Start_date: DateTime
        $Course_details: JSON
        $thumbnail: String
        $upload: String
        $equipmentList: [ID]
        $videoUrl: String
        $fitnessdisciplines: [ID]
        $Intensity: ENUM_FITNESSPACKAGE_INTENSITY
        $duration: Int
        $Accomdation_details: JSON
        $SubscriptionDuration: JSON
    ) {
        updateFitnesspackage(
            id: $id
            data: {
                SubscriptionDuration: $SubscriptionDuration
                aboutpackage: $aboutpackage
                benefits: $benefits
                packagename: $packagename
                groupinstantbooking: $channelinstantBooking
                Is_free_demo: $Is_free_demo
                expiry_date: $expiry_date
                level: $level
                fitnesspackagepricing: $fitnesspackagepricing
                publishing_date: $publishing_date
                tags: $tags
                users_permissions_user: $users_permissions_user
                fitness_package_type: $fitness_package_type
                is_private: $is_private
                classsize: $classsize
                address: $address
                mode: $mode
                residential_type: $residential_type
                languages: $languages
                Start_date: $Start_date
                End_date: $End_date
                Course_details: $Course_details
                Thumbnail_ID: $thumbnail
                Upload_ID: $upload
                equipment_lists: $equipmentList
                video_URL: $videoUrl
                fitnessdisciplines: $fitnessdisciplines
                Intensity: $Intensity
                duration: $duration
                Accomdation_details: $Accomdation_details
            }
        ) {
            data {
                id
                attributes {
                    classsize
                    duration
                    groupinstantbooking
                }
            }
        }
    }
`;

export const CREATE_ADDRESS = gql`
    mutation createAddress(
        $address: String
        $city: String
        $country: String
        $state: String
        $zipcode: String
        $title: String
        $users_permissions_user: ID
        $latitude: String
        $longitude: String
    ) {
        createAddress(
            data: {
                latitude: $latitude
                longitude: $longitude
                address1: $address
                city: $city
                state: $state
                country: $country
                zipcode: $zipcode
                Title: $title
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`;

export const CREATE_CHANNEL_PACKAGE = gql`
    mutation createChannelPackage(
        $Industry: ID
        $aboutpackage: String
        $benefits: String
        $packagename: String
        $channelinstantBooking: Boolean
        $expiry_date: DateTime
        $level: ENUM_FITNESSPACKAGE_LEVEL
        $fitnesspackagepricing: JSON
        $publishing_date: DateTime
        $tags: String
        $users_permissions_user: ID
        $fitness_package_type: ID
        $is_private: Boolean
        $classsize: Int
        $address: ID
        $mode: ENUM_FITNESSPACKAGE_MODE
        $residential_type: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE
        $languages: [ID]
        $End_date: DateTime
        $Start_date: DateTime
        $Course_details: JSON
        $thumbnail: String
        $upload: String
        $equipmentList: [ID]
        $videoUrl: String
        $fitnessdisciplines: [ID]
        $Intensity: ENUM_FITNESSPACKAGE_INTENSITY
        $duration: Int
        $Accomdation_details: JSON
        $SubscriptionDuration: JSON
    ) {
        createFitnesspackage(
            data: {
                Industry: $Industry
                SubscriptionDuration: $SubscriptionDuration
                aboutpackage: $aboutpackage
                benefits: $benefits
                packagename: $packagename
                groupinstantbooking: $channelinstantBooking
                expiry_date: $expiry_date
                level: $level
                fitnesspackagepricing: $fitnesspackagepricing
                publishing_date: $publishing_date
                tags: $tags
                users_permissions_user: $users_permissions_user
                fitness_package_type: $fitness_package_type
                is_private: $is_private
                classsize: $classsize
                address: $address
                mode: $mode
                residential_type: $residential_type
                languages: $languages
                Start_date: $Start_date
                End_date: $End_date
                Course_details: $Course_details
                Thumbnail_ID: $thumbnail
                Upload_ID: $upload
                equipment_lists: $equipmentList
                video_URL: $videoUrl
                fitnessdisciplines: $fitnessdisciplines
                Intensity: $Intensity
                duration: $duration
                Accomdation_details: $Accomdation_details
            }
        ) {
            data {
                id
                attributes {
                    packagename
                    fitness_package_type {
                        data {
                            id
                            attributes {
                                type
                            }
                        }
                    }
                    classsize
                    duration
                    groupinstantbooking
                }
            }
        }
    }
`;

export const CREATE_EVENT = gql`
    mutation createEventPackage($data: FitnesspackageInput!) {
        createFitnesspackage(data: $data) {
            data {
                id
                attributes {
                    packagename
                    fitness_package_type {
                        data {
                            id
                            attributes {
                                type
                            }
                        }
                    }
                    classsize
                    duration
                    groupinstantbooking
                }
            }
        }
    }
`;
