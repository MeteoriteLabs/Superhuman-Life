import { gql } from "@apollo/client";

export const FETCH_TEMPLATES = gql`
query WebsiteTemplates {
  templates {
    data{
      id
      attributes{
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