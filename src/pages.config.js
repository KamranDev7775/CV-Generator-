import Home from './pages/Home';
import Success from './pages/Success';
import Pricing from './pages/Pricing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Success": Success,
    "Pricing": Pricing,
    "PrivacyPolicy": PrivacyPolicy,
    "TermsConditions": TermsConditions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};