import React from "react";
import { Col, Row, Statistic, Card, Space, Popover } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import NodesTable from "./NodesTable";
import NodeOpsTable from "./NodeOpsTable";
import Layout from "./Layout/Layout";
import {
  useMinipools,
  useStakingInfo,
  useGetRewardsCycleStartTime,
  useGetRewardsCycleSeconds,
  useGetRewardsEligibilityMinSeconds,
  useIsMounted,
} from "../hooks/mounted";
import { toWei } from "../hooks/mounted";
import { formatDistanceToNow, format } from "date-fns";
import { BigNumber } from "ethers";

function createFormatter(date?: Date) {
  if (!date) return null;
  const formattedDistance = formatDistanceToNow(date, { addSuffix: true });
  const fullDate = `${format(date, "PPpp z")}`;
  const gmtDate = date.toUTCString();

  return (
    <Popover
      title={
        <Space direction="vertical">
          {fullDate}
          {gmtDate}
        </Space>
      }
    >
      {formattedDistance}
    </Popover>
  );
}

export default function Home() {
  const isMounted = useIsMounted();
  const { data, isLoading } = useMinipools();
  const { data: stakerData } = useStakingInfo();
  const { data: rewardsCycleStartTime } = useGetRewardsCycleStartTime();
  const { data: rewardsCycleSeconds } = useGetRewardsCycleSeconds();
  const { data: rewardsEligibilityMinSeconds } =
    useGetRewardsEligibilityMinSeconds();
  const [minipoolCount, totalStakedAMount] = data ?? [0, BigNumber.from(0)];
  const [stakersCount, ggpStaked] = stakerData ?? [0, BigNumber.from(0)];

  if (!isMounted) return null;
  const rewardsCycleStartDate = rewardsCycleStartTime
    ? new Date(rewardsCycleStartTime.mul(1000).toNumber())
    : new Date();
  const rewardsEligibilityDate =
    rewardsCycleStartTime &&
    rewardsEligibilityMinSeconds &&
    new Date(
      rewardsCycleStartTime
        .add(rewardsEligibilityMinSeconds)
        .mul(1000)
        .toNumber()
    );
  const rewardsCycleEndDate =
    rewardsCycleStartTime &&
    rewardsCycleSeconds &&
    new Date(
      rewardsCycleStartTime.add(rewardsCycleSeconds).mul(1000).toNumber()
    );
  const nextRewardsEligibilityDate =
    rewardsCycleStartTime &&
    rewardsCycleSeconds &&
    rewardsEligibilityMinSeconds &&
    new Date(
      rewardsCycleStartTime
        .add(rewardsCycleSeconds)
        .add(rewardsEligibilityMinSeconds)
        .mul(1000)
        .toNumber()
    );
  return (
    <Layout>
      <Space direction="vertical" size="large">
        <Row gutter={[24, 24]}>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title="Active Minipools"
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: "#3f8600" }}
                formatter={(value) => value}
                value={(minipoolCount as any as BigNumber).toString()}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic title="Total Stakers" value={stakersCount as any} />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title="AVAX Staked"
                value={toWei(totalStakedAMount as any as BigNumber)}
                precision={0}
              />
            </Card>
          </Col>

          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title="GGP Staked"
                value={toWei(ggpStaked as any as BigNumber)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Cycle Start`}
                formatter={() => createFormatter(rewardsCycleStartDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Eligibility`}
                formatter={() => createFormatter(rewardsEligibilityDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Cycle End`}
                formatter={() => createFormatter(rewardsCycleEndDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Next Rewards Eligibility`}
                formatter={() => createFormatter(nextRewardsEligibilityDate)}
                precision={0}
              />
            </Card>
          </Col>
        </Row>
        <NodesTable />
        <NodeOpsTable />
      </Space>
    </Layout>
  );
}
