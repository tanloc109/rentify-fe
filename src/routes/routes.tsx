import HomePage from "./HomePage.tsx";
import NotFoundPage from "./NotFoundPage.tsx";
import Login from "./Login.tsx";
import NotAuthorized from "./NotAuthorizedPage.tsx";
import CarPage from "./CarPage.tsx";
import ContactPage from "./ContactPage.tsx";
import AboutPage from "./AboutPage.tsx";
import CarDetail from "../components/car/CarDetail.tsx";
import RegisterPage from "./RegisterPage.tsx";
import CarManagement from "./CarManagement.tsx";
import BrandManagement from "./BrandManagement.tsx";
import CarTypeManagement from "./CarTypeManagement.tsx";
import UserManagement from "./UserManagement.tsx";
import WalletManagement from "./WalletManagement.tsx";
import RentalManagement from "./RentalManagement.tsx";
import Rental from "./Rental.tsx";
import WalletPage from "./WalletPage.tsx";

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
    { path: "/car-management", component: CarManagement },
    { path: "/brand-management", component: BrandManagement },
    { path: "/type-management", component: CarTypeManagement },
    { path: "/user-management", component: UserManagement },
    { path: "/wallet-management", component: WalletManagement },
    { path: "/rental-management", component: RentalManagement },
];

const renterAndHostRoutes = [
    { path: "/cars", component: CarPage },
    { path: "/rentals", component: Rental },
    { path: "/wallet", component: WalletPage },
]

const privateRoutes = [

];

export { adminRoutes, privateRoutes, publicRoutes, renterAndHostRoutes };
