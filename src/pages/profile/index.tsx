import { useState } from "react";
<<<<<<< HEAD
import { Tabs, Tab, Container } from "react-bootstrap";
// import ChangePasswordPage from '../changePassword';
import ProfileCard from "./ProfileOptions/ProfileCard";
// import ProfileNavTab from "./ProfileOptions/ProfileNavTab";
import ChangemakersSettings from "./ChangemakersSettings";
import OrganisationsSettings from "./OrganisationsSettings";
=======
import { Tabs, Tab } from "react-bootstrap";
import ChangePasswordPage from '../changePassword';
import ProfileCard from "./ProfileOptions/ProfileCard";
import ProfileNavTab from "./ProfileOptions/ProfileNavTab";
>>>>>>> master
import "./profile.css";

export default function ProfilePage() {
  const [key, setKey] = useState("profile");

  return (

    <Tabs
      id="controlled-tab"
      activeKey={key}
      onSelect={(k: any) => setKey(k)}
      className="mb-3 mt-5 d-flex justify-content-center"
    >
      <Tab eventKey="profile" title="Profile">
        <ProfileCard />
<<<<<<< HEAD
        <Container fluid>
          {/* <ProfileNavTab /> */}
        </Container>
      </Tab>

      <Tab eventKey="changemakerssettings" title="Changemaker Settings">
        <ChangemakersSettings/>
      </Tab>

      <Tab eventKey="organisationssettings" title="Organisations Settings">
        <OrganisationsSettings/>
=======
        {/* <Container fluid> */}
          <ProfileNavTab />
        {/* </Container> */}
      </Tab>

      <Tab eventKey="collaborations" title="Collaborations">
        Collaborations
>>>>>>> master
      </Tab>

      <Tab eventKey="myclientapp" title=" My Client App">
        My Client App
      </Tab>

<<<<<<< HEAD
      {/* <Tab eventKey="password" title="Password">
        <ChangePasswordPage />
      </Tab> */}
=======
      <Tab eventKey="settings" title="Settings">
        Settings
      </Tab>

      <Tab eventKey="password" title="Password">
        <ChangePasswordPage />
      </Tab>
>>>>>>> master
    </Tabs>

  );
}
