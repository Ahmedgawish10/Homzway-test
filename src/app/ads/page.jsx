"use client";
import React, { useState, useEffect } from "react";
import Layout from "../Layout/MainLayout";
import Link from "next/link";

const CitySearch = () => {
  const [cities, setCities] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

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

  return (
    <Layout>
      <Link href="/" prefetch>ads</Link>


      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Search for a City in Egypt</h2>
        <input
          type="text"
          placeholder="Search city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>

          {filteredResults.length > 0 ? (
            filteredResults.map((city) => (
              <li
                key={city.id}
                style={{
                  padding: "10px",
                  background: "#f5f5f5",
                  marginBottom: "5px",
                  borderRadius: "5px",
                }}
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

    </Layout>

  );
};

export default CitySearch;
