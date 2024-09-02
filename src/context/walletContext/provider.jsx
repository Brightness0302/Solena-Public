import { useState } from "react";
import { CustomWalletContext } from "./context";
import CustomWalletModal from "./connectwallet/customWalletModal";

const CustomWalletProvider = ({ children }) => {
  const [walletModalState, setWalletModalState] = useState(false);

  return (
    <CustomWalletContext.Provider
      value={[walletModalState, setWalletModalState]}
    >
      {children}
      <CustomWalletModal
        showModal={walletModalState}
        setShowModal={setWalletModalState}
      />
    </CustomWalletContext.Provider>
  );
};

export default CustomWalletProvider;
