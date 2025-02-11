"use client";
import React, { memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

function CatgoriesMin() {
    const { cateData } = useSelector((state) => ({ cateData: state.Category.cateData}), shallowEqual);

    console.log("t", cateData); // Log the cateData for debugging

    return (
        <div clssName="catgoriesMin-lg">
            <ul>
                {cateData?.slice(0,3).map((category, index) => (
                    <li key={index}>{category.name}</li> 
                ))}
            </ul>
        </div>
    );
}

export default memo(CatgoriesMin); 