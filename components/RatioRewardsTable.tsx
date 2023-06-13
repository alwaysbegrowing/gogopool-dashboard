import { Col, Row, Table } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { CopyableAddress } from "./Copyable";

export function RatioRewardsTable({ rewardAmounts }: { rewardAmounts: any }) {
  const rewardsColumns = [
    {
      title: "Effective GGP Staked",
      dataIndex: "ggpStake",
      key: "ggpStake",
      render: (ggpStake: string) => (
        <>{`${commify((+formatEther(ggpStake)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Share of All GGP Staked",
      dataIndex: "percentStake",
      key: "percentStake",
      render: (percentStake: string) => (
        <>{`${(+formatEther(percentStake) * 100).toFixed(2)}%`}</>
      ),
    },
    {
      title: "GGP Reward",
      dataIndex: "reward",
      key: "reward",
      render: (ggpReward: string) => (
        <>{`${commify((+formatEther(ggpReward)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Reward amount in AVAX",
      dataIndex: "inAvax",
      key: "inAvax",
      render: (inAvax: string) => (
        <>{`${commify((+formatEther(inAvax)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Reward amount in USD",
      dataIndex: "inUsd",
      key: "inUsd",
      render: (inUsd: string) => (
        <>{`$${commify((+formatEther(inUsd)).toFixed(2))}`}</>
      ),
    },
    {
      title: "GGP Collateralization",
      dataIndex: "collat",
      key: "collat",
    },
  ];

  return (
    <>
      <h2>Rewards for a new minipool</h2>
      <Table columns={rewardsColumns} dataSource={rewardAmounts} />
    </>
  );
}