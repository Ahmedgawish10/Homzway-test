'use client'
import Image from 'next/image'
import React from 'react'
import mailVerification from '../../../public/icons/mailVerification.svg'
import { placeholderImage, t } from '@/utils'
import { MdClose } from 'react-icons/md'
import { FaArrowRightFromBracket } from "react-icons/fa6";


const MailSentSucessfully = () => {

    return (
        <div >
            <div className="close flex justify-end">  <MdClose className='cursor-pointer text-2xl' /></div>
            <div className='verify_email_modal flex flex-col items-center cursor-pointer'>
                <Image src={mailVerification} width={300} height={195} alt='Email Verification' className='email_verification' />
                <h1 className='got_mail text-center'>{t("youveGotMail")}</h1>
                <p className='click_toVerify'>{t("verifyAccount")}</p>
                <button className='go_inbox flex flex-col items-center ' >
                    <p>{t("checkEmail")}</p>
                    <FaArrowRightFromBracket size={16} className='mt-2' />
                </button>
            </div>
        </div>
    )
}

export default MailSentSucessfully