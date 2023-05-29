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
        Stepper_Title
        website_data{
          data {
            id
            attributes{
             
              form_data
              website_template{
                data {
                  id
                  
                }
              }
              subdomain
              createdAt
              updatedAt
            }
          }
        }
        
        
      }
    }
 }
}
`;