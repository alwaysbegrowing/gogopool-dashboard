import { Checkbox, Typography, Col, Row, Table } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { CopyableAddress } from "@/components/Copyable";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useState } from "react";
import { Staker } from "@/pages/calculator";

export function NodeOpRewardTable({
  title,
  ggpStaked,
  stakers,
  handleCheck,
  details,
  checked,
}: {
  title: "Retail Node Ops" | "Investor Node Ops";
  details: string,
  ggpStaked: BigNumber;
  stakers: Staker[];
  checked: boolean
  handleCheck: (e: CheckboxChangeEvent) => void;
}) {

  const [show, setShow] = useState(false)

  const { Title, Text, Paragraph } = Typography;
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
      dataIndex: "avaxReward",
      key: "avaxReward",
      render: (avaxReward: string) => (
        <>{`${commify((+formatEther(avaxReward)).toFixed(2))}`}</>
      ),
    },
    {
      title: "Reward amount in USD",
      dataIndex: "usdReward",
      key: "usdReward",
      render: (usdReward: string) => (
        <>{`$${commify((+formatEther(usdReward)).toFixed(2))}`}</>
      ),
    },
  ];

  return (
    <>
      <Row justify={"start"} align="middle" gutter={32}>
        <Col lg={8} md={10} sm={12}>
          <Title level={2}>{`${title}`}</Title>
        </Col>
        <Col lg={8} md={10} sm={12}>
          <Title level={3}>
            GGP Staked: {`${commify((+formatEther(ggpStaked)).toFixed(2))}`}
          </Title>
        </Col>
        <Col lg={14} sm={20}>
          <Paragraph style={{ cursor: "pointer" }} onClick={() => setShow(!show)}>
            {show
              ? (<Text strong>{details}</Text>)
              : (<Text strong>Show details</Text>)}
          </Paragraph>
        </Col>
      </Row>
      <Row align={'middle'}>
        {title === "Retail Node Ops" && (
          <Checkbox checked={checked} style={{ paddingBottom: 16 }} onChange={(e) => handleCheck(e)}>
            <Text strong style={{ fontSize: 18 }}>Include your minipool</Text>
          </Checkbox>
        )}
      </Row>
      <Table columns={stakerColumns} dataSource={stakers} />
    </>
  );
}
