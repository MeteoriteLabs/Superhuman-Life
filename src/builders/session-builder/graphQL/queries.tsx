import { gql } from "@apollo/client";

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
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
      accepted_date
      fitnesspackages {
        expiry_date
        id
        fitness_package_type{
          type
        }
        packagename
        duration
        Status
      }
      
      program_managers{
        id
        fitnesspackages{
          expiry_date
          id
          fitness_package_type{
            type
          }
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


export const GET_ALL_FITNESS_PACKAGE_BY_TYPE = gql`
    query fitnesspackages($id: ID!, $type: String){
      fitnesspackages(
        where: 
          {
            users_permissions_user:{ id: $id}
            fitness_package_type:{ type: $type}
          }
      ){

        id
        packagename
        expiry_date
        Status
        duration
      }
    }
`

export const GET_ALL_PROGRAM_BY_TYPE = gql`
    query programManagers($id: ID!, $type: String){
      programManagers(
        where:{
          fitnesspackages:{
              users_permissions_user:{ id: $id}
              fitness_package_type:{ type: $type}
          }
        }
      )
      {
        
        fitnesspackages{
          id
          packagename
        }
        fitnessprograms{
          id
          title
          published_at
        }
      }
    }
`

export const GET_ALL_CLIENT_PACKAGE = gql`
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
      accepted_date
      fitnesspackages {
        expiry_date
        id
        fitness_package_type{
          type
        }
        Status
      }
      
      program_managers{
        id
        fitnesspackages{
          expiry_date
          id
          fitness_package_type{
            type
          }
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

export const GET_ALL_CLIENT_PACKAGE_BY_ID = gql`
  query userPackages($id: ID!){
    userPackages(
      where:{
        fitnesspackages: { id: $id }
      }
    )
        {
          id
          users_permissions_user {
            username
          }
          effective_date
         fitnesspackages{
            id
            duration
          }
          program_managers{
            id
          }
        }
    
  }


`


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



export const FETCH_FITNESSDISCPLINES = gql`
    query fitnessdiscplines{
        fitnessdisciplines(sort: "updatedAt"){
            id
            disciplinename
            updatedAt
        }
    }
`