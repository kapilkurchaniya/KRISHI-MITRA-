export type Language = "en" | "hi"

export const translations = {
  en: {
    // Auth
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.fullName": "Full Name",
    "auth.phone": "Phone Number",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot Password?",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.createAccount": "Create Account",
    "auth.checkEmail": "Check your email",
    "auth.emailSent": "We've sent a confirmation link to your email",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.scanner": "Crop Scanner",
    "dashboard.weather": "Weather",
    "dashboard.mandi": "Mandi Prices",
    "dashboard.alerts": "Alerts",
    "dashboard.mitra": "Krishi Mitra",
    "dashboard.profile": "Profile",
    
    // Scanner
    "scanner.title": "Crop Scanner",
    "scanner.takePicture": "Take Picture",
    "scanner.uploadImage": "Upload Image",
    "scanner.analyzing": "Analyzing...",
    "scanner.disease": "Disease",
    "scanner.healthy": "Healthy",
    "scanner.solution": "Solution",
    
    // Weather
    "weather.title": "Weather Forecast",
    "weather.temperature": "Temperature",
    "weather.humidity": "Humidity",
    "weather.windSpeed": "Wind Speed",
    "weather.rainfall": "Rainfall",
    
    // Mandi
    "mandi.title": "Mandi Prices",
    "mandi.commodity": "Commodity",
    "mandi.market": "Market",
    "mandi.price": "Price",
    "mandi.minPrice": "Min Price",
    "mandi.maxPrice": "Max Price",
    "mandi.trend": "Trend",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.logout": "Logout",
    "common.language": "Language",
    "common.theme": "Theme",
    "common.dark": "Dark",
    "common.light": "Light",
    
    // Profile Setup
    "profile.tellAboutFarm": "Tell us about your farm",
    "profile.personalizeForYou": "We'll personalize weather, mandi prices and alerts for you.",
    "profile.preferredLanguage": "Preferred language",
    "profile.detectingLocation": "Detecting your location...",
    "profile.autoDetectLocation": "Auto-detect my location",
    "profile.state": "State",
    "profile.selectState": "Select state",
    "profile.district": "District",
    "profile.enterDistrict": "Enter district",
    "profile.village": "Village",
    "profile.enterVillage": "Enter village",
    "profile.farmSize": "Farm size (acres)",
    "profile.optional": "Optional",
    "profile.primaryCrop": "Primary crop",
    "profile.cropPlaceholder": "e.g., Wheat, Paddy, Sugarcane",
    "profile.saving": "Saving...",
    "profile.continueToDashboard": "Continue to dashboard",
  },
  hi: {
    // Auth
    "auth.signin": "साइन इन",
    "auth.signup": "साइन अप",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.fullName": "पूरा नाम",
    "auth.phone": "फोन नंबर",
    "auth.confirmPassword": "पासवर्ड की पुष्टि करें",
    "auth.forgotPassword": "पासवर्ड भूल गए?",
    "auth.noAccount": "खाता नहीं है?",
    "auth.haveAccount": "पहले से खाता है?",
    "auth.createAccount": "खाता बनाएं",
    "auth.checkEmail": "अपनी ईमेल जांचें",
    "auth.emailSent": "हमने आपके ईमेल पर एक पुष्टि लिंक भेजा है",
    
    // Dashboard
    "dashboard.title": "डैशबोर्ड",
    "dashboard.welcome": "स्वागत है",
    "dashboard.scanner": "फसल स्कैनर",
    "dashboard.weather": "मौसम",
    "dashboard.mandi": "मंडी भाव",
    "dashboard.alerts": "सतर्कताएं",
    "dashboard.mitra": "कृषि मित्र",
    "dashboard.profile": "प्रोफाइल",
    
    // Scanner
    "scanner.title": "फसल स्कैनर",
    "scanner.takePicture": "तस्वीर लें",
    "scanner.uploadImage": "छवि अपलोड करें",
    "scanner.analyzing": "विश्लेषण जारी है...",
    "scanner.disease": "रोग",
    "scanner.healthy": "स्वस्थ",
    "scanner.solution": "समाधान",
    
    // Weather
    "weather.title": "मौसम पूर्वानुमान",
    "weather.temperature": "तापमान",
    "weather.humidity": "आर्द्रता",
    "weather.windSpeed": "हवा की गति",
    "weather.rainfall": "वर्षा",
    
    // Mandi
    "mandi.title": "मंडी भाव",
    "mandi.commodity": "वस्तु",
    "mandi.market": "बाजार",
    "mandi.price": "कीमत",
    "mandi.minPrice": "न्यूनतम कीमत",
    "mandi.maxPrice": "अधिकतम कीमत",
    "mandi.trend": "प्रवृत्ति",
    
    // Common
    "common.save": "सहेजें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.logout": "लॉगआउट",
    "common.language": "भाषा",
    "common.theme": "थीम",
    "common.dark": "अंधेरा",
    "common.light": "हल्का",
    
    // Profile Setup
    "profile.tellAboutFarm": "अपनी खेती के बारे में बताएं",
    "profile.personalizeForYou": "हम आपके लिए मौसम, मंडी भाव और सतर्कताओं को व्यक्तिगत करेंगे।",
    "profile.preferredLanguage": "पसंदीदा भाषा",
    "profile.detectingLocation": "आपका स्थान पता लगा रहे हैं...",
    "profile.autoDetectLocation": "मेरा स्थान स्वचालित रूप से पता लगाएं",
    "profile.state": "राज्य",
    "profile.selectState": "राज्य चुनें",
    "profile.district": "जिला",
    "profile.enterDistrict": "जिला दर्ज करें",
    "profile.village": "गांव",
    "profile.enterVillage": "गांव दर्ज करें",
    "profile.farmSize": "खेत का आकार (एकड़)",
    "profile.optional": "वैकल्पिक",
    "profile.primaryCrop": "प्राथमिक फसल",
    "profile.cropPlaceholder": "उदाहरण के लिए, गेहूं, धान, गन्ना",
    "profile.saving": "सहेज रहे हैं...",
    "profile.continueToDashboard": "डैशबोर्ड पर जारी रखें",
  },
}

export function t(key: string, lang: Language): string {
  return (translations[lang] as Record<string, string>)[key] || key
}
