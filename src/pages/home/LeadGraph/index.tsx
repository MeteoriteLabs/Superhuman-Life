import { useContext, useState } from 'react';
import BarGraph from 'components/Graphs/BarGraph/BarGraph';
import { useQuery } from '@apollo/client';
import { GET_LEADS } from './queries';
import AuthContext from 'context/auth-context';
import { flattenObj } from 'components/utils/responseFlatten';
import moment from 'moment';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import WeeklyLeadsGraph from './WeeklyLeadsGraph';
import '../Styles/navTabStyles.css';

function LeadGraph(): JSX.Element {
    const [leadsData, setLeadData] = useState<{ index: string; Leads: number }[]>([]);
    const auth = useContext(AuthContext);

    useQuery(GET_LEADS, {
        variables: {
            id: Number(auth.userid),
            startDateTime: moment().subtract(1, 'years').format(),
            endDateTime: moment().format()
        },
        onCompleted: (data) => {
            loadData(data);
        }
    });

    const loadData = (data) => {
        const flattenLeadsData = flattenObj({ ...data.websiteContactForms });

        const arr: { index: string; Leads: number }[] = [];

        for (let month = 0; month < 12; month++) {
            const currentMonth = moment().subtract(month, 'months');
            arr[month] = {
                index: `${currentMonth.format('MMM YY')}`,
                Leads: flattenLeadsData.filter(
                    (currentValue) =>
                        moment(currentValue.createdAt).format('MM/YY') ===
                        currentMonth.format('MM/YY')
                ).length
            };
        }

        setLeadData(arr.reverse());
    };

    return (
        <>
            <Tabs defaultActiveKey="monthly">
                <Tab eventKey="monthly" title="Monthly">
                    <Row>
                        <Col style={{ overflowX: 'auto' }}>
                            <BarGraph data={leadsData} yAxis={'No. of Leads'} keyName={['Leads']} />
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                    <WeeklyLeadsGraph />
                </Tab>
            </Tabs>
        </>
    );
}

export default LeadGraph;
