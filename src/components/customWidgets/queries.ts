import { gql } from "@apollo/client";

export const DESIGNATIONS = gql`
    query fetchDesignations {
        designations(pagination: {pageSize:1000}){
            data{
                id
                attributes{
                    Designation_title
                }
            }
        }
    }
`;

export const LANGUAGES = gql`
    query fetchLanguages {
        languages(pagination: {pageSize: 1000}){
            data{
              id
              attributes{
                languages
              }
            }
          }
    }
`;

export const ORGANIZATION_TYPE = gql`
    query getchOrg {
        organizationTypes(pagination: {pageSize: 1000}){
            data{
            id
            attributes{
            Org_title_name
            }
        }
        }
    }
`