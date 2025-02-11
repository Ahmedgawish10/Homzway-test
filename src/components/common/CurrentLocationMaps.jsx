import React, { useEffect, useState, useRef } from 'react';
import { loadGoogleMaps, t } from '@/utils/index';
import { MdClose } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { BiCurrentLocation } from 'react-icons/bi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getKilometerRange, saveLocationUser, setKilometerRange } from '@/store/slices/locationSlice';
import { settingsData } from '@/store/slices/settingSlice';
import { setLocationUser } from '@/store/slices/settingSlice';

const LocationModal = ({ IsLocationModalOpen ,onClose2 }) => {
    const dispatch = useDispatch();
    const cityData = useSelector(state => state?.Location?.cityData);
    const lat = cityData?.lat;
    const lng = cityData?.long;
    const { isLoaded } = loadGoogleMaps();
    const [googleMaps, setGoogleMaps] = useState(null);
    const router = useRouter();
    const systemSettingsData = useSelector(settingsData);
    const settings = systemSettingsData?.data;
    const searchBoxRef = useRef(null);
    const [isValidLocation, setIsValidLocation] = useState(false);
    const [selectedCity, setSelectedCity] = useState(cityData || {}); 
    const [KmRange, setKmRange] = useState(0);
    const [position, setPosition] = useState({ lat, lng });
    const appliedKilometer = useSelector(getKilometerRange);


    const getCurrentLocation = async (e) => {        
        e.preventDefault();    
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                      
                    try {
                        const locationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.latitude},${locationData.longitude}&key=${"AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY"}`);

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

                        const cityData = {
                            lat: locationData.latitude,
                            long: locationData.longitude,
                            city,
                            state,
                            country,
                            formattedAddress: address
                        };
                        setPosition({
                            lat: locationData.latitude,
                            lng: locationData.longitude
                        });
                        saveLocationUser(cityData);
                        router.push('/');
                    } catch (error) {
                        console.error('Error fetching location data:', error);
                    }
                },
                (error) => {
                    toast.error(t('locationNotGranted'));
                }
            );
        } else {
            toast.error(t('geoLocationNotSupported'));
        }
    };

    useEffect(() => {
        setKmRange(appliedKilometer);
    }, []);

    const { language, translatedData } = useSelector((state) => state.Language)

    return (
        <div className={`modal-overlay `}>
            <div className="modal-content">
                <div className="modal-header" >
                    {/* <h5 className='head_loc'>{selectedCity ? t('editLocation') : t('addLocation')}</h5> */}
                </div>
                <div className="modal-body">
                    <div className="location_city">
                        <div className="row loc_input gx-0">
                            <div className="col-8">
                           
                            </div>
                            <div className="col-4">
                                <div className="useCurrentLocation px-2">
                                    <button onClick={getCurrentLocation} className=" flex gap-2 mt-3">
                                        <span>
                                            <BiCurrentLocation className='text-2xl text-red-600' />
                                        </span>
                                        <span className='curr_loc'>
                                         {translatedData?.file_name?.locateMe ??"Locate m0e"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;