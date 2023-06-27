import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from './queries';
import AuthContext from '../../../context/auth-context';
import { flattenObj } from '../../../components/utils/responseFlatten';
import moment from 'moment';
import LineGraph from '../../../components/Graphs/LineGraph/LineGraph';
import { Row, Col } from 'react-bootstrap';

interface ArrayType {
    x: string;
    y: number;
}

const MonthlyOfferingBookingGraph: React.FC = () => {
    const [clientsData, setClientsData] = useState<
        { id: string; color: string; data: ArrayType[] }[]
    >([]);
    const auth = useContext(AuthContext);

    useQuery(GET_BOOKINGS, {
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
        const flattenClientsData = flattenObj({ ...data.clientBookings });

        const arr: ArrayType[] = [];

        for (let month = 0; month < 12; month++) {
            const currentMonth = moment().subtract(month, 'months');
            arr[month] = {
                x: `${currentMonth.format('MMM YY')}`,
                y: flattenClientsData.filter(
                    (currentValue) =>
                        moment(currentValue.booking_date).format('MM/YY') ===
                        currentMonth.format('MM/YY')
                ).length
            };
        }

        setClientsData([{ id: 'Clients', color: 'hsl(241, 100%, 0%)', data: arr.reverse() }]);
    };

    return (
        <Row>
            <Col style={{ overflowX: 'auto' }}>
                <LineGraph data={clientsData} yAxis={'No. of Bookings'} />
            </Col>
        </Row>
    );
};

export default MonthlyOfferingBookingGraph;
