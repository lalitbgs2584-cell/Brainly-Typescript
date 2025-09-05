# Content Management & Share Link System

A **full-stack content management system** built with **Node.js, Express, TypeScript, and MongoDB**, allowing users to register, login, manage digital content (images, videos, articles, audio), and share short links.

## Features

- User registration & login with **JWT-based authentication**.
- Secure password validation (minimum requirements, special character, capital letter).
- Create, fetch, and delete content.
- Tags support for content categorization.
- Share links module with **unique short URLs**.
- Protected routes using JWT middleware.
- Type-safe code with **TypeScript**.
- MongoDB population for `tags` and `publisher`.

## Tech Stack

- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (access and refresh tokens)
- **Validation:** Zod (optional)
- **Other:** nanoid (for short link generation)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>
