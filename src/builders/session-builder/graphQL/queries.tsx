import { gql } from "@apollo/client";

export const GET_PACKAGE_BY_TYPE = gql`
  query userPackages($id: ID!, $type: String) {
    userPackages(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
          fitness_package_type: { type: $type }
        }
      }
      sort: "fitnesspackages.id"
    ) {
      id
      users_permissions_user {
        username
      }
      effective_date
      purchase_date
      fitnesspackages {
        duration
        expiry_date
        publishing_date
        id
        packagename
        level
        disciplines{
          id
          disciplinename
        }
        duration
        Status
        fitness_package_type {
          type
        }
        users_permissions_user {
          id
        }
      }
      fitnessprograms {
        id
        level
        description
        published_at
        title
        users_permissions_user {
          username
          id
        }
        fitnessdisciplines{
          disciplinename
          id
        }
      }
    }
  }
`;




export const GET_ALL_FITNESSDISCIPLINES = gql`
  query Fitnessdisciplines {
    fitnessdisciplines {
      id
      disciplinename
    }
  }
`;


export const GET_ALL_FITNESSEQUIPMENT = gql`
  query equipmentLists{
    equipmentLists{
      id
      name
    }
  }
`