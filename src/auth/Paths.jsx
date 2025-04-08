import About from "../pages/About";
import Child from "../pages/Child";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import VaccineManagement from "../pages/VaccineManagement";
import Profile from "../pages/Profile";
import { ManageBatchesPage } from "../pages/ManagePatchesPage";
import { TransactionPage } from "../pages/TransactionPage";
import Vaccine from "../pages/Vaccine";
import VaccineCombo from "../pages/VaccineCombo";
import { ROLES } from "./Roles";
import ComboVaccineManagement from "../pages/ComboVaccineManagement";
import Appointment from "../pages/Appointment";
import AppointmentSchedule from "../pages/AppointmentSchedule";
import PurposeManagement from "../pages/PurposeManagement";
import { DoctorVaccineSchedulePage } from "../pages/DoctorVaccineSchedule";
import DoctorVaccineConfirmation from "../pages/DoctorVaccineConfirmation";
import DoctorVaccineConfirmationDetail from "../pages/DoctorVaccineConfirmationDetail";
import { ManageSchedulePage } from "../pages/ManageSchedulePage";
import CompletePayment from "../pages/CompletePayment";
import VaccineInventoryAlerts from "../pages/VaccineInventoryAlerts";
import DecideSchedule from "../pages/DecideSchedule";
import DoctorHistorySchedules from "../pages/DoctorHistorySchedules";
import OrderHistory from "../pages/OrderHistory";
import UpdateExistingSchedule from "../pages/UpdateExistingSchedule";
import Dashboard from "../pages/Dashboard";
import { BatchJobPage } from "../pages/BatchJobs";

export const PATHS = {
    HOME: {
        path: '/',
        label: 'Trang chủ',
        element: <Home />,
        allowedRoles: [ROLES.USER]
    },
    VACCINES: {
        path: '/vaccines',
        label: 'Vaccines',
        element: <Vaccine />,
        allowedRoles: [ROLES.USER]
    },
    COMBO_VACCINE: {
        path: '/combo-vaccine',
        label: 'Combo',
        element: <VaccineCombo />,
        allowedRoles: [ROLES.USER]
    },
    ABOUT: {
        path: '/ve-chung-toi',
        label: 'Về chúng tôi',
        element: <About />,
        allowedRoles: [ROLES.USER]
    },
    PROFILE: {
        path: '/ho-so',
        label: 'Hồ sơ',
        element: <Profile />,
        allowedRoles: [ROLES.USER]
    },
    CHILDS: {
        path: '/danh-sach-tre',
        label: 'Danh sách trẻ',
        element: <Child />,
        allowedRoles: [ROLES.USER],
    },
    CONTACT: {
        path: '/lien-he',
        label: 'Liên hệ',
        element: <Contact />,
        allowedRoles: [ROLES.USER]
    },
    MANAGER_VACCINES: {
        path: '/quan-li-vaccines',
        label: 'Vaccines',
        element: <VaccineManagement />,
        allowedRoles: [ROLES.ADMIN]
    },
    MANAGER_COMBO_VACCINES: {
        path: '/quan-li-goi-tiem',
        label: 'Gói tiêm',
        element: <ComboVaccineManagement />,
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    MANAGER_PURPOSES: {
        path: '/quan-li-cong-dung',
        label: 'Công dụng',
        element: <PurposeManagement />,
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    STOCK: {
        path: '/nhap-kho',
        label: 'Quản lý nhập kho',
        element: <ManageBatchesPage />,
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    TRANSACTION: {
        path: '/xuat-kho',
        label: 'Quản lý xuất kho',
        element: <TransactionPage />,
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    APPOINTMENT: {
        path: '/dat-lich',
        label: 'Đặt lịch',
        element: <Appointment />,
        allowedRoles: [ROLES.USER]
    },
    APPOINTMENT_SCHEDULE: {
        path: '/lich-tiem',
        label: 'Quản lý lịch tiêm',
        element: <AppointmentSchedule />,
        allowedRoles: [ROLES.ADMIN]
    },
    DOCTOR_SCHEDULE: {
        path: '/phan-bo-vaccine',
        label: 'Phân bổ vaccine cho bác sĩ',
        element: <DoctorVaccineSchedulePage />,
        allowedRoles: [ROLES.DOCTOR, ROLES.STAFF]
    },
    DOCTOR_VACCINE_CONFIRMATION: {
        path: '/lich-lam-viec',
        label: 'Lịch tiêm ',
        element: <DoctorVaccineConfirmation />,
        allowedRoles: [ROLES.DOCTOR]
    },
    DOCTOR_VACCINE_CONFIRMATION_DETAIL: {
        path: '/lich-lam-viec/:id',
        label: 'Chi tiết lịch tiêm',
        element: <DoctorVaccineConfirmationDetail />,
        allowedRoles: [ROLES.DOCTOR]
    },
    CUSTOMER_MANAGE_SCHEDULE: {
        path: '/quan-li-lich-tiem',
        label: 'Quản lí lịch tiêm',
        element: <ManageSchedulePage />,
        allowedRoles: [ROLES.USER]
    },
    COMPLETE_PAYMENT: {
        path: '/hoan-tat-thanh-toan',
        element: <CompletePayment />,
    },
    VACCINE_INVENTORY_ALERTS: {
        path: '/quan-li-ton-kho',
        label: 'Quản lí tồn kho',
        element: <VaccineInventoryAlerts />,
        allowedRoles: [ROLES.ADMIN, ROLES.STAFF]
    },
    DECIDE_SCHEDULE: {
        path: '/chot-lich-va-thanh-toan',
        element: <DecideSchedule />,
        allowedRoles: [ROLES.USER]
    },
    WORKING_HISTORY: {
        path: '/lich-su-tiem',
        label: 'Lịch sử tiêm',
        element: <DoctorHistorySchedules />,
        allowedRoles: [ROLES.DOCTOR]
    },
    ORDER_HISTORY: {
        path: '/lich-su-don-hang',
        label: 'Lịch sử đơn hàng',
        element: <OrderHistory />,
        allowedRoles: [ROLES.USER]
    },
    UPDATE_EXISTING_SCHEDULE: {
        path: '/quan-li-lich-tiem/:scheduleId',
        element: <UpdateExistingSchedule />,
        allowedRoles: [ROLES.USER]
    },
    DASHBOARD: {
        path: '/thong-ke',
        label: 'Thống kê',
        element: <Dashboard />,
        allowedRoles: [ROLES.ADMIN]
    },
    BATCH_JOB: {
        path: '/tac-vu-dinh-ky',
        label: 'Tác vụ định kỳ',
        element: <BatchJobPage />,
        allowedRoles: [ROLES.ADMIN]
    }
}

export const FULL_PATHS_LIST = Object.values(PATHS);
export const getRolePaths = (role) => {
    if (role == ROLES.ADMIN) {
        return [PATHS.STOCK, PATHS.TRANSACTION, PATHS.VACCINE_INVENTORY_ALERTS, PATHS.MANAGER_PURPOSES, PATHS.MANAGER_COMBO_VACCINES, PATHS.MANAGER_VACCINES, PATHS.BATCH_JOB, PATHS.DASHBOARD];
    } else if (role == ROLES.STAFF) {
        return [PATHS.STOCK, PATHS.TRANSACTION, PATHS.VACCINE_INVENTORY_ALERTS, PATHS.DOCTOR_SCHEDULE]
    } else if (role == ROLES.DOCTOR) {
        return [PATHS.DOCTOR_VACCINE_CONFIRMATION, PATHS.WORKING_HISTORY];
    } else {
        return [PATHS.HOME, PATHS.CHILDS, PATHS.APPOINTMENT, PATHS.ORDER_HISTORY, PATHS.CUSTOMER_MANAGE_SCHEDULE, PATHS.CONTACT, PATHS.ABOUT];
    }
}
export const isAuthorized = (role, pathName) => {
    console.log('Role: ' + role);
    console.log('Path: ' + pathName);

    if (role == ROLES.USER && pathName === '/') return true;

    let partialMatch = FULL_PATHS_LIST.filter(p => p.path !== '/').find(p => pathName.startsWith(p.path));

    if ([PATHS.COMPLETE_PAYMENT, PATHS.PROFILE].includes(partialMatch)) return true;

    if (partialMatch) return partialMatch.allowedRoles.includes(role);
}