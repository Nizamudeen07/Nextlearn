# NexLearn - Frontend Machine Test

A Next.js implementation of the NexLearn exam platform based on the provided Figma design and API documentation.

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Axios** with JWT interceptors for API calls
- **JavaScript** (ES6+)

## Features

- ✅ Multi-step OTP-based authentication (Phone → OTP → Profile)
- ✅ JWT token storage with automatic refresh via Axios interceptors
- ✅ Redux state management (auth + exam state)
- ✅ Exam instructions page with live API data
- ✅ Full MCQ exam with timer, question sheet, paragraph modal
- ✅ Mark for review functionality with color-coded question sheet
- ✅ Submit confirmation modal with summary stats
- ✅ Result page with score breakdown
- ✅ Mobile-responsive design
- ✅ SEO metadata
- ✅ Improved accessibility semantics

## Project Structure

```
nexlearn/
├── app/
│   ├── layout.js           # Root layout + SEO metadata + Redux Provider
│   ├── page.js             # Redirects to /login
│   ├── globals.css
│   ├── login/
│   │   └── page.js         # Auth page (phone → OTP → profile)
│   ├── exam/
│   │   ├── page.js         # Instructions page
│   │   └── mcq/
│   │       └── page.js     # MCQ exam page
│   └── result/
│       └── page.js         # Result page
├── components/
│   ├── Providers.js        # Redux Provider wrapper
│   ├── auth/
│   │   ├── PhoneStep.js    # Step 1: Phone input
│   │   ├── OtpStep.js      # Step 2: OTP verify
│   │   └── ProfileStep.js  # Step 3: Create profile
│   ├── exam/
│   │   ├── Timer.js        # Countdown timer
│   │   ├── QuestionSheet.js # Question number grid
│   │   ├── ParagraphModal.js # Comprehensive paragraph overlay
│   │   └── SubmitModal.js  # Submit confirmation dialog
│   └── ui/
│       └── Navbar.js       # Top navigation bar
├── lib/
│   ├── axios.js            # Axios instance + JWT interceptors + token refresh
│   └── auth.js             # localStorage token helpers
└── store/
    ├── index.js            # Redux store config
    └── slices/
        ├── authSlice.js    # Auth state (user, tokens, isAuthenticated)
        └── examSlice.js    # Exam state (questions, answers, timer, result)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone <your-repo-url>
cd nexlearn
npm install
```

### Running the Development Server

**Important:** Run the app on port `3000`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## API Configuration

External API Base URL: `https://nexlearn.noviindusdemosites.in`

The frontend uses a Next.js rewrite so browser requests go through `/api/*` on `localhost:3000`.

### Authentication Flow

1. `POST /auth/send-otp` — sends OTP to mobile
2. `POST /auth/verify-otp` — verifies OTP; returns tokens if user exists, or signals new user
3. `POST /auth/create-profile` — creates profile for new users; returns tokens

### JWT Token Refresh

Axios interceptors automatically:
- Attach `Authorization: Bearer <token>` to all requests
- On 401 responses, attempt token refresh
- Redirect to `/login` if refresh fails

Public authentication endpoints are excluded from bearer token attachment to avoid stale-token issues during login.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/login` |
| `/login` | Multi-step auth (phone → OTP → profile) |
| `/exam` | Instructions page with exam stats |
| `/exam/mcq` | MCQ exam with timer and question sheet |
| `/result` | Score and stats after submission |

