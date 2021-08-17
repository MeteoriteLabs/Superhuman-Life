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


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGVmNTZkNGQ1NjM4NTFjNjQzNmU4NCIsImlhdCI6MTYyNTg4NDcwNywiZXhwIjoxNjI4NDc2NzA3fQ.omQQqPKPNvzZkHW9--X6qHcf4T-8uVTUtXUiP5fLljc



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGVmNTZkNGQ1NjM4NTFjNjQzNmU4NCIsImlhdCI6MTYyODMzMDE2MiwiZXhwIjoxNjMwOTIyMTYyfQ.DCkfYNIxNadwLY1XVdenT_snbk-T0IVjdY_fqpd7Z5U