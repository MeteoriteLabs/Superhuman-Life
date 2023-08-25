import {gql} from "@apollo/client";

export const UPDATE_PACKAGE = gql`
    mutation updateFitnesspackage($id: ID!, $data: FitnesspackageInput!) {
        updateFitnesspackage(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;
