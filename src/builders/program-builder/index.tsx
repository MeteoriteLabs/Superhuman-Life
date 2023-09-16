import { Card, Tab, Tabs } from 'react-bootstrap';
import {useState, useContext} from "react";
import { FETCH_USER_INDUSTRY } from '../package-builder/fitness/graphQL/queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';
import FitnessTab from './fitness';

export default function ProgramPage(): JSX.Element {
    const [industryData, setIndustryData] = useState<any[]>([]);
    const auth = useContext(AuthContext);

    useQuery(FETCH_USER_INDUSTRY, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setIndustryData(flattenData.usersPermissionsUser.industries);
        }
    });

    return (
        <>
            <h2>Library</h2>
            <Card className="shadow-sm mt-3" border="light">
                <Card.Body>
                    <Tabs
                        style={{ borderBottom: '1px solid black' }}
                        className="pb-3 cards"
                        variant="pills"
                        transition={false}
                        // defaultActiveKey="fitness"
                        key={industryData && industryData.length ? industryData[0].IndustryName: ""}
                        defaultActiveKey={industryData && industryData.length ? industryData[0].IndustryName: ""}
                    >
                         {
                        industryData && industryData.length ? industryData.map((curr) => 
                        <Tab eventKey={curr.IndustryName} title={curr.IndustryName} key={curr.IndustryName}>
                           <FitnessTab industry={curr}/> 
                       </Tab> 
                  
                    
                    ): null}
                        {/* <Tab eventKey="fitness" title="Fitness">
                            <FitnessTab />
                        </Tab> */}
                      
                    </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}



// import React from 'react';
// import { Card, Tab, Tabs } from 'react-bootstrap';
// import Fitness from './Fitness/Fitness';
// import {useState, useContext} from "react";
// import { FETCH_USER_INDUSTRY } from '../package-builder/fitness/graphQL/queries';
// import { useQuery } from '@apollo/client';
// import { flattenObj } from 'components/utils/responseFlatten';
// import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';

// const SessionPage: React.FC = () => {
//     const [industryData, setIndustryData] = useState<any[]>([]);
//     const auth = useContext(AuthContext);

//     useQuery(FETCH_USER_INDUSTRY, {
//         variables: { id: auth.userid },
//         onCompleted: (response) => {
//             const flattenData = flattenObj({ ...response });
//             setIndustryData(flattenData.usersPermissionsUser.industries);
//         }
//     });

//     return (
//         <div>
//             <h2>Program Manager</h2>

//             <Card className="shadow-sm mt-3" border="light">
//                 <Card.Body>
//                     <Tabs
//                         className="pb-3 cards"
//                         variant="pills"
//                         transition={false}
//                         key={industryData && industryData.length ? industryData[0].IndustryName: ""}
//                         defaultActiveKey={industryData && industryData.length ? industryData[0].IndustryName: ""}
//                     >
//                          {
//                         industryData && industryData.length ? industryData.map((curr) => 
//                         <Tab eventKey={curr.IndustryName} title={curr.IndustryName} key={curr.IndustryName}>
//                            <Fitness industry={curr}/> 
//                        </Tab> 
                  
                    
//                     ): null}
//                     </Tabs>
//                 </Card.Body>
//             </Card>
//         </div>
//     );
// };

// export default SessionPage;

