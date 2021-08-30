import { gql } from "@apollo/client";

export const GET_PACKAGE_BY_TYPE = gql`
query userPackages($id:ID!, $type:String){

  
    userPackages(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id  }
          fitness_package_type: { type: $type }
        }
      }
    ) 
    {
      id
      users_permissions_user {
        username
      }
      effective_date
      fitnesspackages {
        packagename
        duration
        Status
        published_at
        fitness_package_type {
          type
        }
        users_permissions_user {
          id
        }
      }
      fitnessprograms {
        published_at
        title
        users_permissions_user{
          username
          id
        }
      }
    }

}
`;
