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

export const FETCH_TEMPLATE_BY_ID = gql`
query getTemplate($Id: ID!) {
  template(id: $Id) {
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
        website_sections {
          data {
            id
            attributes {
              inUse
              sectionName
              sectionData
              sectionPage
              sectionType
              createdAt
              updatedAt
            }
          }
        }
        templateUrl
        createdAt
        updatedAt
      }
    }
  }
}`;