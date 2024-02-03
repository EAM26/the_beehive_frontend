import React, {createContext} from 'react';


export const LocaleContext = createContext({});

function LocaleContextProvider({children}) {
    const userLocale = navigator.language || 'en-US';

    return (
        <LocaleContext.Provider value={userLocale}>
            {children}
        </LocaleContext.Provider>
    );
}

export default LocaleContextProvider