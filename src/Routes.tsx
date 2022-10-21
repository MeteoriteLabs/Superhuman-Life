import React, { Suspense } from "react";
import {
     BrowserRouter as Router,
     Redirect,
     Route,
     Switch,
     useLocation,
} from "react-router-dom";
import Layout from "./components/layout";

const MainLobby = React.lazy(() => import("./pages/dashboard"));
const WebsiteBuilder = React.lazy(() => import("./pages/website-builder"));
const BookingPage = React.lazy(() => import("./pages/booking"));
const BookingSetting = React.lazy(
     () => import("./pages/booking/BookingSetting/BookingSetting")
);
const ChatPage = React.lazy(() => import("./pages/chat"));

const HomePage = React.lazy(() => import("./pages/home"));
const LoginPage = React.lazy(() => import("./pages/login"));
const DeactiveAccountPage = React.lazy(() => import("./pages/DeactiveAccount"));
const ForgotPasswordPage = React.lazy(() => import("./pages/forgotPassword"));
const ResetPasswordPage = React.lazy(() => import('./pages/resetPassword'));
const ConfirmAccountPage = React.lazy(() => import("./pages/emailConfirmation"));
const ChangePasswordPage = React.lazy(() => import("./pages/changePassword"));
const ProfilePage = React.lazy(() => import("./pages/profile"));
const RegisterPage = React.lazy(() => import("./pages/register"));
const SchedulePage = React.lazy(() => import("./pages/schedule"));
const SettingsPage = React.lazy(() => import("./pages/settings"));
const AboutPage = React.lazy(() => import("./pages/about"));
const ContactPage = React.lazy(() => import("./pages/contact"));
const FQAsPage = React.lazy(() => import("./pages/faqs"));
const FinancePage = React.lazy(() => import("./pages/finance"))

const ClientHomePage = React.lazy(() => import("./builders/client-builder/clientlisting/client"));
const PackagePage = React.lazy(() => import("./builders/package-builder"));
const ResourcePage = React.lazy(() => import("./builders/resource-builder"));
const ProgramPage = React.lazy(() => import("./builders/program-builder"));
const ClientPage = React.lazy(() => import("./builders/client-builder"));
const ProgramManagerPage = React.lazy(() => import("./builders/program-builder/program-template"));
const ClassicProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/Classic/scheduler"));
const PTProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/PT/scheduler"));
const GroupProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/Group/scheduler"));
const CustomProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/Custom/scheduler"));
const CohortProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/Cohort/scheduler"));
const ChannelProgramSchedulerPage = React.lazy(() => import("./builders/session-builder/Fitness/Channel/scheduler"));
const clientSchedulerPage = React.lazy(() => import("./builders/changemaker-builder"));
const AvailabilityPage = React.lazy(() => import("./builders/changemaker-builder/availability"));
const RosterPage = React.lazy(() => import('./builders/changemaker-builder/roster'));
const Receipt = React.lazy(() => import('./pages/finance/Outflow/Receipt'));
const AddPayee = React.lazy(() => import('./pages/finance/Payee/AddPayee'));
const PayeeDetails = React.lazy(() => import('./pages/finance/Outflow/PayeeDetails/PayeeDetails'));
const PayeePaymentMode = React.lazy(() => import('./pages/finance/Outflow/PayeePaymentMode/PayeePaymentMode'));
const CloseAccount = React.lazy(() => import('./pages/finance/Outflow/CloseAccount/CloseAccount'));
const ViewAddPayee = React.lazy(() => import('./pages/finance/Outflow/ViewAddPayee'));

//auth logins
const GoogleAuthCallbackPage = React.lazy(() => import("./pages/register/oAuthLogins/googleAuthCallback"));

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

function NoAuthRedirect() {
     return <Redirect to="/login" />
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
                                   <Redirect exact from="/" to="/lobby" />
                                   <Redirect exact from="/login" to="/lobby" />
                                   <Route path="/lobby" component={MainLobby} />
                                   <Route path="/website" component={WebsiteBuilder} />
                                   <Route path="/bookings" component={BookingPage} />
                                   <Route exact path="/bookingSettings" component={BookingSetting} />
                                   <Route path="/chats" component={ChatPage} />
                                   <Route path="/clients" component={ClientPage} />
                                   <Route path="/client/home" component={ClientHomePage} />
                                   <Route path="/home" component={HomePage} />
                                   <Route exact path="/offerings" component={PackagePage} />
                                   <Route exact path="/resources" component={ProgramPage} />
                                   <Route exact path="/session" component={SessionPage} />
                                   {/* please do not change the below route /programs/manage!!! It is a very important route for program templates, any change could break the code. */}
                                   <Route path="/programs/manage" component={ProgramManagerPage} />
                                   <Route path="/classic/session/scheduler" component={ClassicProgramSchedulerPage} />
                                   <Route path="/pt/session/scheduler" component={PTProgramSchedulerPage} />
                                   <Route path="/group/session/scheduler" component={GroupProgramSchedulerPage} />
                                   <Route path="/custom/session/scheduler" component={CustomProgramSchedulerPage} />
                                   <Route path="/cohort/session/scheduler" component={CohortProgramSchedulerPage} />
                                   <Route path="/channel/session/scheduler" component={ChannelProgramSchedulerPage} />
                                   <Route path="/schedule" component={clientSchedulerPage} />
                                   <Route path="/availability" component={AvailabilityPage} />
                                   <Route path="/roster" component={RosterPage} />
                                   <Route path="/profile" component={ProfilePage} />
                                   <Route path="/communication" component={ResourcePage} />
                                   <Route path="/schedule" component={SchedulePage} />
                                   <Route path="/settings" component={SettingsPage} />
                                   <Route path="/finance" component={FinancePage} />
                                   <Route path="/change-password" component={ChangePasswordPage} />
                                   <Route path="/receipt" component={Receipt} />
                                   <Route path="/add_payee" component={AddPayee} />
                                   <Route path="/payee_details" component={PayeeDetails} />
                                   <Route path="/payee_payment_mode" component={PayeePaymentMode} />
                                   <Route path="/close_account" component={CloseAccount} />
                                   <Route path="/view_add_payee" component={ViewAddPayee} />

                                   <Route path="*" component={NoMatch} />
                              </Switch>
                         </Suspense>
                    ) : (
                         <Suspense fallback={<code>Loading...</code>}>
                              <Switch>
                                   <Redirect exact from="/" to="/login" />
                                   <Redirect exact from="/home" to="/login" />
                                   <Route path="/login" component={LoginPage} />
                                   <Route path="/forgot-password" component={ForgotPasswordPage} />
                                   <Route path="/resetpassword" component={ResetPasswordPage} />
                                   <Route path="/confirm-account" component={ConfirmAccountPage} />
                                   <Route path="/api/auth/google/callback" component={GoogleAuthCallbackPage} />
                                   <Route path="/register" component={RegisterPage} />
                                   <Route path="/about" component={AboutPage} />
                                   <Route path="/contact" component={ContactPage} />
                                   <Route path="/faqs" component={FQAsPage} />
                                   <Route path="/deactiveaccount" component={DeactiveAccountPage} />
                                   <Route path="*" component={NoAuthRedirect} />
                              </Switch>
                         </Suspense>
                    )}
               </Layout>
          </Router>
     );
}
