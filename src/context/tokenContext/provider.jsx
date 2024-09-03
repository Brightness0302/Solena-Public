import React, { createContext, useState, useContext } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
    const [currentSendToken, setCurrentSendToken] = useState({
        symbol: "USDC",
        logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
    });

    const [currentRecieveToken, setCurrentRecieveToken] = useState({
        symbol: "SOL",
        logoURI: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToIG8feZdv7SVG0RYdGFUy8FDf_wxddAruJQ&s"
    });

    return (
        <TokenContext.Provider value={{ currentSendToken, setCurrentSendToken, currentRecieveToken, setCurrentRecieveToken }}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => {
    return useContext(TokenContext);
};
