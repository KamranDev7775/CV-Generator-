import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Success from './pages/Success';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Home": Home,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "TermsConditions": TermsConditions,
    "Success": Success,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};