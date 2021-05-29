import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Card, CardDeck } from "react-bootstrap";

export default function HomePage() {
  const shortcuts = [
    {
      icon: <i className="fas fa-user-plus"></i>,
      link: "/clients",
      text: "Add Client",
    },
    {
      icon: <i className="far fa-lightbulb"></i>,
      link: "/insights",
      text: "My Insights",
    },
    {
      icon: <i className="fas fa-rocket"></i>,
      link: "/resources",
      text: "My Resources",
    },
    {
      icon: <i className="fas fa-tasks"></i>,
      link: "/tasks",
      text: "My Tasks",
    },
    {
      icon: <i className="fas fa-tools"></i>,
      link: "/packages",
      text: "Packages",
    },
    {
      icon: <i className="fas fa-inbox"></i>,
      link: "/community",
      text: "Community",
    },
    {
      icon: <i className="fab fa-hive"></i>,
      link: "/",
      text: "Network Community",
    },
  ];

  return (
    <>
      <h3>Dashboard</h3>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Dashboard</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet>
      <hr />
      <CardDeck>
        {shortcuts &&
          shortcuts.map((shortcut, id) => (
            <Card key={id} className="shadow-sm text-center" border="light">
              <Card.Body>
                <Link to={shortcut.link}>{shortcut.icon}</Link>
                <hr />
                <Card.Text className="text-muted">{shortcut.text}</Card.Text>
              </Card.Body>
            </Card>
          ))}
      </CardDeck>
    </>
  );
}
