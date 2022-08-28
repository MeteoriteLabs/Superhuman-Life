import { useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import ChangePasswordPage from '../changePassword';
import ProfileCard from "./ProfileOptions/ProfileCard";
import ProfileNavTab from "./ProfileOptions/ProfileNavTab";
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
        <Container fluid>
          <ProfileNavTab />
        </Container>
      </Tab>

      <Tab eventKey="collaborations" title="Collaborations">
        Collaborations
      </Tab>

      <Tab eventKey="myclientapp" title=" My Client App">
        My Client App
      </Tab>

      <Tab eventKey="settings" title="Settings">
        Settings
      </Tab>

      <Tab eventKey="password" title="Password">
        <ChangePasswordPage />
      </Tab>
    </Tabs>

  );
}
