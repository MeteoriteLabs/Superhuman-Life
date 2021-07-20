import { gql } from '@apollo/client'




export const CREATE_PT_PACKAGE = gql`
    mutation PTPackage(
        $packagename: String
        $tags: String
        $level: ENUM_FITNESSPACKAGES_LEVEL
        $aboutpackage: String
        $benefits: String
        $introvideourl: String
        $mode: ENUM_FITNESSPACKAGES_MODE
        $address:ID
        $disciplines: [ID]
        $ptoffline: Int
        $ptonline: Int
        $restdays: Int
        $bookingleadday: Int
        $fitness_package_type:ID
        $fitnesspackagepricing:JSON
        $ptclasssize:ENUM_FITNESSPACKAGES_PTCLASSSIZE
        $users_permissions_user:ID
    )
    {
        createFitnesspackage
            (
                input:{
                    data:{
                        packagename:$packagename
                        tags:$tags
                        level:$level
                        aboutpackage: $aboutpackage
                        benefits:$benefits
                        introvideourl:$introvideourl
                        mode:$mode
                        address:$address
                        disciplines: $disciplines
                        ptoffline:$ptoffline
                        ptonline:$ptonline
                        restdays:$restdays
                        bookingleadday: $bookingleadday
                        fitness_package_type: $fitness_package_type
                        fitnesspackagepricing: { packagepricing : $fitnesspackagepricing }
                        ptclasssize:$ptclasssize
                        users_permissions_user:$users_permissions_user
                    }
                }
            )  
            {
                fitnesspackage{
                    tags
                    level
                    aboutpackage
                    mode
                    ptoffline
                    ptonline
                    restdays
                    ptclasssize
                    users_permissions_user{
                        id
                    }
                }
            }
    }


`

export const DELETE_PACKAGE = gql`
    mutation deleteFitnesspackage($id:ID!){
        deleteFitnesspackage(
            input:{
                where:{id:$id}
            }
        )
        {
            fitnesspackage {
                id
            }
        }
    }
`

export const UPDATE_PACKAGE_STATUS = gql`
    mutation updateFitnesspackage(
        $id:ID!  
        $Status:Boolean
        )
        {
            updateFitnesspackage(
                input:{
                    where:{id:$id}
                    data:{
                        Status:$Status
                    }
                }
            ){
                fitnesspackage{
                    Status
                }
            }
        }
`