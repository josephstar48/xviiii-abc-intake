import {createContext, useContext, useState} from "react";

type BackgroundContextType = {
    isPageHasBackgroundImage: boolean;
    setPageHasBackgroundImage: (b: boolean) => void;
}

const GlobalContext = createContext<BackgroundContextType>({
    isPageHasBackgroundImage: false,
    setPageHasBackgroundImage: () => null
})

type Props = {
    children?: React.ReactNode
};

export const GlobalProvider = ({children}: Props) => {
    const [isPageHasBackgroundImage, setIsPageHasBackgroundImage] = useState<boolean>(false);

    const setPageHasBackgroundImage = () => {
        setIsPageHasBackgroundImage(true);
    }

    return <GlobalContext.Provider value={{isPageHasBackgroundImage, setPageHasBackgroundImage}}>{children}</GlobalContext.Provider>
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) throw Error('GlobalContext was used outside the provider');
    return context;
};