import { gql } from "@apollo/client";

export const FETCH_TEMPLATES = gql`
query fetchTemplates($isPublished: Boolean) {
    websiteTemplates(filters: {published: {eq: $isPublished}})
 {
    data{
      id
      attributes{
        template_name
        schema_json
        form_json
        published
        Sections
        CreatedBy
        GoodFor
        Features
        TemplateCheckList
        updatedAt
        createdAt
      }  
      
    }
 }
}
`;