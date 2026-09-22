import { Route, Routes } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import HomePage from "@/pages/HomePage";
import MenuPage from "@/pages/MenuPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import PaymentPage from "@/pages/PaymentPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import ContactPage from "@/pages/ContactPage";
import TrackOrderPage from "@/pages/TrackOrderPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminOrderPage from "@/pages/admin/AdminOrderPage";
import AdminMenuPage from "@/pages/admin/AdminMenuPage";
import AdminDeliveryPage from "@/pages/admin/AdminDeliveryPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="order/:orderNumber" element={<ConfirmationPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="track" element={<TrackOrderPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="delivery" element={<AdminDeliveryPage />} />
        <Route path="orders/:orderId" element={<AdminOrderPage />} />
      </Route>
    </Routes>
  );
}
