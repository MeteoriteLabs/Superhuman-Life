import { gql } from '@apollo/client';

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
    query userPackages($id: ID!, $type: String) {
        clientPackages(
            filters: {
                fitnesspackages: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: $type } }
                }
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
                            }
                        }
                    }
                    effective_date
                    accepted_date
                    fitnesspackages {
                        data {
                            id
                            attributes {
                                expiry_date
                                fitness_package_type {
                                    data {
                                        id
                                        attributes {
                                            type
                                        }
                                    }
                                }
                                packagename
                                groupstarttime
                                groupendtime
                                restdays
                                ptonline
                                ptoffline
                                grouponline
                                groupoffline
                                recordedclasses
                                duration
                                Status
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_FITNESS_PACKAGE_BY_TYPE = gql`
    query fitnesspackages($id: ID!, $type: String) {
        fitnesspackages(
            filters: {
                users_permissions_user: { id: { eq: $id } }
                fitness_package_type: { type: { eq: $type } }
            }
        ) {
            data {
                id
                attributes {
                    packagename
                    expiry_date
                    Status
                    duration
                    ptonline
                    ptoffline
                    grouponline
                    groupoffline
                    restdays
                    recordedclasses
                    groupstarttime
                    groupendtime
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

export const GET_ALL_CLIENT_PACKAGE = gql`
    query userPackages($id: ID!, $type: String) {
        clientPackages(
            filters: {
                fitnesspackages: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: $type } }
                }
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
                            }
                        }
                    }
                    effective_date
                    accepted_date
                    fitnesspackages {
                        data {
                            id
                            attributes {
                                expiry_date
                                fitness_package_type {
                                    data {
                                        id
                                        attributes {
                                            type
                                        }
                                    }
                                }
                                packagename
                                groupstarttime
                                groupendtime
                                restdays
                                ptonline
                                ptoffline
                                grouponline
                                groupoffline
                                recordedclasses
                                duration
                                Status
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_CLASSIC_CLIENT_BY_ID = gql`
    query userPackages($id: ID!) {
        clientPackages(filters: { fitnesspackages: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                    effective_date
                    accepted_date
                    fitnesspackages {
                        data {
                            id
                            attributes {
                                expiry_date
                                fitness_package_type {
                                    data {
                                        id
                                        attributes {
                                            type
                                        }
                                    }
                                }
                                packagename
                                groupstarttime
                                groupendtime
                                restdays
                                ptonline
                                ptoffline
                                grouponline
                                groupoffline
                                recordedclasses
                                duration
                                Status
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_ALL_FITNESSDISCIPLINES = gql`
    query Fitnessdisciplines {
        fitnessdisciplines {
            data {
                id
                attributes {
                    disciplinename
                }
            }
        }
    }
`;

export const GET_ALL_FITNESSEQUIPMENT = gql`
    query equipmentLists {
        equipmentLists {
            data {
                id
                attributes {
                    name
                }
            }
        }
    }
`;

export const FETCH_FITNESSDISCPLINES = gql`
    query fitnessdiscplines {
        fitnessdisciplines(sort: ["updatedAt"]) {
            data {
                id
                attributes {
                    disciplinename
                    updatedAt
                }
            }
        }
    }
`;

export const GET_TABLEDATA = gql`
    query getprogramdata($id: ID!) {
        fitnessprograms(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    title
                    duration_days
                    level
                    description
                    fitnessdisciplines {
                        data {
                            id
                            attributes {
                                disciplinename
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_TAGS_FOR_GROUP = gql`
    query getTagsforGroup($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Group Class" } }
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                day_of_program
                                tag
                                type
                                end_time
                                start_time
                                mode
                                session_date
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
                                packagename
                                expiry_date
                                Status
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
                                users_permissions_user {
                                    data {
                                        id
                                        attributes {
                                            username
                                        }
                                    }
                                }
                                fitnesspackages {
                                    data {
                                        id
                                        attributes {
                                            packagename
                                            duration
                                            mode
                                            Status
                                            expiry_date
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

export const GET_TAGS_FOR_CLASSIC = gql`
    query getTagsforRecorded($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Classic Class" } }
                }
            }
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
                    tag_name
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                duration
                                mode
                                Status
                                expiry_date
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_TAGS_FOR_CHANNEL = gql`
    query getTagsforLiveStream($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Live Stream Channel" } }
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                session_date
                                type
                            }
                        }
                    }
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                expiry_date
                                duration
                                mode
                                Status
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_TAGS_FOR_EVENT = gql`
    query getTagsforEvent($id: ID!,$start: Int, $limit: Int ) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Event" } }
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                session_date
                                type
                            }
                        }
                    }
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                duration
                                mode
                                Status
                                Start_date
                                End_date
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_TAGS_FOR_COHORT = gql`
    query getTagsforCohort($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Cohort" } }
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                session_date
                                type
                            }
                        }
                    }
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                duration
                                mode
                                Status
                                Start_date
                                End_date
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_TAG_BY_ID = gql`
    query getTagById($id: ID, $startDate: Date, $endDate: Date) {
        tags(
            filters: {
                id: { eq: $id }
                sessions: { session_date: { gte: $startDate, lte: $endDate } }
            }
        ) {
            data {
                id
                attributes {
                    tag_name
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                duration
                                mode
                                level
                                Status
                                expiry_date
                                ptonline
                                ptoffline
                                grouponline
                                groupoffline
                                recordedclasses
                                restdays
                                Start_date
                                End_date
                                Status
                                residential_type
                            }
                        }
                    }
                    sessions(pagination: { pageSize: 100 }) {
                        data {
                            id
                            attributes {
                                day_of_program
                                tag
                                type
                                end_time
                                start_time
                                Is_restday
                                Is_program_template
                                mode
                                session_date
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
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_SESSIONS_FROM_TAGS = gql`
    query getSessionsFromTags($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    fitness_package_type: { type: { eq: "Custom Fitness" } }
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                day_of_program
                                tag
                                type
                                end_time
                                start_time
                                Is_restday
                                mode
                                session_date
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
                    
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
                                users_permissions_user {
                                    data {
                                        id
                                        attributes {
                                            username
                                        }
                                    }
                                }
                                fitnesspackages {
                                    data {
                                        id
                                        attributes {
                                            packagename
                                            duration
                                            mode
                                            Status
                                            expiry_date
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

export const GET_SESSIONS_FROM_TAGS_FOR_ONE_ON_ONE_OR_ON_DEMAND = gql`
    query getSessionsFromTags($id: ID!, $start: Int, $limit: Int) {
        tags(
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
            filters: {
                fitnesspackage: {
                    users_permissions_user: { id: { eq: $id } }
                    or: [
                        { fitness_package_type: { type: { eq: "One-On-One" } } }
                        { fitness_package_type: { type: { eq: "On-Demand PT" } } }
                    ]
                }
            }
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
                    tag_name
                    sessions {
                        data {
                            id
                            attributes {
                                day_of_program
                                tag
                                type
                                end_time
                                start_time
                                Is_restday
                                mode
                                session_date
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
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
                                users_permissions_user {
                                    data {
                                        id
                                        attributes {
                                            username
                                        }
                                    }
                                }
                                fitnesspackages {
                                    data {
                                        id
                                        attributes {
                                            packagename
                                            duration
                                            mode
                                            Status
                                            expiry_date
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

export const GET_CLIENTS_BY_TAG = gql`
    query getClientsGroup($id: ID!) {
        tags(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    sessions {
                        data {
                            id
                            attributes {
                                tag
                            }
                        }
                    }
                    fitnesspackage {
                        data {
                            id
                            attributes {
                                packagename
                                duration
                                level
                                Start_date
                                End_date
                                Status
                                residential_type
                            }
                        }
                    }
                    client_packages {
                        data {
                            id
                            attributes {
                                effective_date
                                accepted_date
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
