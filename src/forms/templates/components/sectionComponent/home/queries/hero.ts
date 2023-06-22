import { gql } from "@apollo/client";

export const UPDATE_WEBSITE_SECTION = gql`
mutation MutateWebsiteSections($id: ID!, $image: String, $title: String, $desc: String) {
  updateWebsiteSection(
    id: $id
    data:{
      sectionData: {
        image: $image
        title: $title
        description: $desc
      }
    }
  ){
    data {
      id
    }
  }
}`
  