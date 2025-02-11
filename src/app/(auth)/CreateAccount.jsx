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
const SignUpForm = ({ HideModels }) => {
  const { auth, handleGoogleSignup } = FirebaseData();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [modelVerify, setModelVerify] = useState(null);

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
        // OnHide()
        // CC("dd")
      } catch (error) {
        console.log("errdor", error);
      }
    } catch (error) {
      const errorCode = error.code;
      handleFirebaseAuthError(errorCode);
    } finally {
      // setShowLoader(false)
    }


  };
  const HideModelsFuc = () => {
    HideModels(!true)
  }
  const { language,translatedData } = useSelector((state) => state.Language)

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
                className={`absolute ${language=="ar"?"left-3":"right-3"} top-1/2 -translate-y-1/2 text-gray-500`}
              >
                {showPwd ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-rose-700 text-white py-3 rounded text-lg hover:bg-rose-800 transition"
            >
              Verify email address
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
