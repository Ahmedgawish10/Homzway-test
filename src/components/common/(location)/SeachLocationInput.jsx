"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CurrentLocationMaps from "@/components/common/(location)/CurrentLocationMaps";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { saveLocationUser } from "@/store/slices/locationSlice";
import { getCityData } from "@/store/slices/locationSlice";
const CitySearch = ({ userLocationFun }) => {
  const [cities, setCities] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const { language } = useSelector((state) => state.Language)
  const dispatch = useDispatch()
  const UserDatad = useSelector(getCityData)

  //here i use api to search the city or governmanete of country Egypt
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
  //here our depounce func to reduce and optmize the search for current destination
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
          const matchesGovernorate = matchedGovernorate && city.governorate_id === matchedGovernorate.id;

          return matchesCity || matchesGovernorate;
        });

      setFilteredResults(results);
    }, 500);

    return () => clearTimeout(DebounceSearchLocationFn);
  }, [search, cities, governorates]);
// save the location user using search in governamete
const userLocation = (locationValue) => {
    saveLocationUser(locationValue)
  }
//  func back to egypt
const backToEgypt=(value)=>{
  saveLocationUser(language == "ar" ? "مصر" : "Egypt")
   setSearch(language == "ar" ? "" : "")
}

  return (
    <div className="h-[300px] overflow-y-auto ">
      {/* here the input to make user search the current location of city or governmanete */}
      <div className="input mx-2 mt-2">
        <input type="text" placeholder="Search For Location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 rounded-md border border-gray-400  py-3 outline-0"
        />
        <h1 className={`${search==""?"hidden":""}  text-blue-500  cursor-pointer text-start px-3 py-2 `}  onClick={backToEgypt} >
          {search ? (language === "ar" ? "العودة الي مصر" : "Back to egypt") : ""}
        </h1>
      </div>
      {/* the current location of user if he slecetd by react google maps */}
      <CurrentLocationMaps />
      {/* here dispay the all cites , governmates of user when he will search  */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {filteredResults.length > 0 ? (
          filteredResults.map((city) => (
            <li
              onClick={() => userLocation(language == "ar" ? `${city.city_name_ar},${city.governorate_name_ar}` : `${city.city_name_en},${city.governorate_name_en}`)}
              key={city.id}
              className={`${language == "ar" ? "text-right" : "text-left "}  p-2  mb-1 hover:bg-[#ff757557] cursor-pointer transition`} >
              <strong className="text-sm">
                {language == "ar" ? city.city_name_ar : city.city_name_en}
              </strong> ,
              {language == "ar" ? city.governorate_name_ar : city.governorate_name_en}
            </li>



          ))
        ) : (
          search && <p>No results found</p>
        )}
      </ul>
      {/* in default display all the governamtes of egypt */}
      {governorates.length && search == "" &&
        governorates.map((governorate) => (
          <h1 className={` ${language == "ar" ? "text-right" : ""} flex justify-between  px-3 hover:bg-[#ff757557] transition-all cursor-pointer py-2 `}
            key={governorate.id} onClick={() => setSearch(language === "ar" ? governorate.governorate_name_ar : governorate.governorate_name_en)}>
            <span> {language === "ar" ? governorate.governorate_name_ar : governorate.governorate_name_en}</span>
            <span><IoIosArrowForward /></span>
          </h1>
        ))
      }
    </div>
  );
};

export default CitySearch;
