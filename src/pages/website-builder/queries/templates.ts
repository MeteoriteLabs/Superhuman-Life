import { gql } from '@apollo/client';

export const FETCH_TEMPLATES = gql`
    query WebsiteTemplates {
        templates {
            data {
                id
                attributes {
                    templateName
                    CreatedBy
                    logo
                    thumbnail
                    description
                    features
                    goodFor
                    defaultData
                    templateUrl
                }
            }
        }
    }
`;

export const FETECH_SELECTED_TEMPLATE = gql`
    query WebsiteTemplates($templateName: String) {
        templates(filters: { templateName: { eq: $templateName } }) {
            data {
                id
                attributes {
                    templateName
                    CreatedBy
                    logo
                    thumbnail
                    description
                    features
                    goodFor
                    defaultData
                    templateUrl
                }
            }
        }
    }
`;
