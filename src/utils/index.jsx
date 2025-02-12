'use client';
import toast from 'react-hot-toast';
import enTranslation from '@/utils/locale/en.json';
import { store } from '@/store/store';
import { CurrentLanguageData } from '@/store/slices/languageSlice';
import { useSelector } from 'react-redux';
import { logoutSuccess } from '@/store/slices/authSlice';
import { useJsApiLoader } from '@react-google-maps/api';

// define  libraries googlr api array as a constant 
const GOOGLE_MAPS_LIBRARIES = ['geometry', 'drawing', 'places'];

// Utility Functions state 
// export const placeholderImage = (e) => {
//   const settings = store.getState()?.Settings?.data?.data;
//   const placeholderLogo = settings?.placeholder_image;

//   if (placeholderLogo) {
//     e.target.src = placeholderLogo;
//   }
// };

// export const isLogin = () => {
//   const userData = store.getState()?.UserSignup?.data;
//   return !!userData?.token;
// };

// export const IsLandingPageOn = () => {
//   const settings = store.getState()?.Settings?.data?.data;
//   return Number(settings?.show_landing_page);
// };

// export const getDefaultLatLong = () => {
//   const settings = store.getState()?.Settings?.data?.data;
//   const default_latitude = Number(settings?.default_latitude);
//   const default_longitude = Number(settings?.default_longitude);

//   return {
//     latitude: default_latitude,
//     longitude: default_longitude,
//   };
// };

// export const getPlaceApiKey = () => {
//   const settings = store.getState()?.Settings?.data?.data;
//   return "AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY";
// };

export const loadGoogleMaps = () => {
  const settings = store.getState()?.Settings?.data?.data;
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
};

export const getSlug = (pathname) => {
  const segments = pathname.split('/');
  return segments[segments.length - 1];
};

// export const formatDate = (createdAt) => {
//   const date = new Date(createdAt);
//   const now = new Date();
//   const diff = now.getTime() - date.getTime();
//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//   if (days === 0) {
//     return t('today');
//   } else if (days === 1) {
//     return t('yesterday');
//   } else if (days < 30) {
//     return `${days} ${t('daysAgo')}`;
//   } else if (days < 365) {
//     const months = Math.floor(days / 30);
//     return `${months} ${t('month')}${months > 1 ? t('s') : ''} ${t('ago')}`;
//   } else {
//     const years = Math.floor(days / 365);
//     return `${years} ${t('year')}${years > 1 ? t('s') : ''} ${t('ago')}`;
//   }
// };

// export const exactPrice = (price) => {
//   const countryCode = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY?.toUpperCase() || 'US';
//   const locale = countryLocaleMap[countryCode] || 'en-US';
//   const settingsData = store.getState()?.Settings?.data?.data;
//   const currencyPosition = settingsData?.currency_symbol_position;
//   const currencySymbol = settingsData?.currency_symbol;

//   const formattedNumber = new Intl.NumberFormat(locale, {
//     maximumFractionDigits: 2,
//     useGrouping: true,
//   }).format(Number(price));

//   return currencyPosition === 'right'
//     ? `${formattedNumber} ${currencySymbol}`
//     : `${currencySymbol} ${formattedNumber}`;
// };

// export const formatPriceAbbreviated = (price) => {
//   const settingsData = store.getState()?.Settings?.data?.data;
//   const currencySymbol = settingsData?.currency_symbol;
//   const currencyPosition = settingsData?.currency_symbol_position;
//   const countryCode = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY?.toUpperCase() || 'US';
//   const locale = countryLocaleMap[countryCode] || 'en-US';

//   const formattedNumber = new Intl.NumberFormat(locale, {
//     maximumFractionDigits: 2,
//     useGrouping: true,
//   }).format(Number(price));

//   return currencyPosition === 'right'
//     ? `${formattedNumber} ${currencySymbol}`
//     : `${currencySymbol} ${formattedNumber}`;
// };

export const createStickyNote = () => {
  const stickyNote = document.createElement('div');
  stickyNote.style.position = 'fixed';
  stickyNote.style.bottom = '0';
  stickyNote.style.width = '100%';
  stickyNote.style.backgroundColor = '#ffffff';
  stickyNote.style.color = '#000000';
  stickyNote.style.padding = '10px';
  stickyNote.style.textAlign = 'center';
  stickyNote.style.fontSize = '14px';
  stickyNote.style.zIndex = '99999';

  const closeButton = document.createElement('span');
  closeButton.style.cursor = 'pointer';
  closeButton.style.float = 'right';
  closeButton.innerHTML = '&times;';

  closeButton.onclick = () => document.body.removeChild(stickyNote);

  const link = document.createElement('a');
  link.style.textDecoration = 'underline';
  link.style.color = '#3498db';
  link.innerText = 'Download Now';
  link.href = store.getState()?.Settings?.data?.data?.play_store_link;

  stickyNote.innerHTML = 'Chat and Notification features are not supported on this browser. For a better user experience, please use our mobile application. ';
  stickyNote.appendChild(closeButton);
  stickyNote.appendChild(link);

  document.body.appendChild(stickyNote);
};

export const t = (label) => {
  const langData = store.getState().Language?.translatedData?.file_name?.[label];
  return langData 
  // || enTranslation[label];
};

const ERROR_CODES = {
  'auth/user-not-found': t('userNotFound'),
  'auth/wrong-password': t('invalidPassword'),
  'auth/email-already-in-use': t('emailInUse'),
  'auth/invalid-email': t('invalidEmail'),
  'auth/user-disabled': t('userAccountDisabled'),
  'auth/too-many-requests': t('tooManyRequests'),
  'auth/operation-not-allowed': t('operationNotAllowed'),
  'auth/internal-error': t('internalError'),
  'auth/invalid-login-credentials': t('incorrectDetails'),
  'auth/invalid-credential': t('incorrectDetails'),
  'auth/admin-restricted-operation': t('adminOnlyOperation'),
  'auth/already-initialized': t('alreadyInitialized'),
  'auth/app-not-authorized': t('appNotAuthorized'),
  'auth/app-not-installed': t('appNotInstalled'),
  'auth/argument-error': t('argumentError'),
  'auth/captcha-check-failed': t('captchaCheckFailed'),
  'auth/code-expired': t('codeExpired'),
  'auth/cordova-not-ready': t('cordovaNotReady'),
  'auth/cors-unsupported': t('corsUnsupported'),
  'auth/credential-already-in-use': t('credentialAlreadyInUse'),
  'auth/custom-token-mismatch': t('customTokenMismatch'),
  'auth/requires-recent-login': t('requiresRecentLogin'),
  'auth/dependent-sdk-initialized-before-auth': t('dependentSdkInitializedBeforeAuth'),
  'auth/dynamic-link-not-activated': t('dynamicLinkNotActivated'),
  'auth/email-change-needs-verification': t('emailChangeNeedsVerification'),
  'auth/emulator-config-failed': t('emulatorConfigFailed'),
  'auth/expired-action-code': t('expiredActionCode'),
  'auth/cancelled-popup-request': t('cancelledPopupRequest'),
  'auth/invalid-api-key': t('invalidApiKey'),
  'auth/invalid-app-credential': t('invalidAppCredential'),
  'auth/invalid-app-id': t('invalidAppId'),
  'auth/invalid-user-token': t('invalidUserToken'),
  'auth/invalid-auth-event': t('invalidAuthEvent'),
  'auth/invalid-cert-hash': t('invalidCertHash'),
  'auth/invalid-verification-code': t('invalidVerificationCode'),
  'auth/invalid-continue-uri': t('invalidContinueUri'),
  'auth/invalid-cordova-configuration': t('invalidCordovaConfiguration'),
  'auth/invalid-custom-token': t('invalidCustomToken'),
  'auth/invalid-dynamic-link-domain': t('invalidDynamicLinkDomain'),
  'auth/invalid-emulator-scheme': t('invalidEmulatorScheme'),
  'auth/invalid-message-payload': t('invalidMessagePayload'),
  'auth/invalid-multi-factor-session': t('invalidMultiFactorSession'),
  'auth/invalid-oauth-client-id': t('invalidOauthClientId'),
  'auth/invalid-oauth-provider': t('invalidOauthProvider'),
  'auth/invalid-action-code': t('invalidActionCode'),
  'auth/unauthorized-domain': t('unauthorizedDomain'),
  'auth/invalid-persistence-type': t('invalidPersistenceType'),
  'auth/invalid-phone-number': t('invalidPhoneNumber'),
  'auth/invalid-provider-id': t('invalidProviderId'),
  'auth/invalid-recaptcha-action': t('invalidRecaptchaAction'),
  'auth/invalid-recaptcha-token': t('invalidRecaptchaToken'),
  'auth/invalid-recaptcha-version': t('invalidRecaptchaVersion'),
  'auth/invalid-recipient-email': t('invalidRecipientEmail'),
  'auth/invalid-req-type': t('invalidReqType'),
  'auth/invalid-sender': t('invalidSender'),
  'auth/invalid-verification-id': t('invalidVerificationId'),
  'auth/invalid-tenant-id': t('invalidTenantId'),
  'auth/multi-factor-info-not-found': t('multiFactorInfoNotFound'),
  'auth/multi-factor-auth-required': t('multiFactorAuthRequired'),
  'auth/missing-android-pkg-name': t('missingAndroidPkgName'),
  'auth/missing-app-credential': t('missingAppCredential'),
  'auth/auth-domain-config-required': t('authDomainConfigRequired'),
  'auth/missing-client-type': t('missingClientType'),
  'auth/missing-verification-code': t('missingVerificationCode'),
  'auth/missing-continue-uri': t('missingContinueUri'),
  'auth/missing-iframe-start': t('missingIframeStart'),
  'auth/missing-ios-bundle-id': t('missingIosBundleId'),
  'auth/missing-multi-factor-info': t('missingMultiFactorInfo'),
  'auth/missing-multi-factor-session': t('missingMultiFactorSession'),
  'auth/missing-or-invalid-nonce': t('missingOrInvalidNonce'),
  'auth/missing-phone-number': t('missingPhoneNumber'),
  'auth/missing-recaptcha-token': t('missingRecaptchaToken'),
  'auth/missing-recaptcha-version': t('missingRecaptchaVersion'),
  'auth/missing-verification-id': t('missingVerificationId'),
  'auth/app-deleted': t('appDeleted'),
  'auth/account-exists-with-different-credential': t('accountExistsWithDifferentCredential'),
  'auth/network-request-failed': t('networkRequestFailed'),
  'auth/no-auth-event': t('noAuthEvent'),
  'auth/no-such-provider': t('noSuchProvider'),
  'auth/null-user': t('nullUser'),
  'auth/operation-not-supported-in-this-environment': t('operationNotSupportedInThisEnvironment'),
  'auth/popup-blocked': t('popupBlocked'),
  'auth/popup-closed-by-user': t('popupClosedByUser'),
  'auth/provider-already-linked': t('providerAlreadyLinked'),
  'auth/quota-exceeded': t('quotaExceeded'),
  'auth/recaptcha-not-enabled': t('recaptchaNotEnabled'),
  'auth/redirect-cancelled-by-user': t('redirectCancelledByUser'),
  'auth/redirect-operation-pending': t('redirectOperationPending'),
  'auth/rejected-credential': t('rejectedCredential'),
  'auth/second-factor-already-in-use': t('secondFactorAlreadyInUse'),
  'auth/maximum-second-factor-count-exceeded': t('maximumSecondFactorCountExceeded'),
  'auth/tenant-id-mismatch': t('tenantIdMismatch'),
  'auth/timeout': t('timeout'),
  'auth/user-token-expired': t('userTokenExpired'),
  'auth/unauthorized-continue-uri': t('unauthorizedContinueUri'),
  'auth/unsupported-first-factor': t('unsupportedFirstFactor'),
  'auth/unsupported-persistence-type': t('unsupportedPersistenceType'),
  'auth/unsupported-tenant-operation': t('unsupportedTenantOperation'),
  'auth/unverified-email': t('unverifiedEmail'),
  'auth/user-cancelled': t('userCancelled'),
  'auth/user-mismatch': t('userMismatch'),
  'auth/user-signed-out': t('userSignedOut'),
  'auth/weak-password': t('weakPassword'),
  'auth/web-storage-unsupported': t('webStorageUnsupported'),
};

export const handleFirebaseAuthError = (errorCode) => {
  if (ERROR_CODES[errorCode]) {
    toast.error(ERROR_CODES[errorCode]);
  } else {
    toast.error(`${t('errorOccurred')}:${errorCode}`);
  }
};

// export const truncate = (text, maxLength) => {
//   if (!text) return '';
//   const stringText = String(text);
//   return stringText.length <= maxLength ? text : `${stringText.slice(0, maxLength)}...`;
// };




// export const formatDateMonth = (timestamp) => {
//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
//   ];
//   const date = new Date(timestamp);
//   const year = date.getFullYear();
//   const month = months[date.getMonth()];
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${month} ${parseInt(day, 10)}, ${year}`;
// };

// export const loadStripeApiKey = () => {
//   const STRIPEData = store.getState()?.Settings;
//   return STRIPEData?.data?.stripe_publishable_key || false;
// };

// export const useIsRtl = () => {
//   const lang = useSelector(CurrentLanguageData);
//   return lang?.rtl === true;
// };

// export const logout = () => {
//   store.dispatch(logoutSuccess());
// };

// export const generateSlug = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-')
//     .replace(/^-+|-+$/g, '');
// };

// export const isEmptyObject = (obj) => {
//   // console.log(obj);

//   return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
// }

// export const measureCategoryWidth = (categoryName) => {
//   const tempElement = document.createElement('span');
//   tempElement.style.display = 'inline-block';
//   tempElement.style.visibility = 'hidden';
//   tempElement.style.position = 'absolute';
//   tempElement.innerText = categoryName;
//   document.body.appendChild(tempElement);
//   const width = tempElement.offsetWidth + 15; // icon width(12) + gap(3)
//   document.body.removeChild(tempElement);
//   return width;
// };

// export const formatTime = (dateString) => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);
//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   const diffInDays = Math.floor(diffInHours / 24);
//   const diffInWeeks = Math.floor(diffInDays / 7);
//   const diffInMonths = Math.floor(diffInDays / 30);
//   const diffInYears = Math.floor(diffInDays / 365);

//   if (diffInSeconds < 60) {
//     return t('now');
//   } else if (diffInMinutes < 60) {
//     return `${diffInMinutes}m`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours}h`;
//   } else if (diffInDays === 1) {
//     return t('yesterday');
//   } else if (diffInDays < 7) {
//     return `${diffInDays}d`;
//   } else if (diffInWeeks < 4) {
//     return `${diffInWeeks}w`;
//   } else if (diffInMonths < 12) {
//     return `${diffInMonths}mo`;
//   } else {
//     return `${diffInYears}y`;
//   }
// };

// export const isValidURL = (url) => {
//   const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
//   return pattern.test(url);
// };

// export const formatDuration = (duration) => {
//   const minutes = Math.floor(duration / 60);
//   const seconds = duration % 60;
//   return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
// };

// export const formatChatMessageTime = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
// };

// export const formatMessageDate = (dateString) => {
//   const messageDate = new Date(dateString);
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   if (messageDate.toDateString() === today.toDateString()) {
//     return t('today');
//   } else if (messageDate.toDateString() === yesterday.toDateString()) {
//     return t('yesterday');
//   } else {
//     return messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
//   }
// };

export const validateForm = (formData) => {
  const { username, email, password, isLogin } = formData;
  console.log(formData);
  if (!isLogin) {
    if (!isLogin && !username) {
      toast.error(t('nameRequired'));
      return false;
    }
  }
  if (!email) {
    toast.error(t('emailRequired'));
    return false;
  }
  if (!password) {
    toast.error(t('passwordRequired'));
    return false;
  }

  return true;
};

// export const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

// export const IsAdExpired = (SingleListing) => {
//   if (!SingleListing?.expiry_date) return false;
//   const expiryDate = new Date(SingleListing.expiry_date);
//   const currentDate = new Date();
//   return expiryDate < currentDate;
// };

// export const formatMyListingDate = (dateStr) => {
//   const date = new Date(dateStr);
//   if (isNaN(date.getTime())) return 'Invalid date';

//   const options = { month: 'short', day: '2-digit', year: 'numeric' };
//   const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
//   const [month, day, year] = formattedDate.split(' ');
//   return `${month}, ${day.slice(0, -1)}, ${year}`;
// };

// export const getYouTubeVideoId = (url) => {
//   const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//   const match = url?.match(regExp);
//   return match && match[2].length === 11 ? match[2] : null;
// };

// export const getImageClass = (src) => {
//   if (src?.endsWith('.svg') || src?.endsWith('.png')) {
//     return 'svgPngBackground';
//   }
//   return 'jpgNoBackround';
// };

// export const formatProdDate = (dateString) => {
//   if (!dateString) return '';
//   const date = new Date(dateString);
//   const options = { year: 'numeric', month: 'short', day: 'numeric' };
//   return new Intl.DateTimeFormat('en-US', options).format(date);
// };

// export const extractYear = (dateString) => {
//   const date = new Date(dateString);
//   return date.getFullYear();
// };

// export const calculateRatingPercentages = (ratings) => {
//   const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//   ratings?.forEach((rating) => {
//     const roundedRating = Math.round(rating?.ratings);
//     if (roundedRating >= 1 && roundedRating <= 5) {
//       ratingCount[roundedRating] += 1;
//     }
//   });

//   const totalRatings = ratings.length;
//   const ratingPercentages = {
//     5: (ratingCount[5] / totalRatings) * 100,
//     4: (ratingCount[4] / totalRatings) * 100,
//     3: (ratingCount[3] / totalRatings) * 100,
//     2: (ratingCount[2] / totalRatings) * 100,
//     1: (ratingCount[1] / totalRatings) * 100,
//   };

//   return { ratingCount, ratingPercentages };
// };

// export const getRoundedRating = (rating) => {
//   if (!rating) return 0;
//   const integerPart = Math.floor(rating);
//   const decimalPart = rating - integerPart;
//   return decimalPart > 0 ? integerPart + 0.5 : integerPart;
// };

export function formatLocation(locationUser) {
  // console.log(locationUser);

  if (typeof locationUser === "object" && locationUser !== null) {
    const formattedAddressParts = locationUser?.formattedAddress?.split(" ");
    const city = formattedAddressParts?.length > 1 ? formattedAddressParts[1]?.replace(",", "") : "";
    const state = locationUser?.state?.replace(" Governorate", "") || "";

    return city && state ? `${city}, ${state}` : state;


    return locationUser.city
  } else {
    return locationUser || "Location not available";
  }
};