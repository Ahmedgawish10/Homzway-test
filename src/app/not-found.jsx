"use client"

import React from 'react'
import Link from "next/link"

import {  useSelector } from 'react-redux';

function NotFoundPage() {
    const { language, translatedData } = useSelector((state) => state.Language)

console.log(translatedData);

  return (
      <div>
      <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
    <div className="flex flex-col items-center">
        <h1 className="text-[120px] font-extrabold text-gray-700">404</h1>
        <p className="text-2xl font-medium text-gray-600 mb-6">{translatedData?.file_name?.errorOccurred}</p>
        <Link href="/"
            className="px-4 py-2 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 transition-all duration-200 ease-in-out">
            {translatedData?.file_name?.backToHome}
        </Link>
    </div>
</div>
    </div>
  )
}

export default NotFoundPage
