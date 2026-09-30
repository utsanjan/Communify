<h1 align="center">
  <a href="https://comm-unify.netlify.app" target="_blank">
    <img src="https://raw.githubusercontent.com/utsanjan/Communify/master/src/assets/images/logo.png" width="75%" alt="Communify">
  </a>
</h1>

<p align="center">
  A gaming-focused social media platform — share stats, post highlights, connect with players.
  <br/>
  <a href="https://comm-unify.netlify.app"><strong>🔗 View Live App »</strong></a>
</p>

<p align="center">
  <a href="https://app.netlify.com/sites/comm-unify/deploys">
    <img src="https://api.netlify.com/api/v1/badges/cc483896-4a32-49ca-90a0-ba1bf4ae4540/deploy-status" alt="Netlify Status">
  </a>&nbsp;
  <a href="https://github.com/utsanjan/Communify/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/utsanjan/Communify?style=flat" alt="License">
  </a>&nbsp;
  <a href="https://github.com/utsanjan/Communify/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/utsanjan/Communify?style=flat" alt="Contributors">
  </a>&nbsp;
  <a href="https://github.com/utsanjan/Communify/stargazers">
    <img src="https://img.shields.io/github/stars/utsanjan/Communify?style=flat" alt="Stars">
  </a>&nbsp;
  <a href="https://discord.gg/bvzTHWnD3n">
    <img src="https://dcbadge.limes.pink/api/server/uavTPkr?style=flat" alt="Discord">
  </a>
</p>

<br/>

<a href="https://comm-unify.netlify.app">
  <img src="https://tinyurl.com/4m585mh2" width="100%" alt="Communify App Screenshot">
</a>

---

## 📖 About

**Communify** is a full-stack gaming social network built as a Bachelor's final year project. Players can register, create posts sharing gaming moments and stats, comment on others' posts, like/dislike content, search for other users, and manage their own profiles — all within a responsive, real-time web app.

> **[📑 Bachelor's Thesis PDF](https://bit.ly/3VvMBjT)** — Full project documentation and design specification.

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign-up & sign-in, Google OAuth, email verification, and password reset
- 📝 **Posts** — Create, view, like/dislike, and delete gaming posts with image uploads
- 💬 **Comments** — Comment on any post in real-time
- 👤 **User Profiles** — Browse all users, view individual profiles and their posts
- 🔍 **User Search** — Live search across the user directory
- 🛡️ **Route Guards** — Auth-protected routes; unauthenticated users are redirected automatically
- 📱 **Mobile Gate** — Dedicated landing page for mobile visitors (desktop-only app by design)
- 🌐 **Firebase Backend** — Firestore database, Firebase Auth, and Cloud Storage
- ⚡ **NgRx State Management** — Centralized reactive state for auth, posts, and users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Angular 9 |
| **Language** | TypeScript |
| **State Management** | NgRx (Store, Effects, Devtools) |
| **Backend / DB** | Firebase (Firestore, Auth, Storage) |
| **UI Components** | Angular Material |
| **Layout** | Angular Flex-Layout |
| **Styling** | SCSS |
| **Hosting** | Netlify |

---

## 🗂️ Project Structure

```
src/app/
├── core/                   # Singleton services, layout shell (navbar, footer, home)
│   ├── components/         # NavbarComponent, FooterComponent, SidenavListComponent, etc.
│   ├── firebase/           # FirebaseModule — AngularFire provider setup
│   └── services/           # SpinnerService
├── shared/                 # Reusable cross-feature declarations
│   ├── components/loader/  # LoaderComponent (global spinner)
│   ├── directives/         # PasswordMatchDirective
│   ├── guards/             # AuthGuard, SecureInnerGuard
│   ├── interfaces/         # IPost, IUser, IComment
│   ├── material/           # MaterialModule — all Angular Material re-exports
│   ├── pipes/              # SubstringPipe, ToDatePipe
│   └── validators/         # Password match validator
├── store/                  # NgRx global store
│   ├── auth/               # auth.actions / auth.effects / auth.reducer / auth.selectors
│   ├── posts/              # posts.actions / posts.effects / posts.reducer / posts.selectors
│   ├── users/              # users.actions / users.effects / users.reducer / users.selectors
│   └── store.types.ts      # Shared IAction<T> interface
├── auth/                   # Auth feature module (sign-in, sign-up, verify-email, forgot-password)
├── posts/                  # Posts feature module (list, detail, create, card, comments)
│   └── models/             # Upload model
├── users/                  # Users feature module (list, profile, user-posts)
│   └── resolvers/          # UserResolver
└── app.module.ts           # Root module
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `v12.x` (required for Angular 9)
- **Angular CLI** `v9.x` — `npm install -g @angular/cli@9`
- A **Firebase** project with Firestore, Authentication, and Storage enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/utsanjan/Communify.git
cd Communify

# 2. Switch to the source branch
git checkout master

# 3. Install dependencies
npm install

# 4. Add your Firebase config to the environment files
#    Edit:  src/environments/environment.ts
#           src/environments/environment.prod.ts

# 5. Start the dev server
ng serve
```

The app will be available at `http://localhost:4200`.

### Build for Production

```bash
ng build --prod
```
Output is written to `dist/`. Deploy the contents to any static host (Netlify, Firebase Hosting, etc.).

---

## 🔒 Environment Setup

Create/update `src/environments/environment.ts` with your Firebase project credentials:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

> ⚠️ Never commit real API keys. Use environment variable injection or Firebase App Check for production.

---

## 👥 Project Contributors

<a href="https://github.com/utsanjan/Communify/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=utsanjan/Communify" width="180" alt="Contributors">
</a>

| Name | GitHub |
|---|---|
| Utsanjan Maity | [@utsanjan](https://github.com/utsanjan) |
| Partha Sarathi Bhunia | [@parthasarathi04](https://github.com/parthasarathi04) |
| Abhik Khatuya | [@ABHIK-KHATUYA](https://github.com/ABHIK-KHATUYA) |

---

## 📄 License

This project is licensed under the terms of the [LICENSE](./LICENSE) file included in this repository.
