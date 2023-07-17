import { useContext, useState } from 'react';
import BarGraph from 'components/Graphs/BarGraph/BarGraph';
import { useQuery } from '@apollo/client';
import { GET_LEADS } from '../LeadGraph/queries';
import AuthContext from 'context/auth-context';
import { flattenObj } from 'components/utils/responseFlatten';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

function WeeklyLeadsGraph(): JSX.Element {
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

        for (let weekDay = 0; weekDay < 7; weekDay++) {
            const currentDay = moment().subtract(weekDay, 'days');
            arr[weekDay] = {
                index: `${currentDay.format('ddd,')} ${moment()
                    .subtract(weekDay, 'days')
                    .format('DD/MMM')}`,
                Leads: flattenLeadsData.filter(
                    (currentValue) =>
                        moment.utc(currentValue.createdAt).format('DD/MM/YYYY') ===
                        currentDay.format('DD/MM/YYYY')
                ).length
            };
        }

        setLeadData(arr.reverse());
    };

    return (
        <Row>
            <Col style={{ overflowX: 'auto' }}>
                <BarGraph data={leadsData} yAxis={'No. of Leads'} keyName={['Leads']} />
            </Col>
        </Row>
    );
}

export default WeeklyLeadsGraph;
