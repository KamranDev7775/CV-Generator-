import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import Success from './pages/Success';
import TermsConditions from './pages/TermsConditions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "Home": Home,
    "PaymentSuccess": PaymentSuccess,
    "Success": Success,
    "TermsConditions": TermsConditions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};