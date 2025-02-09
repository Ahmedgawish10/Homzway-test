import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getKilometerRange, saveCity, setKilometerRange } from '@/store/slices/locationSlice';
import { settingsData } from '@/store/slices/settingSlice';
import { loadGoogleMaps } from '@/utils/index';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';

const LocationModal = ({ IsLocationModalOpen, OnHide }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const min_range = Number(settings?.min_length);
    const max_range = Number(settings?.max_length);
    const [position, setPosition] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [KmRange, setKmRange] = useState(50);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const appliedKilometer = useSelector(getKilometerRange);
    const { isLoaded } = loadGoogleMaps();

    useEffect(() => {
        setKmRange(appliedKilometer);
    }, [appliedKilometer]);

    const getLocationWithMap = async (pos) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=${settings?.place_api_key}`);
            if (response.data.error_message) {
                toast.error(response.data.error_message);
                return;
            }
            let city = '';
            let state = '';
            let country = '';
            let address = '';
            response.data.results.forEach(result => {
                const addressComponents = result.address_components;
                const getAddressComponent = (type) => {
                    const component = addressComponents.find(comp => comp.types.includes(type));
                    return component ? component.long_name : '';
                };

                if (!city) city = getAddressComponent("locality");
                if (!state) state = getAddressComponent("administrative_area_level_1");
                if (!country) country = getAddressComponent("country");
                if (!address) address = result.formatted_address;
            });

            const locationData = {
                lat: pos.lat,
                long: pos.lng,
                city,
                state,
                country,
                formatted_address: address
            };

            setSelectedCity(locationData);
            setIsValidLocation(true);
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    const handleUpdateLocation = (e) => {
        e.preventDefault();
        if (selectedCity) {
            if (isValidLocation) {
                dispatch(setKilometerRange(KmRange));
                saveCity(selectedCity);
                router.push('/');
                OnHide();
            } else {
                toast.error("Please Select valid location");
            }
        } else {
            toast.error("Please select a city");
        }
    };

    const handleRangeChange = (e) => {
        setKmRange(Number(e.target.value));
    };

    const handleMapClick = (event) => {
        const latLng = event.latLng;
        if (latLng) {
            const newPosition = {
                lat: latLng.lat(),
                lng: latLng.lng(),
            };
            setPosition(newPosition);
            getLocationWithMap(newPosition);
        }
    };

    const containerStyle = {
        marginTop: "30px",
        width: '100%',
        height: '400px'
    };

    const latitude = Number(settings?.default_latitude);
    const longitude = Number(settings?.default_longitude);

    const center = {
        lat: position?.lat ? position.lat : latitude,
        lng: position?.lng ? position.lng : longitude
    };

    return (
        <div className={`modal ${IsLocationModalOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <div className="modal-header">
                    <h5>Location</h5>
                    <button onClick={OnHide} className="close-button">
                        <MdClose size={24} color="black" />
                    </button>
                </div>
                <div className="modal-body">
                    {isLoaded && (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={6}
                            onClick={handleMapClick}
                        >
                            <Marker
                                position={position || center}
                                options={{
                                    strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                                }}
                            />
                            <Circle
                                center={position || center}
                                radius={KmRange * 1000} // radius in meters (50km = 50000 meters)
                                options={{
                                    strokeColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
                                    fillOpacity: 0.35,
                                }}
                            />
                        </GoogleMap>
                    )}
                    <div className="range-slider">
                        <label htmlFor="range">Range (KM)</label>
                        <input
                            type="range"
                            id="range"
                            min={min_range}
                            max={max_range}
                            value={KmRange}
                            onChange={handleRangeChange}
                        />
                        <span>{KmRange} KM</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={handleUpdateLocation}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;