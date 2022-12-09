import { useRef } from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import CreateEditMessage from "../../builders/client-builder/leads/createoredit-leads";
import CreateEditContact from "../../builders/client-builder/contacts/createEditContact";
import CreateClient from "../../builders/client-builder/clientlisting/addclientcomponent";
import Grid from "./grid";
import "./grid.css";
import GraphSelector from "./GraphSelector";

export default function HomePage() {
  const createEditMessageComponent = useRef<any>(null);
  const createEditContactComponent = useRef<any>(null);
  const CreateClientComponent = useRef<any>(null);
  const history = useHistory();

  const redirectToFinance = () => {
    let path = "/finance";
    history.push(path);
  };

  return (
    <div className="col-lg-12">
      <h2>Home</h2>
      <hr />

      {/* Add Client */}
      <Button
        className="m-2"
        variant={true ? "outline-dark" : "light"}
        size="sm"
        onClick={() => {
          CreateClientComponent.current.TriggerForm({
            id: null,
            type: "create",
            modal_status: true,
          });
        }}
      >
        <img src="assets/home_page_images/contacts.svg" alt="add_client" /> Add
        Client
      </Button>
      <CreateClient ref={CreateClientComponent} />

      {/* Add Lead */}
      <Button
        className="mr-2 "
        variant={true ? "outline-dark" : "light"}
        size="sm"
        onClick={() => {
          createEditMessageComponent.current.TriggerForm({
            id: null,
            type: "create",
            modal_status: true,
          });
        }}
      >
        <img src="assets/home_page_images/add_lead.svg" alt="add_lead" /> Add
        Lead
      </Button>
      <CreateEditMessage ref={createEditMessageComponent} />

      {/* Add Contact */}
      <Button
        className="mr-2"
        variant={true ? "outline-dark" : "light"}
        size="sm"
        onClick={() => {
          createEditContactComponent.current.TriggerForm({
            id: null,
            type: "create",
            modal_status: true,
          });
        }}
      >
        <img src="assets/home_page_images/add_contact.svg" alt="add_contact" />{" "}
        Add Contacts
      </Button>
      <CreateEditContact ref={createEditContactComponent} />

      {/* Payment Link */}
      <Button
        variant="outline-dark"
        className="mr-2"
        size="sm"
        onClick={redirectToFinance}
      >
        <img src="assets/home_page_images/rupee.svg" alt="paymentLink" />{" "}
        Payment Link
      </Button>

      {/* grid */}
      <div className="mb-5">
        <Grid />
      </div>
      <GraphSelector/>
    </div>
  );
}
