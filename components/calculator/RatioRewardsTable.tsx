import { Col, Table, Typography } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { useState } from "react";

export function RatioRewardsTable({ rewardAmounts }: { rewardAmounts: any }) {
  const [show, setShow] = useState(false);
  const { Title, Paragraph, Text } = Typography;
  const rewardsColumns = [
    {
      title: "PPY Collateralization",
      dataIndex: "collateralRatioString",
      key: "collateralRatioString",
    },
    {
      title: "Effective PPY Staked",
      dataIndex: "PPYStake",
      key: "PPYStake",
      render: (PPYStake: string) => <>{`${commify((+formatEther(PPYStake)).toFixed(2))}`}</>,
    },
    {
      title: "Share of All PPY Staked",
      dataIndex: "percentStake",
      key: "percentStake",
      render: (percentStake: string) => <>{`${(+formatEther(percentStake) * 100).toFixed(2)}%`}</>,
    },
    {
      title: "Monthly PPY Reward",
      dataIndex: "reward",
      key: "reward",
      render: (PPYReward: string) => <>{`${commify((+formatEther(PPYReward)).toFixed(2))}`}</>,
    },
    {
      title: "Monthly Reward amount in PLS",
      dataIndex: "PLSReward",
      key: "PLSReward",
      render: (PLSReward: string) => <>{`${commify((+formatEther(PLSReward)).toFixed(2))}`}</>,
    },
    {
      title: "Monthly Reward amount in USD",
      dataIndex: "usdReward",
      key: "usdReward",
      render: (usdReward: string) => <>{`$${commify((+formatEther(usdReward)).toFixed(2))}`}</>,
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
