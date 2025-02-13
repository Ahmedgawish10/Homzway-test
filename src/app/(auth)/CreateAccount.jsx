import { useDispatch, useSelector } from 'react-redux';

import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import { GoogleAuthProvider, RecaptchaVerifier, createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup } from "firebase/auth";
import FirebaseData from '@/config/firebase';
import { handleFirebaseAuthError, t } from "@/utils";
import { userSignUpApi } from "@/api/apiCalling";
import MailSentSucessfully from "@/app/(auth)/MailSentSucessfully";
import { validateForm } from '@/utils';

const SignUpForm = ({ HideModels, onClose }) => {
  const { auth, handleGoogleSignup } = FirebaseData();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [modelVerify, setModelVerify] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const sendOTP = async () => {
    // setShowLoader(true)
    const PhoneNumber = `${countryCode}${formattedNumber}`;
    try {
      const appVerifier = generateRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, PhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast.success(t("otpSentSuccess"));
      // if (isDemoMode) {
      //     setOtp("123456")

      // }
      // if (resendOtpLoader) {
      //    setResendOtpLoader(false)
      // }
    } catch (error) {
      const errorCode = error.code;
      //handleFirebaseAuthError(errorCode);
      // if (resendOtpLoader) {
      //     setResendOtpLoader(false)
      // }
    } finally {
      // setShowLoader(false);
      // otpInputRef.current.focus()
    }

  };
  const verifyOTP = async (e) => {
    e.preventDefault();

    try {
      if (otp === '') {
        toast.error(t('otpmissing'))
        return
      }
      setShowLoader(true)
      const result = await confirmationResult.confirm(otp);
      // Access user information from the result
      const user = result.user;

      try {
        const response = await userSignUpApi.userSignup({
          mobile: formattedNumber,
          firebase_id: user.uid, // Accessing UID directly from the user object
          fcm_id: fetchFCM ? fetchFCM : "",
          country_code: countryCode,
          type: "phone"
        });

        const data = response.data;
        loadUpdateData(data)
        toast.success(data.message);
        if (pathname !== '/home') {
          if (data?.data?.email === "") {
            router.push('/profile/edit-profile')
          }
        }
        setShowLoader(false)
        OnHide();
      } catch (error) {
        console.error("Error:", error);
        setShowLoader(false)
      }
      // Perform necessary actions after OTP verification, like signing in
    } catch (error) {
      const errorCode = error.code;
      handleFirebaseAuthError(errorCode);
      setShowLoader(false)
    }
  };

  const CreateAccount = async (e) => {
    e.preventDefault();
    if (!validateForm(form, t)) return;
    try {
      setShowLoader(true)
      // setShowLoader(true)
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      console.log(user);

      await sendEmailVerification(user);
      setModelVerify(true)

      toast.success("Check your email now!")
      try {
        const response = await userSignUpApi.userSignup({
          name: form.username ? form.username : "",
          email: form.email ? form.email : "",
          firebase_id: user?.uid,
          type: "email",
          registration: true
        });
        onClose()
        // CC("dd")
      } catch (error) {
        console.log("errdor", error);
      }
    } catch (error) {
      const errorCode = error.code;
      handleFirebaseAuthError(errorCode);
    } finally {
      setShowLoader(false)
    }


  };
  const HideModelsFuc = () => {
    HideModels(!true)
  }
  const { language, translatedData } = useSelector((state) => state.Language)
  console.log(translatedData);

  return (
    <>
      <div className="flex items-center justify-center ">
        <div className=" w-full bg-white rounded  ">
          <h2 className="text-xl font-bold text-center mb-4">{translatedData?.file_name?.createAccount}</h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={CreateAccount}>
            <div>
              <input
                type="text"
                name="username"
                value={form.name}
                onChange={handleInputChange}
                placeholder={translatedData?.file_name?.enterName}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder={translatedData?.file_name?.enterEmail}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder={translatedData?.file_name?.enterPassword}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className={`absolute ${language == "ar" ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-gray-500`}
              >
                {showPwd ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center bg-rose-700 text-white py-3 rounded text-lg hover:bg-rose-800 transition"
            >
                {showLoader ?<div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div> : translatedData?.file_name?.checkEmail}
            </button>
            

          </form>
        </div>
      </div>
      {
        modelVerify && (
          <div onClick={HideModelsFuc} className=" bg-[#ffffff] flex justify-center items-center w-[100vw] h-[100vh] fixed right-0 bottom-0 top-0">
            <MailSentSucessfully />
          </div>
        )

      }

    </>

  );
};

export default SignUpForm
