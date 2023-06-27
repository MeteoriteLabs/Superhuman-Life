import React, { useState } from 'react'
import { Tabs, Tab, Card } from 'react-bootstrap'
import BasicProfileForm from '../BasicProfileForm'
import AddressDetails from '../AddressDetails'
import EducationDetails from '../EducationDetails'
import SocialAccount from '../SocialAccount'
import AccountVerification from '../AccountVerification'

const ProfileNavTab: React.FC = () => {
    const [key, setKey] = useState('basicprofile')

    return (
        <Card className="shadow-sm mt-2" border="light">
            <Card.Body>
                <Tabs
                    variant="pills"
                    transition={false}
                    id="controlled-tab"
                    activeKey={key}
                    // eslint-disable-next-line
                    onSelect={(k: any) => setKey(k)}
                    className="mb-3 d-flex justify-content-center mt-5 "
                >
                    <Tab eventKey="basicprofile" title="Basic Profile">
                        <BasicProfileForm />
                    </Tab>
                    <Tab eventKey="education" title="Education">
                        <EducationDetails />
                    </Tab>
                    <Tab eventKey="addresses" title="Addresses">
                        <AddressDetails />
                    </Tab>
                    <Tab eventKey="socialaccounts" title="Social Accounts">
                        <SocialAccount />
                    </Tab>
                    <Tab eventKey="verification" title="Verification">
                        <AccountVerification />
                    </Tab>
                </Tabs>
            </Card.Body>
        </Card>
    )
}

export default ProfileNavTab
