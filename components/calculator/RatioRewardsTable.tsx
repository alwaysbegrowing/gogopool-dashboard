import { Col, Table, Typography } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { RewardAmount } from "./Calculator";
import { BigNumber } from "ethers";

export function RatioRewardsTable({ rewardAmounts }: { rewardAmounts: RewardAmount }) {
  const [show, setShow] = useState(false);
  const { Title, Paragraph, Text } = Typography;
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
      render: (ggpStake: BigNumber) => <>{`${commify((+formatEther(ggpStake)).toFixed(2))}`}</>,
    },
    {
      title: "Share of All GGP Staked",
      dataIndex: "percentStake",
      key: "percentStake",
      render: (percentStake: BigNumber) => <>{`${(+formatEther(percentStake) * 100).toFixed(2)}%`}</>,
    },
    {
      title: "Monthly GGP Reward",
      dataIndex: "ggpReward",
      key: "ggpReward",
      render: (ggpReward: BigNumber) => <>{`${commify((+formatEther(ggpReward)).toFixed(2))}`}</>,
    },
    {
      title: "Monthly Reward amount in AVAX",
      dataIndex: "avaxReward",
      key: "avaxReward",
      render: (avaxReward: BigNumber) => <>{`${commify((+formatEther(avaxReward)).toFixed(2))}`}</>,
    },
    {
      title: "Monthly Reward amount in USD",
      dataIndex: "usdReward",
      key: "usdReward",
      render: (usdReward: BigNumber) => <>{`$${commify((+formatEther(usdReward)).toFixed(2))}`}</>,
    },
  ];

  return (
    <>
      <Title level={2}>Rewards for a New Minipool</Title>
      <Col sm={20} lg={14}>
        <Paragraph style={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
          {show ? (
            <Text strong>
              This table provides extra information about your rewards as input into the calculator.
              It compares your newly created minipool with all of the other minipools on the
              network.
            </Text>
          ) : (
            <Text strong>Show details</Text>
          )}
        </Paragraph>
        <Paragraph></Paragraph>
      </Col>
      <Table pagination={false} columns={rewardsColumns} dataSource={[rewardAmounts]} />
    </>
  );
}
