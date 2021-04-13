import React, { Suspense } from "react";
import { Jumbotron } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Layout from "./components/layout";

const BookingPage = React.lazy(() => import("./pages/booking"));
const ChatPage = React.lazy(() => import("./pages/chat"));
const ClientPage = React.lazy(() => import("./pages/client"));
const CommunityPage = React.lazy(() => import("./pages/community"));
const HomePage = React.lazy(() => import("./pages/home"));
const LoginPage = React.lazy(() => import("./pages/login"));
const PackagePage = React.lazy(() => import("./pages/pack"));
const ProfilePage = React.lazy(() => import("./pages/profile"));
const SchedulePage = React.lazy(() => import("./pages/schedule"));
const SettingsPage = React.lazy(() => import("./pages/settings"));

const ResFitnessPage = React.lazy(() => import("./pages/res/fitness"));
const ResAddFitnessPage = React.lazy(() => import("./pages/res/fitness/add"));

const KnowledgePage = React.lazy(() => import("./pages/res/knowledge"));
const AddKnowledgePage = React.lazy(() => import("./pages/res/knowledge/add"));

const MindsetPage = React.lazy(() => import("./pages/res/mindset"));
const AddMindsetPage = React.lazy(() => import("./pages/res/mindset/add"));

const MessagePage = React.lazy(() => import("./pages/res/message"));
const AddMessagePage = React.lazy(() => import("./pages/res/message/add"));

const ResNutritionPage = React.lazy(() => import("./pages/res/nutrition"));
const ResAddNutritionPage = React.lazy(() => import("./pages/res/nutrition/add"));

function NoMatch() {
  const location = useLocation();

  return (
    <Jumbotron>
      <h3>Error 404</h3>
      <p>
        No match for <code>{location.pathname}</code>
      </p>
    </Jumbotron>
  );
}

export default function Routes({ isAuthenticated }) {
  return (
    <Router>
      {isAuthenticated ? (
        <Suspense fallback={<code>Loading...</code>}>
          <Layout>
            <Switch>
              <Redirect exact from="/" to="/home" />
              <Redirect exact from="/login" to="/home" />
              <Route path="/bookings" component={BookingPage} />
              <Route path="/chats" component={ChatPage} />
              <Route path="/clients" component={ClientPage} />
              <Route path="/community" component={CommunityPage} />
              <Route path="/home" component={HomePage} />
              <Route path="/packages" component={PackagePage} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/schedule" component={SchedulePage} />
              <Route path="/settings" component={SettingsPage} />

              <Route exact path="/resources/fitness" component={ResFitnessPage} />
              <Route exact path="/resources/fitness/add" component={ResAddFitnessPage} />
              <Route exact path="/resources/knowledge" component={KnowledgePage} />
              <Route exact path="/resources/knowledge/add" component={AddKnowledgePage} />
              <Route exact path="/resources/mindset" component={MindsetPage} />
              <Route exact path="/resources/mindset/add" component={AddMindsetPage} />
              <Route exact path="/resources/messages" component={MessagePage} />
              <Route exact path="/resources/messages/add" component={AddMessagePage} />
              <Route exact path="/resources/nutrition" component={ResNutritionPage} />
              <Route exact path="/resources/nutrition/add" component={ResAddNutritionPage} />

              <Route path="*" component={NoMatch} />
            </Switch>
          </Layout>
        </Suspense>
      ) : (
        <Suspense fallback={<code>Loading...</code>}>
          <Switch>
            <Redirect exact from="/" to="/login" />
            <Redirect exact from="/home" to="/login" />
            <Route path="/login" component={LoginPage} />
            <Route path="*" component={NoMatch} />
          </Switch>
        </Suspense>
      )}
    </Router>
  );
}
