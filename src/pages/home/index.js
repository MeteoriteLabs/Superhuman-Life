import { Alert, Card, CardColumns } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function HomePage() {
  const shortcuts = [
    {
      icon: <i className="fas fa-user-plus"></i>,
      text: "Add Client",
    },
    {
      icon: <i className="far fa-lightbulb"></i>,
      text: "My Insights",
    },
    {
      icon: <i className="fas fa-rocket"></i>,
      text: "My Resources",
    },
    {
      icon: <i className="fas fa-tasks"></i>,
      text: "My Tasks",
    },
    {
      icon: <i className="fas fa-tools"></i>,
      text: "Services/Packages",
    },
    {
      icon: <i className="fas fa-inbox"></i>,
      text: "Community",
    },
    {
      icon: <i className="fab fa-hive"></i>,
      text: "Network Community",
    },
  ];

  return (
    <>
      <h4>Dashboard</h4>
      <Alert variant="primary" className="mt-5">
        This website is under active development!
      </Alert>
      <CardColumns>
        {shortcuts &&
          shortcuts.map((shortcut, id) => (
            <Card key={id} className="text-center mx-2 my-2">
              <Card.Body>
                <Link to="/">{shortcut.icon}</Link>
                <hr />
                <Card.Text className="text-muted">{shortcut.text}</Card.Text>
              </Card.Body>
            </Card>
          ))}
      </CardColumns>
    </>
  );
}
