import React, { useContext, useState } from 'react';
import LineGraph from '../../../components/Graphs/LineGraph/LineGraph';
import { useQuery } from '@apollo/client';
import { GET_CLIENTS } from './queries';
import AuthContext from '../../../context/auth-context';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

interface ArrayType {
    x: string;
    y: number;
}

const WeeklySalesGraph: React.FC = () => {
    const [clientsData, setClientsData] = useState<
        { id: string; color: string; data: ArrayType[] }[]
    >([]);
    const auth = useContext(AuthContext);

    useQuery(GET_CLIENTS, {
        variables: {
            id: Number(auth.userid),
            startDateTime: moment().subtract(1, 'years').format(),
            endDateTime: moment().format()
        },
        onCompleted: (response) => {
            loadData(response);
        }
    });

    const loadData = (data) => {
        const flattenClientsData = flattenObj({ ...data.clientPackages });

        const arr: ArrayType[] = [];
        const initialValue = 0;

        for (let weekDay = 0; weekDay < 7; weekDay++) {
            const currentDay = moment().subtract(weekDay, 'days');

            const sales = flattenClientsData.filter(
                (currentValue) =>
                    moment(currentValue.accepted_date).format('DD/MM/YY') ===
                    currentDay.format('DD/MM/YY')
            );

            arr[weekDay] = {
                x: `${currentDay.format('ddd,')} ${currentDay.format('DD/MMM')}`,
                y: sales.reduce(
                    (accumulator, currentValue) => accumulator + currentValue.PackageMRP,
                    initialValue
                )
            };
        }

        setClientsData([{ id: 'Sales', color: 'hsl(241, 100%, 0%)', data: arr.reverse() }]);
    };

    return (
        <Row>
            <Col style={{ overflowX: 'auto' }}>
                <LineGraph data={clientsData} yAxis={'Sales (INR)'} />
            </Col>
        </Row>
    );
};

export default WeeklySalesGraph;
