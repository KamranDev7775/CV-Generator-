import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import PaymentSuccess from './pages/PaymentSuccess';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Success from './pages/Success';
import TermsConditions from './pages/TermsConditions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Home": Home,
    "PaymentSuccess": PaymentSuccess,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "Success": Success,
    "TermsConditions": TermsConditions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};