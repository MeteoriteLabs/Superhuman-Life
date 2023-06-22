import { gql } from "@apollo/client";


export const UPDATE_WEBSITE_SECTION = gql`
  mutation MutateWebsiteSections($id: ID!, $data: JSON) {
    updateWebsiteSection(
      id: $id
      data: {
        sectionData: $data
      }
    ) {
      data {
        id
      }
    }
  }
`;
