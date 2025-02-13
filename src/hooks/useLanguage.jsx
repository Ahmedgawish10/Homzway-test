import { useDispatch, useSelector } from "react-redux";
import { setCurrentLanguage, setTranslatedData } from "@/store/slices/languageSlice";
import { getLanguageApi } from "@/api/apiCalling"; 
import { toast } from "react-hot-toast";

const useLanguage = () => {
    const dispatch = useDispatch();
    const {language}= useSelector((state)=>state.Language)

    const handleLanguageChange = async (language_code) => {  
        try {
            const res = await getLanguageApi.getLanguage({ language_code:language=="ar"?"en":"ar", type: "web" });
            if (res?.data?.error) {
                toast.error(res?.data?.message);
            } else {
                dispatch(setCurrentLanguage(language_code=="ar"?"en":"ar"));
                dispatch(setTranslatedData(res?.data?.data));
            }
        } catch (error) {
            console.error(error);
        }
    };
    return { handleLanguageChange };
};

export default useLanguage;
