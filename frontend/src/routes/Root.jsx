import Register from "@/components/shared/Register";
import { getEnsContract, getProvider } from "@/constants";
import { isSupportedChain } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Root() {
  const navigate = useNavigate();

  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  useEffect(() => {
    const checkUserRegistration = async () => {
      if (isConnected) {
        if (!isSupportedChain(chainId))
          return toast("Wrong network", {
            description: "Please select the supported chain",
          });

        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getEnsContract(signer);

        try {
          const tx = await contract.checkIsRegistered(address);

          if (tx === true) {
            return navigate("/chat");
          } else {
            return navigate("/");
          }
        } catch (error) {
          if (error.reason === "rejected") {
            toast("Failed transaction", {
              description: "You rejected the transaction",
            });
          } else {
            console.log(error);
            toast("Error transaction", {
              description: error.code,
            });
          }
        }
      } else {
        return navigate("/");
      }
    };

    checkUserRegistration();
  }, [address, chainId, isConnected, navigate, walletProvider]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full gap-2">
      <w3m-button />
      <Register />
    </div>
  );
}
