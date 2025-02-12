"use client";
import React, { memo } from "react";
import { useSelector, shallowEqual } from "react-redux";

function CatgoriesMin() {
    const { cateData } = useSelector(
        (state) => ({ cateData: state.Category.cateData }),
        shallowEqual
    );
    const { productsData } = useSelector((state) => state.Products);
    const { language } = useSelector((state) => state.Language);

    return (
        <div className="catgoriesMin-lg border-t border-slate-200 py-3">
            <div className="container mx-auto px-3 gap-2 flex justify-between">
                {cateData
                    ?.slice(0, 5) // Get 5 categories
                    .map((category, index) => {
                        const categoryProducts = productsData?.filter(
                            (product) => product.category.name === category.name
                        );

                        return (
                            <div
                                className={`cursor-pointer w-full relative flex-1 ${ categoryProducts.length === 0 ? "" : "group" }
                                 ${index >= 3 ? "hidden md:block" : ""}`} // Show 4 by default, 5 on md+
                                key={index}
                            >
                                <div className="bg-red-200 flex justify-center">
                                    <span className="hover:text-red-600 hover:border-b-2 pb-1 border-cyan-700">
                                        {language === "en"
                                            ? category.name
                                            : category?.translations?.map(
                                                  (translation, i) => (
                                                      <span key={i}>
                                                          {translation.name}
                                                      </span>
                                                  )
                                              )}
                                    </span>
                                </div>

                                {categoryProducts.length > 0 && (
                                    <ul className="hidden absolute w-auto left-0 top-[30px] bg-white shadow-md p-2 space-y-1 group-hover:block">
                                        <div className="text-xl">
                                            Here Subcategories
                                        </div>
                                        {categoryProducts.map((product) => (
                                            <li
                                                key={product.id}
                                                className="text-sm text-gray-600"
                                            >
                                                {product.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default memo(CatgoriesMin);
