import React, { useState } from "react";
import { Tabs, Card, Tab } from "react-bootstrap";
import ProfileCard from "./ProfileOptions/ProfileCard";
import ProfileNavTab from "./ProfileOptions/ProfileNavTab";
import ChangemakersSettings from "./ChangemakersSettings";
// import OrganisationsSettings from "./OrganisationsSettings";
import "./profile.css";

const ProfilePage: React.FC = () => {
  const [key, setKey] = useState<string>("profile");

  return (
    <Card className="shadow-sm mt-2" border="light">
      <Card.Body>
        <Tabs
          style={{ borderBottom: "1px solid black" }}
          variant="pills"
          transition={false}
          id="controlled-tab"
          activeKey={key}
          onSelect={(key: string|null) => key && setKey(key)}
          className="mb-3 mt-5 d-flex justify-content-center"
        >
          <Tab eventKey="profile" title="Profile">
            <ProfileCard />
            <ProfileNavTab />
          </Tab>

          <Tab eventKey="accountssettings" title="Account Settings">
            <ChangemakersSettings />
          </Tab>

          {/* <Tab eventKey="organisationssettings" title="Organisations Settings">
            <OrganisationsSettings />
          </Tab> */}

          {/* <Tab eventKey="myclientapp" title=" My Client App">
            My Client App
          </Tab> */}
        </Tabs>
      </Card.Body>
    </Card>
  );
}

export default ProfilePage;