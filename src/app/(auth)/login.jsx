import React from 'react';
import Link from "next/link"
// import { MdClose } from "react-icons/md"
// import { FcGoogle } from "react-icons/fc";
import { useEffect, useRef, useState } from "react";
import { IoLinkOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';

import GoogleIcon from "../../../public/icons/google.svg";
import FacebookIcon from "../../../public/icons/facebook.svg";
import Logo1 from "../../../public/icons/logo1.svg";
import Image from "next/image";
import { sendEmailVerification, signInWithPhoneNumber, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";
import { handleFirebaseAuthError, t } from "@/utils";
import { userSignUpApi } from "@/api/apiCalling";
import { Fcmtoken, settingsData } from "@/store/slices/settingSlice";
// import { loadUpdateData } from "@/store/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";
import FirebaseData from '@/config/firebase';
import CreateAccount from '@/app/(auth)/CreateAccount';
import { validateForm } from '@/utils';
import { setUserVerfied } from '@/store/slices/authSlice.js';


const LoginPopup = ({ onClose }) => {
    const router = useRouter()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const { auth, handleGoogleSignup } = FirebaseData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginWithEmail, setLoginWithEmail] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [joinWithEmail, setJoinWithEmail] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [allModels, setAllModels] = useState(true);
    const fetchFCM = useSelector(Fcmtoken);
    const { language, translatedData } = useSelector((state) => state.Language)

    // hide all models (login register etc....)
    const HideModels = (val) => {
        setAllModels(val)
    }
    // handle (show&hide) modelLoginWithEmail
    const modelLoginWithEmail = () => {
        setLoginWithEmail(!loginWithEmail)
        setCreateAccount(false)
        setJoinWithEmail(false)
    }
    // handle (show&hide) modelCreateAccount
    const modelCreateAccount = () => {
        setCreateAccount(!createAccount);
        setLoginWithEmail(false)
    }
    // handle (show&hide) model modelJoinWithEmail 
    const modelJoinWithEmail = () => {
        setJoinWithEmail(!joinWithEmail)
        setLoginWithEmail(false)
        setCreateAccount(false)
    }
    // handle Login to homzway
    const Login = async (e) => {
        setShowLoader(true)
        e.preventDefault();
        if (!validateForm({ email, password, isLogin: "true" }, t)) return;
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (!user) {
                toast.error(t("userNotFound"));
                return;
            }
            console.log("User Credential:", userCredential);
            console.log("Email Verified:", user.emailVerified);
            if (user.emailVerified) {
                try {
                    const response = await userSignUpApi.userSignup({
                        name: user?.displayName || "",
                        email: user?.email || "",
                        firebase_id: user?.uid,
                        fcm_id: fetchFCM || "",
                        type: "email"
                    });
                    dispatch(setUserVerfied(user))
                    const data = response.data;
                    setAllModels(false)
                    if (data.error) {
                        toast.error(data.message);
                    } else {
                        toast.success(`welcome back ${data.data.name}`, { duration: 3000 });
                    }
                    if (pathname !== "/home") {
                        if (!data?.data?.mobile) {
                            // router.push("/profile/edit-profile");
                        }
                    }
                } catch (error) {
                    console.error("API Signup Error:", error);
                    toast.error(t("signupError"));
                }
            } else {
                toast.error(t("verifyEmailFirst"));
                await sendEmailVerification(auth.currentUser || user);
            }
        } catch (error) {
            console.log("Firebase Auth Error:", error);
            handleFirebaseAuthError(error.code);
        } finally {
            setShowLoader(false);
        }
    };
    // handle Signin with google to homzway
    const SignWithGoogle = async () => {
        const Response = await handleGoogleSignup();
        if (!Response) {
            onClose()
        }
    }
    const onClose1 = () => {
        onClose()
        setAllModels(0)
        router.push("/")
    }
    //    console.log(9,translatedData?.file_name);

    return (
        <>

            {allModels && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 top-0 right-0 left-0 ">
                    <div id="login-popup" tabIndex="-1"
                        className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50  h-full items-center justify-center flex" >
                        <div className=" flex items-center  relative p-4 w-auto max-w-md h-full md:h-auto">

                            <div className="relative bg-white rounded-lg shadow h-auto overflow-auto">
                                <button onClick={onClose1}
                                    type="button"
                                    className="absolute top-3 right-2.5 text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close">
                                    <span className="sr-only">Close popup</span>
                                    <IoClose className='text-2xl' />
                                </button>
                                <div className="logo flex justify-center"> <Image
                                    src={Logo1} alt="GitHub"
                                    className="h-[6rem] w-[180px] mb-[-20px] " />

                                </div>

                                {/* first section for login homzway */}
                                {(!loginWithEmail && !createAccount && !joinWithEmail) && (
                                    <div className="px-5 pb-4">
                                        <h3 className="text-2xl mb-0.5 font-medium"></h3>
                                        <p className="mb-4 text-sm font-normal text-gray-800"></p>

                                        <div className="text-center flex flex-col items-center ">
                                            <p className="mb-3 text-2xl leading-9 sm:w-[80%] font-semibold  text-slate-900">
                                                {translatedData?.file_name?.loginTo}  {language == "ar" ? "" : "  Homzway account"}
                                            </p>

                                        </div>

                                        <div className="mt-7 flex flex-col gap-2">
                                            <button
                                                onClick={SignWithGoogle}
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <Image
                                                    src={GoogleIcon} alt="GitHub"
                                                    className="h-[25px] w-[25px]" />
                                                <span className='text-[16px] font-bold'>
                                                    {translatedData?.file_name?.orSignInWith}
                                                    <span className="px-2"> {translatedData?.file_name?.google} </span>
                                                </span>
                                            </button>
                                            <button
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <Image
                                                    src={FacebookIcon} alt="Google"
                                                    className="h-[25px] w-[25px]" />
                                                <span className='text-[16px] font-bold'>
                                                    {translatedData?.file_name?.orSignInWith}
                                                    <span className="px-2"> {translatedData?.file_name?.facebook} </span>
                                                </span>
                                            </button>
                                        </div>
                                        <div className="flex w-full items-center gap-2 py-6 pb-3 text-xl text-slate-600">
                                            <div className=" text-xl w-full bg-slate-200"></div>
                                            {translatedData?.file_name?.or}
                                            <div className="h-px w-full bg-slate-200"></div>
                                        </div>
                                        <div className="mt-7 flex flex-col gap-2">
                                            <button
                                                onClick={modelLoginWithEmail}
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <MdOutlineEmail className="text-[20px] font-extrabold text-[#e00000]" />
                                                <span className='text-[16px] font-bold'>
                                                    {translatedData?.file_name?.orSignInWith}
                                                    <span className="px-2"> {translatedData?.file_name?.email} </span>
                                                </span>
                                            </button>
                                            <button
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <FiPhone className="text-[20px] font-extrabold text-[#e00000]" />
                                                <span className='text-[16px] font-bold'>
                                                    {translatedData?.file_name?.orSignInWith}
                                                    <span className="px-2"> {translatedData?.file_name?.phone} </span>
                                                </span>
                                            </button>
                                        </div>
                                        <div
                                            onClick={modelCreateAccount}
                                            className="mt-6 text-center cursor-pointer text-red-600 font-extrabold">
                                            {translatedData?.file_name?.createAccount}
                                        </div>
                                    </div>
                                )}
                                {/* section login with email */}
                                {loginWithEmail && (
                                    <div className=" flex justify-center items-center dark:bg-gray-900">
                                        <div className="grid gap-8">
                                            <div id="back-div" className=" bg-white">
                                                <div className=" border-transparent    sm:p-2 m-2">
                                                    <div className={`absolute  ${language == "ar" ? "left-1" : " "} top-[15px]  arrow-back cursor-pointer`} onClick={modelLoginWithEmail} >
                                                        <IoIosArrowBack className="text-xl" />
                                                    </div>
                                                    <h4 className="pt-2 pb-6 font-bold text-2xl text-center cursor-default">
                                                        {translatedData?.file_name?.signInWithEmail}
                                                    </h4>
                                                    <form className="space-y-4" onSubmit={Login}>
                                                        <div>
                                                            <label htmlFor="email" className="mb-2 text-lg hidden">
                                                                Email address
                                                            </label>
                                                            <input id="email" className="border p-3   shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                                             type="email" placeholder={translatedData?.file_name?.enterEmail}
                                                                onChange={(e) => setEmail(e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="password" className="mb-2  text-lg hidden">
                                                                Password
                                                            </label>
                                                            <input id="password"  className="border p-3 shadow-md  placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                                                type="password" placeholder={translatedData?.file_name?.enterPassword}
                                                                onChange={(e) => setPassword(e.target.value)} />
                                                        </div>
                                                        <div className=" !mt-1 ">
                                                            <span className="cursor-pointer font-extrabold text-red-600  bg-left-bottom bg-gradient-to-r text-sm from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                                                {translatedData?.file_name?.forgtPassword}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className={`bg-gradient-to-r flex justify-center dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out  `}
                                                            type="submit" >
                                                            {showLoader ?
                                                                <div role="status">
                                                                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                    </svg>
                                                                    <span class="sr-only">Loading...</span>
                                                                </div> : translatedData?.file_name?.signIn}
                                                        </button>
                                                    </form>
                                                    <div className="flex w-full items-center gap-2 py-6 pb-3 text-xl text-slate-600">
                                                        <div className=" text-xl w-full bg-slate-200"></div>
                                                        {translatedData?.file_name?.or}
                                                        <div className="h-px w-full bg-slate-200"></div>
                                                    </div>
                                                    <div className='text-center'>Try a <span className='font-extrabold'> password-free login</span> </div>
                                                    <button
                                                        className=" mt-3 hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                        <IoLinkOutline className="text-[20px] " />
                                                        <span className='font-extrabold text-[17px]'>Log in with a one-time link</span>
                                                    </button>
                                                    <div
                                                        onClick={modelCreateAccount}
                                                        className="mt-2 text-center   cursor-pointer text-red-600 font-extrabold">
                                                        {translatedData?.file_name?.createAccount}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* section createAccount homzway */}
                                {createAccount && (
                                    <div className="px-5 pb-2">
                                        <h3 className="text-2xl mb-0.5 font-medium"></h3>
                                        <p className="mb-4 text-sm font-normal text-gray-800"></p>

                                        <div className="text-center flex flex-col items-center ">
                                            <p className="mb-3 text-2xl leading-9 sm:w-[80%] font-semibold  text-slate-900">
                                                Create a new Homzway account
                                            </p>

                                        </div>
                                        <div className="mt-7 flex flex-col gap-2">
                                            <button
                                                onClick={SignWithGoogle}
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <Image
                                                    src={GoogleIcon} alt="GitHub"
                                                    className="h-[25px] w-[25px]" />
                                                <span className='text-[16px] font-bold'>  Join with Google</span>
                                            </button>
                                            <button
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <Image
                                                    src={FacebookIcon} alt="Google"
                                                    className="h-[25px] w-[25px]" />
                                                <span className='text-[16px] font-bold'> Join with Facebook</span>

                                            </button>
                                        </div>

                                        <div className="flex w-full items-center gap-2 py-6 pb-3 text-xl text-slate-600">
                                            <div className=" text-xl w-full bg-slate-200"></div>
                                            {translatedData?.file_name?.or}
                                            <div className="h-px w-full bg-slate-200"></div>
                                        </div>
                                        <div className="mt-7 flex flex-col gap-2">
                                            <button
                                                onClick={modelJoinWithEmail}
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <MdOutlineEmail className="text-[20px] font-extrabold text-[#e00000]" />
                                                <span className='text-[16px] font-bold'>   Join with Email</span>
                                            </button>

                                            <button
                                                className=" hover:bg-[#fef5f5] border-[0.1rem] border-[#f08080] inline-flex h-[48px] w-full items-center justify-center gap-2 rounded  bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60">
                                                <FiPhone className="text-[20px] font-extrabold text-[#e00000]" />

                                                <span className='text-[16px] font-bold'> Join with Phone</span>
                                            </button>
                                        </div>
                                        <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm">
                                            <p className="cursor-default">
                                                <a className="group text-blue-400 transition-all duration-100 ease-in-out" href="#">
                                                    <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                                                        {translatedData?.file_name?.agreeCreateAccount}

                                                    </span>
                                                </a>

                                            </p>
                                        </div>
                                        <div
                                            onClick={modelCreateAccount}
                                            className="mt-6 text-center   cursor-pointer text-red-600 font-extrabold">
                                            {translatedData?.file_name?.haveAccount}
                                        </div>
                                    </div>
                                )}
                                {/* section Join with email to homzway */}
                                {joinWithEmail && (
                                    <>
                                        <div className="max-w-xl pb-5 px-8 h-auto mt-3 bg-white ">

                                            <CreateAccount HideModels={HideModels} onClose={onClose1} />
                                            <div
                                                onClick={modelLoginWithEmail}
                                                className="mt-6 text-center   cursor-pointer text-red-600 font-extrabold">
                                                {translatedData?.file_name?.haveAccount}
                                                {/* <a href="/signup" className="font-medium text-[#4285f4]">Sign up</a> */}
                                            </div>
                                        </div>


                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginPopup;







