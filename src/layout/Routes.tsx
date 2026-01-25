import type { ReactNode } from "react";
import Login from "../pages/Auth/Login";
import CreatePassword from "../pages/Auth/CreatePassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import EnterCode from "../pages/Auth/EnterCode";
import ResetSuccessful from "../pages/Auth/ResetSuccessful";

import Overview from "../pages/Dashboard/Overview";
import Bookings from "../pages/Dashboard/Bookings/Bookings";
import Vendors from "../pages/Dashboard/Vendors/Vendors";
import VendorRegistration from "../pages/Dashboard/VendorRegistration/VendorRegistration";
import Users from "../pages/Dashboard/Users/Users";
import Transactions from "../pages/Dashboard/Transactions/Transactions";
import Withdrawals from "../pages/Dashboard/Withdrawals/Withdrawals";
import Settings from "../pages/Dashboard/Settings/Settings";
import BookingDetails from "@/pages/Dashboard/Bookings/BookingDetails";

export interface RouteType {
  path: string;
  name?: string;
  element: ReactNode;
}

export const authRoutes: RouteType[] = [
  { path: "/login", element: <Login /> },
  { path: "/create-password", element: <CreatePassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/enter-code", element: <EnterCode /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/reset-successful", element: <ResetSuccessful /> },
];

export const dashboardRoutes: RouteType[] = [
  { path: "/dashboard", name: "Dashboard", element: <Overview /> },

  { path: "/bookings", name: "Bookings", element: <Bookings /> },
  {
    path: "/bookings/:bookingId",
    name: "Booking Details",
    element: <BookingDetails />,
  },

  { path: "/vendors", name: "Vendors", element: <Vendors /> },

  {
    path: "/vendor-registrations",
    name: "Vendor Registrations",
    element: <VendorRegistration />,
  },

  { path: "/users", name: "Users", element: <Users /> },

  { path: "/transactions", name: "Transactions", element: <Transactions /> },

  { path: "/withdrawals", name: "Withdrawals", element: <Withdrawals /> },

  { path: "/settings", name: "Settings", element: <Settings /> },

  // { path: "/admins", name: "Admins", element: <Admins /> },
  // { path: "/settings", name: "Settings", element: <Settings /> },
  // { path: "/coupons", name: "Coupons", element: <Coupons /> },

  // //users
  // { path: "/users", name: "Users", element: <Users /> },
  // { path: "/viewUser/:userId", name: "ViewUser", element: <ViewUser /> },

  // // shop
  // { path: "/products", name: "Products", element: <Products /> },
  // { path: "/addProduct", name: "AddProduct", element: <AddProduct /> },
  // {
  //   path: "/editProduct/:productId",
  //   name: "EditProduct",
  //   element: <EditProduct />,
  // },
  // {
  //   path: "/productCategories",
  //   name: "ProductCategory",
  //   element: <ProductCategories />,
  // },
  // { path: "/addCategory", name: "AddCategory", element: <AddCategory /> },
  // {
  //   path: "/editCategory/:catId",
  //   name: "EditCategory",
  //   element: <EditCategory />,
  // },

  // { path: "/shopOrders", name: "ShopOrders", element: <ShopOrders /> },
  // { path: "/viewOrder/:orderId", name: "ViewOrder", element: <ViewOrder /> },

  // // rentals
  // { path: "/gears", name: "Gears", element: <Gears /> },
  // { path: "/addGear", name: "AddGear", element: <AddGear /> },
  // {
  //   path: "/editGear/:gearId",
  //   name: "EditGear",
  //   element: <EditGear />,
  // },
  // {
  //   path: "/gearCategories",
  //   name: "GearCategory",
  //   element: <GearCategories />,
  // },
  // {
  //   path: "/addGearCategory",
  //   name: "AddGearCategory",
  //   element: <AddGearCategory />,
  // },
  // {
  //   path: "/editGearCategory/:catId",
  //   name: "EditGearCategory",
  //   element: <EditGearCategory />,
  // },

  // { path: "/rentalOrders", name: "RentalOrders", element: <RentalOrders /> },
  // {
  //   path: "/viewRentalOrder/:orderId",
  //   name: "ViewRentalOrder",
  //   element: <ViewRentalOrder />,
  // },
];
