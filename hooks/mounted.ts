import * as React from "react";
const { ethers } = require("ethers");
import { BigNumber } from "ethers";

import { useContractReads, useContractRead } from "wagmi";

import { minipoolManagerAbi } from "@/abis/minipoolmanager";
import { oracleAbi } from "@/abis/oracle";
import { protocolDaoAbi } from "@/abis/protocoldao";
import { stakerAbi } from "@/abis/staker";

export const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

interface Mp {
  address: `0x${string}`;
  abi: any;
}

export const minipoolmanagerContract: Mp = {
  address: "0xc8de41c35fb389286546cf4107102a7656da7037",
  abi: minipoolManagerAbi as any,
};

export const stakingContract: Mp = {
  address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
  abi: stakerAbi,
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
  const { data, isLoading } = useContractRead({
    address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
    abi: stakerAbi,
    functionName: "getStakers",
    args: [BigNumber.from(0), BigNumber.from(1000)],
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

export const useGetRewardsEligibilityMinSeconds = () => {
  const { data, isLoading } = useContractRead({
    abi: protocolDaoAbi,
    address: "0x41A76343eb93B4790e53c8E2789E09EF41195D0B",
    functionName: "getRewardsEligibilityMinSeconds",
  });

  return { data, isLoading };
};

export const useGetGGPPriceInAVAX = () => {
  const { data, isLoading } = useContractRead({
    abi: oracleAbi,
    address: "0x30fb915258D844E9dC420B2C3AA97420AEA16Db7",
    functionName: "getGGPPriceInAVAX",
  });
  return { data, isLoading };
};

export const toWei = (n: BigNumber) => {
  if (!n) return 0;
  return n.div(weiValue).toNumber();
};
