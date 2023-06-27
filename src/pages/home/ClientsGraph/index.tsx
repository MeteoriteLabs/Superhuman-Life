import { Tab, Tabs } from 'react-bootstrap'
import MonthlyClientGraph from './MonthlyClientGraph'
import WeeklyClientGraph from './WeeklyClientGraph'
import '../Styles/navTabStyles.css'

function ClientsGraph() {
    return (
        <div>
            <Tabs defaultActiveKey="monthly">
                <Tab eventKey="monthly" title="Monthly">
                    <MonthlyClientGraph />
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                    <WeeklyClientGraph />
                </Tab>
            </Tabs>
        </div>
    )
}

export default ClientsGraph
