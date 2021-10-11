import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout";

const BookingPage = React.lazy(() => import("./pages/booking"));
const BookingSetting = React.lazy(() => import("./pages/booking/BookingSetting/BookingSetting"));
const ChatPage = React.lazy(() => import("./pages/chat"));
const ClientPage = React.lazy(() => import("./pages/client"));
const HomePage = React.lazy(() => import("./pages/home"));
const LoginPage = React.lazy(() => import("./pages/login"));
const ProfilePage = React.lazy(() => import("./pages/profile"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const SchedulePage = React.lazy(() => import("./pages/schedule"));
const SettingsPage = React.lazy(() => import("./pages/settings"));
const AboutPage = React.lazy(() => import("./pages/about"));
const ContactPage = React.lazy(() => import("./pages/contact"));
const FQAsPage = React.lazy(() => import("./pages/faqs"));

const PackagePage = React.lazy(() => import("./builders/package-builder"));
const ResourcePage = React.lazy(() => import("./builders/resource-builder"));
const ProgramPage = React.lazy(() => import("./builders/program-builder"));
const ProgramManagerPage = React.lazy(() => import("./builders/program-builder/program-template"));

const SessionPage = React.lazy(() => import("./builders/session-builder/"));

function NoMatch() {
  const location = useLocation();

  return (
    <div>
      <h3>Error 404</h3>
      <p>
        No match for <code>{location.pathname}</code>
      </p>
    </div>
  );
}

export default function Routes({ token }: any) {
  return (
    <Router>
      <Layout token={token}>
        {token ? (
          <Suspense fallback={<code>Loading...</code>}>
            {/* <Helmet>
              <meta charSet="utf-8" />
              <title>Sapien Dashboard | Dashboard</title>
              <link rel="canonical" href="https://sapien.systems/" />
            </Helmet> */}

            <Switch>
              <Redirect exact from="/" to="/home" />
              <Redirect exact from="/login" to="/home" />
              <Route path="/bookings" component={BookingPage} />
              <Route exact path="/bookingSettings" component={BookingSetting} />
              <Route path="/chats" component={ChatPage} />
              <Route path="/clients" component={ClientPage} />
              <Route path="/home" component={HomePage} />
              <Route exact path="/packages" component={PackagePage} />
              <Route exact path="/programs" component={ProgramPage} />
              <Route exact path="/session" component={SessionPage} />
              <Route path="/programs/manage" component={ProgramManagerPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/resources" component={ResourcePage} />
              <Route path="/schedule" component={SchedulePage} />
              <Route path="/settings" component={SettingsPage} />

              <Route path="*" component={NoMatch} />
            </Switch>
          </Suspense>
        ) : (
          <Suspense fallback={<code>Loading...</code>}>
            <Switch>
              <Redirect exact from="/" to="/login" />
              <Redirect exact from="/home" to="/login" />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/about" component={AboutPage} />
              <Route path="/contact" component={ContactPage} />
              <Route path="/faqs" component={FQAsPage} />
              <Route path="*" component={NoMatch} />
            </Switch>
          </Suspense>
        )}
      </Layout>
    </Router>
  );
}
