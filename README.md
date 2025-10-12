# IESA Client - Invoice & Expense Segmentation App Frontend

React + TypeScript frontend for the Invoice and Expense Segmentation Application.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **JWT** - Authentication

## Features

- 🔐 JWT-based authentication with auto-refresh
- 👥 User management (CRUD operations)
- 🏢 Department management
- 🔒 Role-based access control (RBAC)
- 📊 Dashboard with statistics
- 🎨 Material Design UI
- 📱 Responsive layout

## Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:8080`

## Setup

### 1. Fix npm cache permissions (if needed)

If you encounter npm permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL.

### 4. Run development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # Reusable components
│   └── layout/       # Layout components (navigation, header, etc.)
├── contexts/         # React contexts (Auth, etc.)
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   └── DepartmentsPage.tsx
├── services/         # API service layer
│   ├── api.ts
│   ├── authService.ts
│   ├── userService.ts
│   └── departmentService.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── App.tsx           # Root component
├── routes.tsx        # Route configuration
├── theme.ts          # MUI theme configuration
└── main.tsx          # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The app uses JWT tokens for authentication:

- Access token (15 min expiry) - stored in localStorage
- Refresh token (7 days expiry) - stored in localStorage
- Auto-refresh when access token expires

### Default Test Accounts

- **Admin**: `admin` / `password123`
- **Manager**: `john.manager` / `password123`
- **Employee**: `alice.dev` / `password123`
- **Auditor**: `auditor` / `password123`

## API Integration

The app integrates with the IESA backend REST API:

- Base URL: `http://localhost:8080/api/v1`
- Authentication: Bearer token in Authorization header
- Auto token refresh on 401 responses

### Key Endpoints

- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token
- `GET /users` - List all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /departments` - List departments
- `POST /departments` - Create department

## Role-Based Access Control

The app implements RBAC based on permissions:

- UI elements conditionally render based on permissions
- `useAuth()` hook provides `hasPermission()` and `hasRole()` helpers
- Permissions are checked before showing create/edit/delete buttons

### Permission Examples

- `USER_CREATE` - Can create users
- `USER_UPDATE` - Can update users
- `USER_DELETE` - Can delete users
- `DEPARTMENT_READ` - Can view departments
- `DEPARTMENT_CREATE` - Can create departments

## Development

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/routes.tsx`
3. Add navigation item in `DashboardLayout.tsx`
4. Create service methods in `src/services/` if needed
5. Add TypeScript types in `src/types/`

### Adding a New API Service

1. Define TypeScript types in `src/types/`
2. Create service file in `src/services/`
3. Use `apiService` for HTTP calls
4. Import and use in components

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Troubleshooting

### npm permission errors

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

### API connection errors

- Ensure backend server is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify `.env` file has correct API URL

### Token expired errors

- Tokens are auto-refreshed
- If refresh fails, you'll be redirected to login
- Check browser console for detailed errors

## Next Steps

1. Implement Segment Management module
2. Add Expense Management
3. Build Approval Workflow UI
4. Create Budget Management dashboard
5. Add Reporting & Analytics

## License

Proprietary - Company Internal Use Only
