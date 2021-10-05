import { gql } from '@apollo/client'

export const GET_ALL_PACKAGES = gql`
    query fitnesspackages($id:ID!){
        fitnesspackages(
    
             where: { users_permissions_user: { id: $id } }
            )
        {
            id
            packagename
            Status
            fitness_package_type{
                type
            }
            users_permissions_user{
                id
            }
        }
    }


`