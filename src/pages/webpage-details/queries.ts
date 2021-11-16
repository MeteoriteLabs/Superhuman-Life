import { gql } from "@apollo/client";

export const CREATE_WEBPAGE_DETAILS = gql`


mutation createWebsite($frm:createWebsiteDatumInput){
	createWebsiteDatum(input: $frm)
		{
			websiteDatum {
				id
				email
				brand_name
				phone
                about_text
                action_button_text
				
			}
		}
}
   
`  

export const FETCH_WEBSITE_DATA = gql`
    query fetchData($id: ID!) {
        websiteData(where: {users_permissions_user: {id:$id}}){
            form_data
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
        }
    }

`;

export const FETCH_TEMPLATE_SCHEMA_FORM = gql`
    query templateData($id: ID!) {
        websiteTemplate(id:$id) {
        
            form_json
            schema_json
        }
    }
`;


// export const EDIT_WEBPAGE_DETAILS = gql`


// mutation updateWebsiteData($id: ID!){
// 	updateWebsiteDatum(where: {users_permissions_user: {id:$id}})
// 		{
// 			websiteDatum {
// 			form_data
				
// 			}
// 		}
// }
   
// `    


/**
 * 
 * {
    "1": {
        "title": "",
        "type": "object",
        "required": [],
        "properties": {
            "brand_name": {
                "type": "string",
                "title": "Brand Name"
            },
            "logo": {
                "type": "string",
                "title": "Logo"
            },
            "shortBio": {
                "type": "string",
                "title": "Short Bio"
            },
            "emailId": {
                "type": "string",
                "title": "Email ID"
            },
            "address": {
                "type": "string",
                "title": "Address"
            },
            "phoneNumber": {
                "type": "number",
                "title": "Phone Number"
            },
            "socialAccounts": {
                "type": "object",
                "title": "Social Accounts",
                "properties": {
                    "instagram": {
                        "type": "string",
                        "title": "Instagram"
                    },
                    "facebook": {
                        "type": "string",
                        "title": "Facebook"
                    },
                    "youtube": {
                        "type": "string",
                        "title": "Youtube"
                    },
                    "linkedIn": {
                        "type": "string",
                        "title": "LinkedIn"
                    }
                }
            }
        }
    },
    "2": {
        "title": "",
        "type": "object",
        "properties": {
            "carousel": {
                "type": "string",
                "title": "Carousel"
            },
            "buttonText": {
                "type": "string",
                "title": "Button Text"
            }
        }
    },
    "3": {
        "title": "",
        "type": "object",
        "properties": {
            "aboutImage": {
                "type": "string",
                "title": "About Image"
            },
            "aboutText": {
                "type": "string",
                "title": "About Text"
            },
            "aboutBackgroundColor": {
                "type": "string",
                "title": "About Background Color"
            }
        }
    },
    "4": {
        "title": "",
        "type": "object",
        "properties": {
            "stories": {
                "type": "string",
                "title": "Stories"
            },
            "stories-backgroundColor": {
                "type": "string",
                "title": " Stories Background Color"
            }
        }
    },
    "5": {
        "title": "",
        "type": "object",
        "properties": {
            "packagesBackgroundColor": {
                "type": "string",
                "title": "Packages-BackgroundColor"
            }
        }
    },
    "6": {
        "title": "",
        "type": "object",
        "properties": {
            "contactUsBackground": {
                "type": "string",
                "title": "Contact Us -Background"
            }
        }
    },
    "7": {
        "title": "",
        "type": "object",
        "properties": {
            "gallery": {
                "type": "string",
                "title": "Gallery"
            }
        }
    }
}
 */