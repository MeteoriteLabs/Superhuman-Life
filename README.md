# Superhuman Life: Changemaker Dashboard

Superhuman Life (formerly "Sapien") is an open-source dashboard for changemakers, creators, and community managers to launch branded experiences, manage members, and run daily operations without writing code. The project bundles website builders, booking flows, CRM-style modules, community engagement tools, and analytics into a single React + GraphQL application that you can self-host or deploy to your preferred cloud provider.

## Table of Contents
- [Project Vision](#project-vision)
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Run the App](#run-the-app)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Quality Gates](#quality-gates)
- [Deployment Notes](#deployment-notes)
- [Contributing](#contributing)
- [Community and Support](#community-and-support)
- [Security](#security)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Project Vision
Superhuman Life empowers mission-driven teams to:
- Launch and customise branded portals for their audience.
- Coordinate schedules, bookings, and client success workflows.
- Build community with in-product chat, notifications, and content feeds.
- Measure performance through finance and analytics dashboards.

By open-sourcing the dashboard we welcome contributors to extend the platform with new modules, integrations, localisation support, and deployment targets.

## Key Features
- **Dashboard Home** – Aggregated metrics, quick links, and a mini lobby to surface important announcements (`src/pages/dashboard`).
- **Website & Page Builder** – Drag-and-drop components, content blocks, and live preview tooling for building landing pages (`src/pages/website-builder`, `src/pages/liveEditor`).
- **Booking & Scheduling** – Client booking flows, availability calendars, and automated confirmation pages (`src/pages/booking`, `src/pages/schedule`, `src/pages/SuccessfulBooking`).
- **Community & Communication** – Chat experiences, notifications, and email confirmation utilities (`src/pages/chat`, `src/pages/notificationSettings`, `src/pages/emailConfirmation`).
- **Finance & Operations** – Payment link management, UPI/QR integrations, and finance dashboards (`src/pages/finance`, `src/components/utils/integration.tsx`).
- **Profile & Settings** – User profile editing, security settings, and account lifecycle flows (`src/pages/profile`, `src/pages/settings`, `src/pages/DeleteAccountConfirmation`).
- **Media & Asset Management** – S3-based uploads, PDF viewers, and image cropping utilities (`src/components/upload`, `src/components/DisplayImage`).

## Architecture Overview
The application is a single-page React app written in TypeScript. Core architectural highlights include:
- **Client-side routing** with React Router (`src/Routes.tsx`) that lazily loads page bundles for faster navigation.
- **GraphQL integration** powered by Apollo Client configured against the platform API (`src/lib/apolloClient.ts`).
- **State management** using React Context providers (`src/context`) alongside reducer utilities (`src/reducers`).
- **Component libraries** featuring Material UI v5 for design primitives and bespoke widgets under `src/components` for domain-specific needs.
- **Form handling** with `react-hook-form`, JSON Schema builders, and custom builders located in `src/builders`.

## Tech Stack
- **Framework:** React 18 with TypeScript
- **Routing:** React Router DOM v5
- **UI Toolkit:** Material UI, React Bootstrap, Emotion
- **Data Layer:** Apollo Client + GraphQL
- **Charts & Visualisation:** Nivo
- **Forms:** React Hook Form, React JSONSchema Form
- **Media Handling:** AWS SDK (S3 uploads), Jimp, tus-js-client
- **Utility Libraries:** Lodash, Day.js, Moment, UUID
- **Testing:** React Testing Library, Jest
- **Linting & Formatting:** ESLint, Prettier

## Getting Started
Follow the steps below to run the dashboard locally for development.

### Prerequisites
- Node.js **>= 16** (LTS recommended)
- npm **>= 8** (ships with Node.js LTS releases)
- Access credentials for any third-party integrations you plan to enable (AWS S3, Cloudflare Stream, Google Maps, OAuth providers, etc.)

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-org>/superhuman-life.git
cd superhuman-life

# Install dependencies
npm install
```

### Environment Configuration
Create a `.env.local` (or `.env`) file at the project root. The application reads environment variables prefixed with `REACT_APP_`. Below is a consolidated list of variables referenced in the codebase:

| Variable | Purpose |
| --- | --- |
| `REACT_APP_URL` | Base URL for the Superhuman Life backend and GraphQL endpoint. |
| `REACT_APP_SUPPORT_URL` | External link for support resources displayed on dashboards. |
| `REACT_APP_BLOG_URL` | Link to public blog content promoted within the UI. |
| `REACT_APP_SUPPORT_EMAIL` | Support email surfaced on account deactivation flows. |
| `REACT_APP_SUPPORT_CONTACT_NUMBER` | Support phone number for account flows. |
| `REACT_APP_GOOGLE_MAP_KEY` | Google Maps API key for address autocomplete. |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID for social login. |
| `REACT_APP_FACEBOOK_APP_ID` | Facebook OAuth app identifier. |
| `REACT_APP_LINKEDIN_CLIENT_ID` | LinkedIn OAuth client ID. |
| `REACT_APP_LINKEDIN_REDIRECT_URI` | Redirect URI registered with LinkedIn. |
| `REACT_APP_FACEBOOK_PAGE_URL` | Link to your Facebook community page. |
| `REACT_APP_INSTAGRAM_PAGE_URL` | Link to your Instagram community page. |
| `REACT_APP_LINKEDIN_PAGE_URL` | Link to your LinkedIn community page. |
| `REACT_APP_WEBSITE_URL` | Primary marketing website URL. |
| `REACT_APP_SUBDOMAIN_WEBSITE_URL` | Alternate subdomain site for landing pages. |
| `REACT_APP_ENDUSER_ANDROID_APP_URL` | Link to the Android app in stores. |
| `REACT_APP_ENDUSER_IOS_APP_URL` | Link to the iOS app in stores. |
| `REACT_APP_S3_BUCKET_NAME` | AWS S3 bucket for media uploads. |
| `REACT_APP_S3_BUCKET_REGION` | AWS region for the S3 bucket. |
| `REACT_APP_S3_ACCESS_KEY` | AWS access key ID for upload credentials. |
| `REACT_APP_S3_SECRET_KEY` | AWS secret access key for upload credentials. |
| `REACT_APP_S3_PREFIX_NAME` | Prefix/path within S3 used for asset organisation. |
| `REACT_APP_CLOUDFLARE_URL` | Cloudflare Stream upload endpoint. |
| `REACT_APP_CLOUDFLARE_CUSTOMER_CODE` | Cloudflare Stream customer identifier for embed URLs. |

> **Tip:** Never commit secrets to version control. Use environment-specific configuration managers (e.g., dotenv, GitHub Actions secrets, or cloud key vaults) when deploying.

### Run the App
```bash
# Start a local development server with hot reload
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000) by default.

To create an optimised production bundle:
```bash
npm run build
```

## Available Scripts
| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode using Create React App tooling. |
| `npm run build` | Bundles the app for production deployment. |
| `npm test` | Launches the Jest test runner in watch mode. |
| `npm run lint` | Executes ESLint against the entire project. |
| `npm run lint:fix` | Auto-fixes lint errors where possible. |
| `npm run format` | Applies the Prettier style guide to supported files. |

## Project Structure
```
├── public/                 # Static assets served by CRA
├── src/
│   ├── App.tsx             # Core application shell
│   ├── Routes.tsx          # Route configuration
│   ├── components/         # Reusable UI building blocks & widgets
│   ├── context/            # React context providers
│   ├── pages/              # Feature pages (dashboard, booking, finance, etc.)
│   ├── reducers/           # Reducers and state helpers
│   ├── builders/           # Form builders and schema utilities
│   ├── lib/                # Shared libraries (Apollo client, helpers)
│   ├── tabs/               # Navigation tab definitions
│   ├── types/              # TypeScript type declarations
│   ├── img/                # Image assets
│   └── index.tsx           # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Quality Gates
We encourage contributors to run all quality checks before opening a pull request:
1. `npm run lint` – catch TypeScript and style issues early.
2. `npm run format` – ensure code formatting consistency.
3. `npm test` – maintain a healthy suite of automated tests.

Continuous Integration (CI) pipelines should mirror these steps and may also build production bundles to catch type or bundling errors.

## Deployment Notes
- **Environment separation:** Provision separate `.env` files (or CI secret groups) per environment (development, staging, production).
- **Static hosting:** The production build is a static bundle compatible with Netlify, Vercel, Cloudflare Pages, AWS Amplify, or any CDN-backed host.
- **Backend requirements:** The dashboard expects a GraphQL API reachable at `REACT_APP_URL`. Ensure the backend supports CORS for your domain(s).
- **File storage:** When using AWS S3, configure CORS and IAM policies to allow the browser upload flows.
- **Media streaming:** Cloudflare Stream credentials are required for the built-in video player. Alternatively, replace `SpaienVideoPlayer` with your preferred provider.

## Contributing
We welcome contributions of all sizes—from typo fixes to new modules. To get started:
1. Fork the repository and create a topic branch (`git checkout -b feat/your-feature`).
2. Follow the [Getting Started](#getting-started) guide to run the project locally.
3. Implement your changes, ensuring tests and lint checks pass.
4. Submit a pull request that describes your motivation, implementation details, and testing steps.

Before contributing, please read (or help us draft!) the forthcoming `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` documents. If you would like to champion these docs, open an issue and tag the maintainers.

## Community and Support
- **Issues:** Use [GitHub Issues](https://github.com/<your-org>/superhuman-life/issues) for bug reports and feature requests.
- **Discussions:** Join project planning conversations under GitHub Discussions (enable in the repo settings) or your preferred community platform.
- **Security contact:** For security disclosures, email the core team via `security@yourdomain.com` (replace with your actual alias) rather than filing a public issue.

## Security
If you discover a vulnerability, please follow responsible disclosure practices. Avoid sharing exploit details publicly until a fix is available. Add a `SECURITY.md` to document the official policy if you operate this project in production.

## License
Select an OSI-approved license (for example, **Apache-2.0** or **MIT**) and add it as `LICENSE` at the repository root. Update this section once finalised. Until then, no implicit license is granted.

## Acknowledgements
Superhuman Life is built on the efforts of contributors and the broader open-source ecosystem. Thank you to everyone who maintains the frameworks and libraries that make this project possible.
