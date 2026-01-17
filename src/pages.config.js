import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Success from './pages/Success';
import TermsConditions from './pages/TermsConditions';
import Home from './pages/Home';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "Success": Success,
    "TermsConditions": TermsConditions,
    "Home": Home,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};