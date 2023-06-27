import { gql } from '@apollo/client'

export const GET_CHANGEMAKERS_NEW = gql`
    query getclient($clientid: ID) {
        clientPackages(filters: { users_permissions_user: { id: { eq: $clientid } } }) {
            data {
                id
                attributes {
                    fitnesspackages {
                        data {
                            attributes {
                                users_permissions_user {
                                    data {
                                        id
                                        attributes {
                                            username
                                            designations {
                                                data {
                                                    id
                                                    attributes {
                                                        Designation_title
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
`

export const GET_MOODSCALE = gql`
    query scale {
        ratingScales(where: { Type: "Mood" }) {
            id
            Type
            item_type
            items
        }
    }
`

export const GET_MOODSCALE_NEW = gql`
    query {
        ratingScales(filters: { Type: { eq: "Mood" } }) {
            data {
                id
                attributes {
                    Type
                    items
                    item_type
                }
            }
        }
    }
`

export const GET_FITNESSSCALE = gql`
    query scale {
        ratingScales(where: { Type: "fitness" }) {
            id
            Type
            item_type
            items
        }
    }
`

export const GET_FITNESSSCALE_NEW = gql`
    query {
        ratingScales(filters: { Type: { eq: "fitness" } }) {
            data {
                id
                attributes {
                    Type
                    items
                    item_type
                }
            }
        }
    }
`

export const ADD_RATING = gql`
    mutation addRating(
        $type: String
        $resource_id: String
        $rating: Int
        $max_rating: Int
        $rating_scale_id: ID
        $resource_type: String
        $user_permissions_user: ID
        $clientid: ID
    ) {
        createRating(
            input: {
                data: {
                    type: $type
                    resource_id: $resource_id
                    users_permissions_user: $user_permissions_user
                    rating: $rating
                    max_rating: $max_rating
                    resource_type: $resource_type
                    rating_scale: $rating_scale_id
                    target_user: $clientid
                }
            }
        ) {
            rating {
                id
            }
        }
    }
`

export const ADD_RATING_NEW = gql`
    mutation addRating(
        $type: String
        $resource_id: String
        $rating: Int
        $max_rating: Int
        $rating_scale_id: ID
        $resource_type: String
        $user_permissions_user: ID
        $clientid: ID
    ) {
        createRating(
            data: {
                type: $type
                resource_id: $resource_id
                rating: $rating
                max_rating: $max_rating
                rating_scale: $rating_scale_id
                resource_type: $resource_type
                users_permissions_user: $user_permissions_user
                target_user: $clientid
            }
        ) {
            data {
                id
            }
        }
    }
`

export const ADD_NOTE = gql`
    mutation addNote(
        $type: String
        $resource_id: String
        $user_permissions_user: ID
        $note: String
        $clientid: ID
    ) {
        createFeedbackNote(
            input: {
                data: {
                    type: $type
                    resource_id: $resource_id
                    users_permissions_user: $user_permissions_user
                    note: $note
                    target_user: $clientid
                }
            }
        ) {
            feedbackNote {
                id
            }
        }
    }
`

export const ADD_NOTE_NEW = gql`
    mutation addNote(
        $type: String
        $resource_id: String
        $user_permissions_user: ID
        $note: String
        $clientid: ID
    ) {
        createFeedbackNote(
            data: {
                type: $type
                resource_id: $resource_id
                users_permissions_user: $user_permissions_user
                note: $note
                target_user: $clientid
            }
        ) {
            data {
                id
            }
        }
    }
`

export const GET_NOTES = gql`
    query getfeedbackNotes($id: ID) {
        feedbackNotes(where: { target_user: { id: $id } }, sort: "updatedAt:desc") {
            id
            updatedAt
            type
            users_permissions_user {
                id
                username
                designation
            }
            target_user {
                id
            }
            note
            resource_id
            feedback_comments {
                id
                comment
                users_permissions_user {
                    id
                    username
                }
            }
        }
    }
`

export const GET_NOTES_NEW = gql`
    query getfeedbackNotes($id: ID) {
        feedbackNotes(filters: { target_user: { id: { eq: $id } } }, sort: ["updatedAt:desc"]) {
            data {
                id
                attributes {
                    updatedAt
                    type
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                                designations {
                                    data {
                                        id
                                        attributes {
                                            Designation_title
                                        }
                                    }
                                }
                            }
                        }
                    }
                    target_user {
                        data {
                            id
                        }
                    }
                    note
                    resource_id
                    feedback_comments {
                        data {
                            id
                            attributes {
                                comment
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
`

export const GET_NOTES_BYID = gql`
    query getfeedbackNotes($id: ID) {
        feedbackNotes(where: { id: $id }) {
            id
            updatedAt
            type
            users_permissions_user {
                id
                username
                designation
            }
            target_user {
                id
            }
            note
            resource_id
            feedback_comments {
                id
                comment
                users_permissions_user {
                    id
                    username
                }
            }
        }
    }
`

export const GET_NOTES_BYID_NEW = gql`
    query getfeedbackNotes($id: ID) {
        feedbackNotes(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    updatedAt
                    type
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                                designations {
                                    data {
                                        id
                                        attributes {
                                            Designation_title
                                        }
                                    }
                                }
                            }
                        }
                    }
                    target_user {
                        data {
                            id
                        }
                    }
                    note
                    resource_id
                    feedback_comments {
                        data {
                            id
                            attributes {
                                comment
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
`

export const CHECK_NOTES = gql`
    query checkNotes($id: ID, $clientid: ID) {
        feedbackNotes(
            where: { users_permissions_user: { id: $id }, target_user: { id: $clientid } }
        ) {
            id
            resource_id
        }
    }
`

export const CHECK_NOTES_NEW = gql`
    query checkNotes($id: ID, $clientid: ID) {
        feedbackNotes(
            filters: {
                users_permissions_user: { id: { eq: $id } }
                target_user: { id: { eq: $clientid } }
            }
        ) {
            data {
                id
                attributes {
                    resource_id
                }
            }
        }
    }
`

export const ADD_COMMENT = gql`
    mutation addComment($feedback_note: ID, $comment: String, $users_permissions_user: ID) {
        createFeedbackComment(
            input: {
                data: {
                    feedback_note: $feedback_note
                    comment: $comment
                    users_permissions_user: $users_permissions_user
                }
            }
        ) {
            feedbackComment {
                id
            }
        }
    }
`

export const ADD_COMMENT_NEW = gql`
    mutation addComment($feedback_note: ID, $comment: String, $users_permissions_user: ID) {
        createFeedbackComment(
            data: {
                feedback_note: $feedback_note
                comment: $comment
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`

export const DELETE_NOTE = gql`
    mutation deleteNote($id: ID!) {
        deleteFeedbackNote(input: { where: { id: $id } }) {
            feedbackNote {
                id
            }
        }
    }
`

export const DELETE_NOTE_NEW = gql`
    mutation deleteNote($id: ID!) {
        deleteFeedbackNote(id: $id) {
            data {
                id
            }
        }
    }
`

export const DELETE_COMMENT = gql`
    mutation deleteComment($id: ID!) {
        deleteFeedbackComment(input: { where: { id: $id } }) {
            feedbackComment {
                id
            }
        }
    }
`

export const DELETE_COMMENT_NEW = gql`
    mutation deleteComment($id: ID!) {
        deleteFeedbackComment(id: $id) {
            data {
                id
            }
        }
    }
`

export const DELETE_RATING = gql`
    mutation deleteRating($id: ID!) {
        deleteRating(input: { where: { id: $id } }) {
            rating {
                id
            }
        }
    }
`

export const DELETE_RATING_NEW = gql`
    mutation deleteRating($id: ID!) {
        deleteRating(id: $id) {
            data {
                id
            }
        }
    }
`

export const GET_TAGNAME = gql`
    query TagName($id: ID) {
        workouts(where: { id: $id }) {
            id
            workouttitle
        }
    }
`

export const GET_TAGNAME_NEW = gql`
    query TagName($id: ID) {
        workouts(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    workouttitle
                }
            }
        }
    }
`

export const GET_RATING_NOTES = gql`
    query ratingsforNotes($id: ID, $clientid: ID, $type: String) {
        ratings(where: { resource_id_contains: $id, type: $type, target_user: { id: $clientid } }) {
            id
            rating
            max_rating
            target_user {
                id
                username
            }
            type
        }
    }
`

export const GET_RATING_NOTES_NEW = gql`
    query ratingsforNotes($id: ID, $clientid: ID, $type: String) {
        ratings(
            filters: {
                resource_id: { containsi: $id }
                type: { eq: $type }
                target_user: { id: { eq: $clientid } }
            }
        ) {
            data {
                id
                attributes {
                    rating
                    max_rating
                    type
                    target_user {
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
`

export const GET_RATING_NOTES_BYID = gql`
    query ratingsforNotes($id: ID, $clientid: ID) {
        ratings(where: { resource_id_contains: $id, target_user: { id: $clientid } }) {
            id
            type
            resource_id
        }
    }
`

export const GET_RATING_NOTES_BYID_NEW = gql`
    query ratingsforNotes($id: ID, $clientid: ID) {
        ratings(
            filters: { resource_id: { containsi: $id }, target_user: { id: { eq: $clientid } } }
        ) {
            data {
                id
                attributes {
                    rating
                    max_rating
                    type
                    target_user {
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
`

export const GET_NOTES_RATING = gql`
    query ratingsforNotes($id: String, $clientid: ID) {
        ratings(where: { resource_id_contains: $id, target_user: { id: $clientid } }) {
            id
            type
            resource_id
            rating
            max_rating
        }
        feedbackNotes(where: { resource_id_contains: $id, target_user: { id: $clientid } }) {
            id
            updatedAt
            type
            users_permissions_user {
                id
                username
                designation
            }
            target_user {
                id
            }
            note
            resource_id
            feedback_comments {
                id
                comment
                users_permissions_user {
                    id
                    username
                }
            }
        }
    }
`

export const GET_NOTES_RATING_NEW = gql`
    query ratingsforNotes($id: String, $clientid: ID) {
        ratings(
            filters: { resource_id: { containsi: $id }, target_user: { id: { eq: $clientid } } }
        ) {
            data {
                id
                attributes {
                    type
                    resource_id
                    rating
                    max_rating
                }
            }
        }
        feedbackNotes(
            filters: { resource_id: { containsi: $id }, target_user: { id: { eq: $clientid } } }
        ) {
            data {
                id
                attributes {
                    updatedAt
                    type
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                                designations {
                                    data {
                                        id
                                        attributes {
                                            Designation_title
                                        }
                                    }
                                }
                            }
                        }
                    }
                    target_user {
                        data {
                            id
                        }
                    }
                    note
                    resource_id
                    feedback_comments {
                        data {
                            id
                            attributes {
                                comment
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
`

export const UPDATE_NOTES = gql`
    mutation updateNotes(
        $type: String
        $resource_id: String
        $users_permissions_user: ID
        $note: String
        $clientid: ID
        $messageid: ID!
    ) {
        updateFeedbackNote(
            input: {
                data: {
                    type: $type
                    resource_id: $resource_id
                    note: $note
                    target_user: $clientid
                    users_permissions_user: $users_permissions_user
                }
                where: { id: $messageid }
            }
        ) {
            feedbackNote {
                id
            }
        }
    }
`

export const UPDATE_NOTES_NEW = gql`
    mutation updateNotes(
        $type: String
        $resource_id: String
        $users_permissions_user: ID
        $note: String
        $clientid: ID
        $messageid: ID!
    ) {
        updateFeedbackNote(
            id: $messageid
            data: {
                type: $type
                resource_id: $resource_id
                note: $note
                target_user: $clientid
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`

export const UPDATE_RATING = gql`
    mutation updateNotes(
        $type: String
        $resource_id: String
        $rating: Int
        $max_rating: Int
        $rating_scale_id: ID
        $resource_type: String
        $user_permissions_user: ID
        $clientid: ID
        $messageid: ID!
    ) {
        updateRating(
            input: {
                data: {
                    type: $type
                    resource_id: $resource_id
                    users_permissions_user: $user_permissions_user
                    rating: $rating
                    max_rating: $max_rating
                    resource_type: $resource_type
                    rating_scale: $rating_scale_id
                    target_user: $clientid
                }
                where: { id: $messageid }
            }
        ) {
            rating {
                id
            }
        }
    }
`

export const UPDATE_RATING_NEW = gql`
    mutation updateNotes(
        $type: String
        $resource_id: String
        $rating: Int
        $max_rating: Int
        $rating_scale_id: ID
        $resource_type: String
        $user_permissions_user: ID
        $clientid: ID
        $messageid: ID!
    ) {
        updateRating(
            id: $messageid
            data: {
                type: $type
                resource_id: $resource_id
                users_permissions_user: $user_permissions_user
                rating: $rating
                max_rating: $max_rating
                resource_type: $resource_type
                rating_scale: $rating_scale_id
                target_user: $clientid
            }
        ) {
            data {
                id
            }
        }
    }
`
