
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  en: 'English',
  am: 'አማርኛ' // Amharic
};

export const translations = {
  en: {
    // Auth
    login: "Login",
    username: "Username",
    password: "Password",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    sendOTP: "Send OTP",
    verifyOTP: "Verify OTP",

    // Dashboard
    dashboard: "Dashboard",
    welcome: "Welcome",
    overview: "Overview",
    residents: "Residents",
    pendingRequests: "Pending Requests",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    newRegistration: "New Registration",
    approvals: "Pending Approvals",
    statistics: "Statistics",
    Certificate: "Certificate",

    // Resident Management
    residentManagement: "Resident Management",
    addResident: "Add Resident",
    viewResidents: "View Residents",
    search: "Search",
    name: "Name",
    idNumber: "ID Number",
    household: "Household",
    dateOfBirth: "Date of Birth",
    contactInfo: "Contact Information",
    familyMembers: "Family Members",
    address: "Address",
    uploadPhoto: "Upload Photo",
    CertificateManagement:'Certificate Management',
    // Documents
    documents: "Documents",
    uploadDocument: "Upload Document",
    generateCertificate: "Generate Certificate",
    documentType: "Document Type",
    status: "Status",
    dateSubmitted: "Date Submitted",
    downloadDocument: "Download Document",

    // Reports
    reports: "Reports",
    demographicReport: "Demographic Report",
    serviceReport: "Service Report",
    exportReport: "Export Report",

    // Settings
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    profile: "Profile",
    logout: "Logout",

    // Notifications
    notifications: "Notifications",
    markAllAsRead: "Mark All as Read",

    // Status
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",

    // Common
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    confirmation: "Confirmation",
    yes: "Yes",
    no: "No",
  },
  am: {
    // Auth
    login: "ግባ",
    username: "የመጠቀሚያ ስም",
    password: "የይለፍ ቃል",
    forgotPassword: "የይለፍ ቃል ረሳህ?",
    resetPassword: "የይለፍ ቃል ዳግም አስጀምር",
    sendOTP: "OTP ላክ",
    verifyOTP: "OTP አረጋግጥ",

    // Dashboard
    dashboard: "ዳሽቦርድ",
    welcome: "እንኳን ደህና መጡ",
    overview: "አጠቃላይ ዕይታ",
    residents: "ነዋሪዎች",
    pendingRequests: "በመጠባበቅ ላይ ያሉ ጥያቄዎች",
    recentActivity: "የቅርብ ጊዜ እንቅስቃሴ",
    quickActions: "ፈጣን እርምጃዎች",
    newRegistration: "አዲስ ምዝገባ",
    approvals: "በመጠባበቅ ላይ ያሉ ማጽደቆች",
    statistics: "ስታቲስቲክስ",
    Certificate:'የምስክር ወረቀት',
    
    CertificateManagement: "የምስክር ወረቀት አስተዳደር",
    // Resident Management
    residentManagement: "የነዋሪ አስተዳደር",
    addResident: "ነዋሪ ጨምር",
    viewResidents: "ነዋሪዎችን ተመልከት",
    search: "ፈልግ",
    name: "ስም",
    idNumber: "የመታወቂያ ቁጥር",
    household: "ቤተሰብ",
    dateOfBirth: "የትውልድ ቀን",
    contactInfo: "የመገኛ መረጃ",
    familyMembers: "የቤተሰብ አባላት",
    address: "አድራሻ",
    uploadPhoto: "ፎቶ ስቀል",

    // Documents
    documents: "ሰነዶች",
    uploadDocument: "ሰነድ ስቀል",
    generateCertificate: "ሰርተፊኬት ይፍጠሩ",
    documentType: "የሰነድ ዓይነት",
    status: "ሁኔታ",
    dateSubmitted: "የቀረበበት ቀን",
    downloadDocument: "ሰነድ አውርድ",

    // Reports
    reports: "ሪፖርቶች",
    demographicReport: "የሕዝብ ቁጥር ሪፖርት",
    serviceReport: "የአገልግሎት ሪፖርት",
    exportReport: "ሪፖርት ይላኩ",

    // Settings
    settings: "ቅንብሮች",
    language: "ቋንቋ",
    theme: "ገጽታ",
    profile: "መገለጫ",
    logout: "ውጣ",

    // Notifications
    notifications: "ማሳወቂያዎች",
    markAllAsRead: "ሁሉንም እንደተነበበ ምልክት አድርግ",

    // Status
    pending: "በመጠባበቅ ላይ",
    approved: "ጸድቋል",
    rejected: "ተቀባይነት አላገኘም",

    // Common
    save: "አስቀምጥ",
    cancel: "ሰርዝ",
    submit: "አስገባ",
    edit: "አርትዕ",
    delete: "ሰርዝ",
    view: "ተመልከት",
    loading: "በመጫን ላይ...",
    success: "ተሳክቷል",
    error: "ስህተት",
    confirmation: "ማረጋገጫ",
    yes: "አዎ",
    no: "አይ",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('krfs-language');
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('krfs-language', language);
    document.documentElement.lang = language;
    if (language === 'am') {
      document.documentElement.classList.add('amharic');
    } else {
      document.documentElement.classList.remove('amharic');
    }
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'am' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
