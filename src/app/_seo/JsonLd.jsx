"use client"
import { useSelector, useDispatch } from "react-redux";

export default function JsonLd() {
   const {jsonLdData} = useSelector((state)=>state.JsonLd);  
    return (   
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />
    );
}
