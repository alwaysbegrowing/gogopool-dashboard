import * as React from "react";
const { ethers } = require("ethers");
import { useContractReads, useContractRead } from "wagmi";
import stakerABI from "../abis/staker.json";

import minipoolManagerABI from "../abis/minipoolmanager.json";
import { BigNumber } from "ethers";
const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

interface Mp {
  address: `0x${string}`;
  abi: any;
}
export const minipoolmanagerContract: Mp = {
  address: "0xc8de41c35fb389286546cf4107102a7656da7037",
  abi: minipoolManagerABI as any,
};

export const stakingContract: Mp = {
  address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
  abi: stakerABI as any,
};

export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted;
};

export const useMinipools = () => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...minipoolmanagerContract,
        functionName: "getMinipoolCount",
      },
      {
        ...minipoolmanagerContract,
        functionName: "getTotalAVAXLiquidStakerAmt",
      },
      {
        ...minipoolmanagerContract,
        functionName: "getMinipools",
        args: [2, 0, 100],
      },
    ],
  });

  return { data, isLoading };
};

export const useStakers = () => {
  const { data, isLoading }: any = useContractRead({
    address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
    abi: stakerABI,
    functionName: "getStakers",
    args: [0, 1000],
  });
  return { data, isLoading };
};

export const useStakingInfo = () => {
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...stakingContract,
        functionName: "getStakerCount",
      },
      {
        ...stakingContract,
        functionName: "getTotalGGPStake",
      },
    ],
  });
  return { data, isLoading };
};

export const toWei = (n: BigNumber) => {
  if (!n) return 0;
  return n.div(weiValue).toNumber();
};
