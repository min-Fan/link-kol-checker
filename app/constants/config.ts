export const CONTRACT_ADDRESS: Record<string, { LinkolNFT: string }> = {
  // base mainnet
  "8453": {
    LinkolNFT: "",
  },
  // base testnet
  "84532": {
    LinkolNFT: "0xDd55eDa844ead76cAA9cee1a14d38E2270be3b17",
  },
};

export const getContractAddress = () => {
  return CONTRACT_ADDRESS[process.env.NEXT_PUBLIC_CHAIN_ID as string];
};
