import { useDispatch } from "react-redux";
import { setCurrentLanguage, setTranslatedData } from "@/store/slices/languageSlice"; // Adjust the path
import { getLanguageApi } from "@/api/apiCalling"; // Adjust the path
import { toast } from "react-hot-toast";

const useLanguage = () => {
    const dispatch = useDispatch();

    const handleLanguageChange = async (language_code) => {
        try {
            const res = await getLanguageApi.getLanguage({ language_code, type: "web" });

            if (res?.data?.error) {
                toast.error(res?.data?.message);
            } else {
                dispatch(setCurrentLanguage(language_code));
                dispatch(setTranslatedData(res?.data?.data));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return { handleLanguageChange };
};

export default useLanguage;
