import { gql } from "@apollo/client";

export const CREATE_WEBPAGE_DETAILS = gql`

mutation createWebsiteDataRecord($user:ID!, 
  $template_id:ID!, 
  $frm:JSON ){
  createWebsiteDatum(input: {
    data: {
      users_permissions_user: $user,
			form_data: $frm,
			website_template: $template_id}
  }){
    websiteDatum{
      id
    }
  }
}

`;

export const UPDATE_WEBSITE_DATA = gql`

 mutation updateWebsiteDataRecord($user:ID!, $frm:JSON, $record_id: ID!, $template_id: ID!) {
    updateWebsiteDatum(input: {
        where: {id: $record_id},
        data: {
            users_permissions_user: $user,
			form_data: $frm,
			website_template: $template_id
            }
        
    }) {
        websiteDatum {
            id
            website_template {
                template_name
            }
        }
    }

}
`;
export const UPDATE_WEBSITE_DATA_TO_EMPTY = gql`

 mutation updateWebsiteDataRecord($user:ID!, $form_data:JSON, $record_id: ID!) {
    updateWebsiteDatum(input: {
        where: {id: $record_id},
        data: {
            users_permissions_user: $user,
			form_data: $form_data
			
            }
        
    }) {
        websiteDatum {
            
            form_data
        }
    }

}
`;

export const FETCH_WEBSITE_DATA = gql`
    query fetchData($id: ID!) {
        websiteData(where: {users_permissions_user: {id:$id}}){
            id
            form_data
            website_template{
               id
               schema_json
               form_json
               template_name
               Stepper_Title
            }
        }
    }

`;


export const FETCH_WEBSITE_SCHEMA_AND_FORM_JSON = gql`

        query fetchSchemaAndFormJSON($id: ID!) {
            websiteData(where: {users_permissions_user: {id:$id}}) {
            website_template{
                schema_json
                form_json
            }
            }
        }

`;



export const FETCH_PUBLISHED_TEMPLATES = gql`

     query fetchTemplates {
        websiteTemplates(where: {published: true})
     {
    
         template_name
         id
     }
    }
`;


export const FETCH_DATA_FORM = gql`

    query formData($id: ID!) {
        websiteData(where: {users_permissions_user: {id:$id}}) {
        
            id
            form_data
            website_template{
                id
            }
        }
    }

`;

export const FETCH_TEMPLATE_SCHEMA_FORM = gql`
    query templateData($id: ID!) {
        websiteTemplate(id:$id) {
        
            form_json
            schema_json
            template_name
            Stepper_Title
            website_data{
                form_data
            }
        }
    }
`;