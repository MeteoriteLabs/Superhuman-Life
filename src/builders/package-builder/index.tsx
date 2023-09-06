import {useState, useContext} from "react";
import { Card, Tab, Tabs } from 'react-bootstrap';
import FitnessTab from './fitness/Fitness';
import { FETCH_USER_INDUSTRY } from './fitness/graphQL/queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from 'components/utils/responseFlatten';
import { AuthContext } from 'builders/session-builder/Fitness/Channel/import';

export default function PackagePage(): JSX.Element {
    const [industryData, setIndustryData] = useState<any[]>([]);
    const auth = useContext(AuthContext);

    useQuery(FETCH_USER_INDUSTRY, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setIndustryData(flattenData.usersPermissionsUser.industries);
        }
    });
    if(industryData)
console.log(industryData);
    return (
        <>
            <h2>Services</h2>
            <Card className="shadow-sm mt-3" border="light">
            
                <Card.Body>
                   
                       <Tabs
                       variant="pills"
                       transition={false}
                       defaultActiveKey={industryData && industryData.length ? industryData[0].IndustryName: ""}
                       className="pb-3 cards"
                       style={{ borderBottom: '1px solid black' }}
                       key={industryData && industryData.length ? industryData[0].IndustryName: ""}
                   >
                     {
                        industryData && industryData.length ? industryData.map((curr) => 
                        <Tab eventKey={curr.IndustryName} title={curr.IndustryName} key={curr.IndustryName}>
                           <FitnessTab industry={curr}/> 
                       </Tab> 
                  
                    
                    ): null}
                     </Tabs>
                </Card.Body>
            </Card>
        </>
    );
}
