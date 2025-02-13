"use client"

import React from 'react'
import { useSelector } from 'react-redux';
import Layout from '@/Layout/MainLayout'

function page() {
    const { language, translatedData } = useSelector((state) => state.Language);
    console.log(translatedData);
    
  return (
    <Layout>

    <div>
      hi
    </div>
    </Layout>

  )
}

export default page


