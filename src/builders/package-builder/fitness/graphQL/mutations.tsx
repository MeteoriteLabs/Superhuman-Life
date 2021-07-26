import { gql } from '@apollo/client'




export const CREATE_PACKAGE = gql`
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
        $duration: Int
        $ptoffline: Int
        $ptonline: Int
        $grouponline:Int
        $groupoffline:Int
        $recordedclasses: Int
        $restdays: Int
        $bookingleadday: Int
        $groupinstantbooking: Boolean
        $fitness_package_type:ID
        $fitnesspackagepricing:JSON
        $ptclasssize:ENUM_FITNESSPACKAGES_PTCLASSSIZE
        $classsize:Int
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
                        duration:$duration
                        ptoffline:$ptoffline
                        ptonline:$ptonline
                        grouponline:$grouponline
                        groupoffline:$groupoffline
                        recordedclasses:$recordedclasses
                        restdays:$restdays
                        bookingleadday: $bookingleadday
                        groupinstantbooking: $groupinstantbooking
                        fitness_package_type: $fitness_package_type
                        fitnesspackagepricing: { packagepricing : $fitnesspackagepricing }
                        ptclasssize:$ptclasssize
                        classsize:$classsize
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

export const UPDATE_PACKAGE_PRIVATE = gql`
    mutation updateFitnesspackage(
        $id:ID!  
        $is_private:Boolean
        )
        {
            updateFitnesspackage(
                input:{
                    where:{id:$id}
                    data:{
                        is_private:$is_private
                    }
                }
            ){
                fitnesspackage{
                    is_private
                }
            }
        }
`


export const EDIT_PACKAGE = gql`
       mutation fitnesspackages (
           $id:ID!
           $packagename: String
           $tags: String
           $level: ENUM_FITNESSPACKAGES_LEVEL
           $aboutpackage: String
           $benefits: String
           $introvideourl: String
           $mode: ENUM_FITNESSPACKAGES_MODE
           $ptoffline: Int
           $ptonline: Int
           $grouponline:Int
           $groupoffline:Int
           $recordedclasses: Int
           $restdays: Int
           $bookingleadday: Int
           $fitnesspackagepricing:[editComponentFitnesspackagepricingFitnesspackagepricingInput]
           $duration: Int
           $groupstarttime:String
           $groupendtime:String
           $groupinstantbooking:Boolean
           $address:ID
           $disciplines: [ID]
           $ptclasssize:ENUM_FITNESSPACKAGES_PTCLASSSIZE
           $classsize:Int
           $groupdays:String
           $fitness_package_type:ID
           $users_permissions_user:ID
           $Status:Boolean
            $is_private:Boolean
        )
        {
            updateFitnesspackage (
                input:{
                     where: {id:$id}
                     data:{
                         packagename:$packagename
                         tags:$tags
                         level:$level
                         aboutpackage:$aboutpackage
                         benefits:$benefits
                         introvideourl:$introvideourl
                         mode:$mode
                         ptoffline:$ptoffline
                         ptonline:$ptonline
                         grouponline:$grouponline
                         groupoffline:$groupoffline
                         recordedclasses:$recordedclasses
                         restdays:$restdays
                         bookingleadday:$bookingleadday
                         fitnesspackagepricing:$fitnesspackagepricing
                         duration:$duration
                         groupstarttime:$groupstarttime
                         groupendtime:$groupendtime
                         groupinstantbooking:$groupinstantbooking
                         address:$address
                         disciplines:$disciplines
                         ptclasssize:$ptclasssize
                         classsize:$classsize
                         groupdays:$groupdays
                         fitness_package_type:$fitness_package_type
                         users_permissions_user:$users_permissions_user
                         Status:$Status
                         is_private:$is_private
                     }
                 }
            )
            {
                fitnesspackage{
                    id
                } 
            }
        }
       
    
`