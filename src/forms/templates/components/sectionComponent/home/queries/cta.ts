import { gql } from "@apollo/client";


export const UPDATE_WEBSITE_SECTION = gql`
mutation MutateWebsiteSections($id: ID!, $title: String, $buttonText: String, $link: String ) {
  updateWebsiteSection(
    id: $id
    data:{
      sectionData:{
       
  title: $title,
  button: {
    link: $link,
    text: $buttonText
  }
}
      
    }
  ) {
   data {
    id
  }
    # Include any other fields you want to retrieve after the update
  }
}`
  