
'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { handleFirebaseAuthError, t } from "@/utils";
import { useSelector, shallowEqual } from "react-redux";
import { FaFacebook, FaLinkedin, FaPinterest, FaInstagram } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { SlLocationPin } from 'react-icons/sl';
import { RiMailSendFill } from 'react-icons/ri';
import { BiPhoneCall } from 'react-icons/bi';
function Footer() {
  const { language, translatedData } = useSelector((state) => state.Language);
  const { data } = useSelector((state) => state.Settings)
    // quickLinks section
  const quickLinks = [
    { href: '/contact-us', text: t('contactUs') },
    { href: '/subscription', text: t('subscription') },
    { href: '/blogs', text: t('ourBlog') },
    { href: '/faqs', text: t('faqs') },
  ];
  return (
    <div>
      {/*just static footer untill the data comes from api */}
      <footer className="bg-white ">
        ff
      </footer>
    </div>
  )
}

export default Footer