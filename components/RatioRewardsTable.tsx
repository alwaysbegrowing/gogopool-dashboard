import { Table, Typography } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";

export function RatioRewardsTable({ rewardAmounts }: { rewardAmounts: any }) {
  const { Title } = Typography;
  const rewardsColumns = [
    {
      title: "GGP Collateralization",
      dataIndex: "collateralRatioString",
      key: "collateralRatioString",
    },
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
  ];

  return (
    <>
      <Title level={2}>Rewards for a New Minipool</Title>
      <Table pagination={false} columns={rewardsColumns} dataSource={rewardAmounts} />
    </>
  );
}
