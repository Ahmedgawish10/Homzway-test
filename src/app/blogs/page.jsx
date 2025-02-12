"use client"

import React from 'react'
import { useSelector } from 'react-redux';
function page() {
    const { language, translatedData } = useSelector((state) => state.Language);
    console.log(translatedData);
    
  return (
    <div>
      hi
    </div>
  )
}

export default page
