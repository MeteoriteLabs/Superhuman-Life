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
        expiry_date
        id
        packagename
        duration
        Status
      }
      
      program_managers{
        id
        fitnesspackages{
          expiry_date
          id
          packagename
          duration
          Status
        }

        fitnessprograms{
          id
          title
          published_at
        }
      }
    }
  }
`;


// export const GET_PACKAGE_BY_TYPE = gql`
//     query programManagers($id: ID!, $type: String){
//       programManagers( 
//         where: {
//             fitnesspackages: {
//               users_permissions_user: { id: $id}
//               fitness_package_type:{type:$type}
//             }
//         },
//       )
//       {
//         id
//         fitnesspackages{
//           id
//           packagename
//           fitness_package_type{
//             type
//           }
//         }
//         fitnessprograms{
//           id
//           title
//         }
//       }
//     }

// `





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