import { Checkbox, Typography, Col, Row, Table } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { CopyableAddress } from "./Copyable";
import { CheckboxChangeEvent } from "antd/es/checkbox";

export function NodeOpRewardTable({
  title,
  ggpStaked,
  stakers,
  handleCheck,
}: {
  title: "Retail Node Ops" | "Investor Node Ops";
  ggpStaked: BigNumber;
  stakers: any;
  handleCheck: (e: CheckboxChangeEvent) => void;
}) {

  const { Title, Text } = Typography;
  const stakerColumns = [
    {
      title: "Staker Addr",
      dataIndex: "stakerAddr",
      key: "stakerAddr",
      render: (stakerAddr: string) => <CopyableAddress address={stakerAddr} />,
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
      title: "Collateral Ratio",
      dataIndex: "collateralRatio",
      key: "collateralRatio",
      render: (collateralRatio: string) => (
        <>{`${(+formatEther(collateralRatio) * 100).toFixed(2)}%`}</>
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
      <Row justify={"start"} align="middle" gutter={32}>
        <Col>
          <Title level={2}>{`${title}`}</Title>
        </Col>
        <Col>
          <Title level={3}>
            GGP Staked: {`${commify((+formatEther(ggpStaked)).toFixed(2))}`}
          </Title>
        </Col>
      </Row>
      <Row align={'middle'}>
        {title === "Retail Node Ops" && (
          <Checkbox onChange={(e) => handleCheck(e)}>
            <Text strong style={{ fontSize: 16 }}>Include your minipool</Text>
          </Checkbox>
        )}
      </Row>
      <Table columns={stakerColumns} dataSource={stakers} />
    </>
  );
}
