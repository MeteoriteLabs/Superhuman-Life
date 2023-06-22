import { gql } from "@apollo/client";

// * $sectionData structure
//  {
//     "image": "https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=800",
//     "title": "Receiving the data😁😁",
//     "description": "Odio incidunt nam itaque sed eius modi error totam sit illum. Voluptas doloribus asperiores quaerat aperiam. Quidem harum omnis beatae ipsum soluta!"
//  }
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
  