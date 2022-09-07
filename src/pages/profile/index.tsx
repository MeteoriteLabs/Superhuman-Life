import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import ProfileCard from "./ProfileOptions/ProfileCard";
import ProfileNavTab from "./ProfileOptions/ProfileNavTab";
import ChangemakersSettings from "./ChangemakersSettings";
import OrganisationsSettings from "./OrganisationsSettings";
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
          <ProfileNavTab />
      </Tab>

      <Tab eventKey="changemakerssettings" title="Changemaker Settings">
        <ChangemakersSettings/>
      </Tab>

      <Tab eventKey="organisationssettings" title="Organisations Settings">
        <OrganisationsSettings/>
      </Tab>

      <Tab eventKey="myclientapp" title=" My Client App">
        My Client App
      </Tab>
    </Tabs>

  );
}
