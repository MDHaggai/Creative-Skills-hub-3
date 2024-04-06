import { Navigate, createBrowserRouter } from "react-router-dom";
import { AuthWrapper, ClientRegistrationForm, EditorRegistrationForm, EmailVerification, LoginPage, Register, StudentRegistrationForm } from "./core/auth";
import { ErrorPage } from "./shared";
import LandingPage from "./core/landing";
import { StudentHomePage } from "./core/student";
import { AdminHomePage } from "./core/admin";
import { EditorHomePage } from "./core/editor";
import { ClientHomePage } from "./core/client";

const routes = createBrowserRouter([
    {
        path: '',
        element: <LandingPage />
    },
    {
        path: 'auth',
        element: <AuthWrapper />,
        children: [
            {
                path: '',
                element: <Navigate to="login" replace/>
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <Register />,
                children : [
                    {
                        path: '',
                        element: <Navigate to="student" replace/>
                    },
                    {
                        path: 'student',
                        element: <StudentRegistrationForm />
                    },
                    {
                        path: 'editor',
                        element: <EditorRegistrationForm />
                    },
                    {
                        path: 'client',
                        element: <ClientRegistrationForm />
                    },
                ]
            },
            {
                path: 'verify-email',
                element: <EmailVerification />
            }
        ]
    },
    {
        path: 'student',
        element: <StudentHomePage />
    },
    {
        path: 'admin',
        element: <AdminHomePage />
    },
    {
        path: "editor",
        element: <EditorHomePage />
    },
    {
        path: "client",
        element: <ClientHomePage />
    },
    {
        path: "/*",
        element: <ErrorPage />
    }
])

export default routes;