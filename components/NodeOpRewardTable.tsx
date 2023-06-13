import { Col, Row, Table } from "antd";
import { commify, formatEther } from "ethers/lib/utils.js";
import { BigNumber } from "ethers";
import { CopyableAddress } from "./Copyable";

export function NodeOpRewardTable({
  title,
  ggpStaked,
  stakers,
}: {
  title: String;
  ggpStaked: BigNumber;
  stakers: any;
}) {
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
      <Row justify="center" align="middle" gutter={32}>
        <Col>
          <h2>{`${title}`}</h2>
        </Col>
        <Col>
          <h3>
            GGP Staked: {`${commify((+formatEther(ggpStaked)).toFixed(2))}`}
          </h3>
        </Col>
      </Row>
      <Table columns={stakerColumns} dataSource={stakers} />
    </>
  );
}
