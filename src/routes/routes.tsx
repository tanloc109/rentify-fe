import HomePage from "./HomePage.tsx";
import NotFoundPage from "./NotFoundPage.tsx";
import Login from "./Login.tsx";
import NotAuthorized from "./NotAuthorizedPage.tsx";
import CarPage from "./CarPage.tsx";
import EmptyPage from "./EmptyPage.tsx";
import ContactPage from "./ContactPage.tsx";
import AboutPage from "./AboutPage.tsx";
import CarDetail from "../components/car/CarDetail.tsx";
import RegisterPage from "./RegisterPage.tsx";

const publicRoutes = [
    { path: "/", component: HomePage },
    { path: "/login", component: Login },
    { path: "/cars", component: CarPage },
    { path: "/cars/:id", component: CarDetail },
    { path: "/abouts", component: AboutPage },
    { path: "/contacts", component: ContactPage },
    { path: "/register", component: RegisterPage },
    { path: "/notAuthorized", component: NotAuthorized },
    { path: "*", component: NotFoundPage },
];

const adminRoutes = [
    { path: "/empty", component: EmptyPage },
];


const headOfDepartmentAndAdminRoutes = [
]

const privateRoutes = [

];

export { adminRoutes, privateRoutes, publicRoutes, headOfDepartmentAndAdminRoutes };
