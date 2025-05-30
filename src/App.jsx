import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ForgetPassword from "./Components/ForgetPassword";
import { ToastProvider } from './context/ToastContext';
import SuccessMessage from "./pages/credential/SuccessMessage";
import VerifyCodePage from "./pages/credential/verify_code";
import Login from './pages/credential/login';
import { PopupProvider } from './context/PopupContext';
import SignupRes from './pages/credential/signup_res';
import LeadTimeline from "./Components/LeadTimeline";
import HistoryPage from "./pages/history";
import CompanyList from "./Components/Company/CompanyList";
import CompanyPage from './pages/companypage';
import AllLeadsPage from './pages/dashboard/AllLeadsPage'; 
import LeadsDashboard from "./pages/dashboard/teamLeadDashboard";
import LeadManagePage from './pages/LeadManagePage';
import LeadListViewPage from './pages/dashboard/LeadListView';
import LeadCardViewPage from './pages/dashboard/LeadcardView';
import UserAnalyticsPage from './pages/user_analytics';
import CalendarPage from './pages/calenderpage';
import Commandpage from './pages/command';
import TeamviewDashboard from './pages/dashboard/teamviewdashboard';
import { TabProvider } from "./context/TabContext";
import LeadDetailView from "../src/context/leaddetailsview";
import CreateUserForm from './Components/registerUser';
import AppLayout from '../src/Components/AppLayout';

function App() {
  return (
        <PopupProvider>

    <ToastProvider>
    <TabProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/success" element={<SuccessMessage />} />
        <Route path="/verify" element={<VerifyCodePage />} />
        <Route path="/signupres" element={<SignupRes />} />


        {/* Extra Public Views */}
   
       

        {/* Protected Routes with Layout */}
        <Route element={<AppLayout />}>
  
          <Route path="calenderpage" element={<CalendarPage />} />
          <Route path="commandpage" element={<Commandpage />} />
          <Route path="/leads" element={<LeadsDashboard />} />
          <Route path="/leadlistview" element={<LeadListViewPage />} />
          <Route path="/leadmanage" element={<LeadManagePage />} />
          <Route path="/leadtimeline" element={<LeadTimeline />} />
          <Route path='/allleadpage' element={<AllLeadsPage/>}/>
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/companylist" element={<CompanyList />} />
          <Route path="/companypage" element={<CompanyPage />} />
          <Route path="/analytics" element={<UserAnalyticsPage />} />
        {/* Lead Dashboard Routes */}
        <Route path="/leads" element={<LeadsDashboard />} />
        <Route path="/leadmanage" element={<LeadManagePage />} />
        <Route path="/leadlistview" element={<LeadListViewPage />} />
        <Route path="/leadcardview" element={<LeadCardViewPage />} />
        <Route path="/teamview" element={<TeamviewDashboard />} />
        <Route path="/leaddetailview/:leadId" element={<LeadDetailView />} />
        </Route>

  
          <Route path="/calenderpage" element={<CalendarPage />} />
          <Route path="/users" element={<CreateUserForm />} />
          

      </Routes>
    </TabProvider>
    </ToastProvider>
        </PopupProvider>

  );
}

export default App;
