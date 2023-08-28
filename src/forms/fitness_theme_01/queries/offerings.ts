import { gql } from '@apollo/client';

export const UPDATE_WEBSITE_SECTION = gql`
    mutation MutateWebsiteSections($id: ID!, $title: String, $desc: String) {
        updateWebsiteSection(
            id: $id
            data: { sectionData: { intro: { title: $title, description: $desc } } }
        ) {
            data {
                id
            }
        }
    }
`;
