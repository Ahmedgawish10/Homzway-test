"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/Layout/MainLayout";
import Link from "next/link";
import { GrLocation } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';

const CitySearch = ({userLocationFun}) => {
  const [cities, setCities] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const { language } = useSelector((state) => state.Language)
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await fetch(
          "https://raw.githubusercontent.com/Tech-Labs/egypt-governorates-and-cities-db/master/cities.json"
        );
        const governoratesResponse = await fetch(
          "https://raw.githubusercontent.com/Tech-Labs/egypt-governorates-and-cities-db/master/governorates.json"
        );

        const citiesData = await citiesResponse.json();
        const governoratesData = await governoratesResponse.json();

        setCities(citiesData[2].data);
        setGovernorates(governoratesData[2].data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const DebounceSearchLocationFn = setTimeout(() => {
      if (search === "") {
        setFilteredResults([]);
        return;
      }

      const matchedGovernorate = governorates.find(
        (gov) =>
          gov.governorate_name_en.toLowerCase().includes(search.toLowerCase()) ||
          gov.governorate_name_ar.includes(search)
      );


      const results = cities
        .map((city) => {
          const governorate = governorates.find((gov) => gov.id === city.governorate_id);
          return {
            ...city,
            governorate_name_en: governorate?.governorate_name_en || "Unknown",
            governorate_name_ar: governorate?.governorate_name_ar || "غير معروف",
          };
        })
        .filter((city) => {

          const cityEn = city.city_name_en ? city.city_name_en.toLowerCase() : "";
          const cityAr = city.city_name_ar || "";
          const matchesCity = cityEn.includes(search.toLowerCase()) || cityAr.includes(search);

          // If search matches governorate, show all cities in that governorate
          const matchesGovernorate =
            matchedGovernorate && city.governorate_id === matchedGovernorate.id;

          return matchesCity || matchesGovernorate;
        });

      setFilteredResults(results);
    }, 500);

    return () => clearTimeout(DebounceSearchLocationFn);
  }, [search, cities, governorates]);
   const userLocation=(value)=>{
    userLocationFun(value)
   }
  return (
    //   <Link href="/" prefetch>ads</Link>


      <div style={{ padding: "20px", textAlign: "center" }} className="h-[350px] overflow-y-auto">
        <input
          type="text"
          placeholder="Search For Location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-gray-400 px-2 py-3 outline-0"
        />
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>

          {filteredResults.length > 0 ? (
            filteredResults.map((city) => (
              <li
              onClick={()=>userLocation(city.city_name_ar)}
                key={city.id}
                className="p-2 mb-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer transition"

              >
                <strong>
                  {city.city_name_en}
                  {/* ({city.city_name_ar}) */}
                </strong>{" "}
                - {city.governorate_name_en}
                {/* ({city.governorate_name_ar}) */}
              </li>
            ))
          ) : (
            search && <p>No results found</p>
          )}
        </ul>

      </div>


  );
};

export default CitySearch;
