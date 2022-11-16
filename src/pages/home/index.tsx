import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function HomePage() {
  const history = useHistory();

  const redirectToClients = () => {
    let path = "/clients";
    history.push(path);
  };

  const redirectToFinance = () => {
    let path = "/finance";
    history.push(path);
  };

  return (
    <div className="col-lg-12">
      <h3>Home</h3>
      <hr />

      <Button
        variant="outline-secondary"
        className="mr-2"
        onClick={redirectToClients}
      >
        <img src="assets/home_page_images/contacts.svg" alt="add_client"/> Add Client
      </Button>

      <Button
        variant="outline-secondary"
        className="mr-2 "
        onClick={redirectToClients}
      >
        <img src="assets/home_page_images/add_lead.svg" alt="add_lead"/> Add Lead
      </Button>

      <Button
        variant="outline-secondary"
        className="mr-2"
        onClick={redirectToClients}
      >
        <img src="assets/home_page_images/add_contact.svg" alt="add_contact"/> Add Contacts
      </Button>

      <Button
        variant="outline-secondary"
        className="mr-2"
        onClick={redirectToFinance}
      >
        <img src="assets/home_page_images/rupee.svg" alt="paymentLink"/> Payment Link
      </Button>
    </div>
  );
}
