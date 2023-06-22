import { gql } from "@apollo/client";

export const GET_WEBSITE_SECTION = gql`
query GetWebsiteSectionId($id: ID, $sectionPage: String, $sectionType: String) {
  websiteSections(
    filters: {
      users_permissions_user: { id: { eq: $id } }
      sectionPage: { eq: $sectionPage }
      sectionType: { eq: $sectionType }
    }
  ) {
    data {
      id
      attributes{
        sectionData
      }
     
  }
}
}
`