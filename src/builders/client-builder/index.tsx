import { Card, Tab, Tabs, TabContent } from "react-bootstrap";
import ClientListing from "./clientlisting";
import Leads from "./leads/index";
import Contacts from "./contacts/index";

export default function ClientPage() {
  return (
    <>
      <h2>Clients</h2>
      <Card className="shadow-sm mt-3" border="light">
        <Card.Body>
          <Tabs variant="pills" transition={false} defaultActiveKey="clients" className="pb-3 cards">
            <Tab eventKey="clients" title="Client">
              <TabContent>
                <hr />
                <ClientListing />
              </TabContent>
            </Tab>
            <Tab eventKey="leads" title="Leads">
              <TabContent>
                <hr />
                <Leads />
              </TabContent>
            </Tab>
            <Tab eventKey="contacts" title="Contacts">
              <TabContent>
                <hr />
                <Contacts />
              </TabContent>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </>
  );
}
