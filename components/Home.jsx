import React from "react";
import { Col, Row, Statistic, Card, Space, Tooltip, Popover } from "antd";
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

function createFormatter(date) {
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
  const [minipoolCount, totalStakedAMount] = data || [];
  const [stakersCount, ggpStaked] = stakerData || [];
  const timezoneDisplay = `(${
    Intl.DateTimeFormat().resolvedOptions().timeZone
  } Time)`;
  if (!isMounted) return null;
  const rewardsCycleStartDate = new Date(rewardsCycleStartTime * 1000);
  const rewardsEligibilityDate = new Date(
    (parseInt(rewardsCycleStartTime) + parseInt(rewardsEligibilityMinSeconds)) *
      1000
  );
  const rewardsCycleEndDate = new Date(
    (parseInt(rewardsCycleStartTime) + parseInt(rewardsCycleSeconds)) * 1000
  );
  const nextRewardsEligibilityDate = new Date(
    (parseInt(rewardsCycleStartTime) +
      parseInt(rewardsCycleSeconds) +
      parseInt(rewardsEligibilityMinSeconds)) *
      1000
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
                value={minipoolCount?.toNumber()}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic title="Total Stakers" value={stakersCount} />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title="AVAX Staked"
                value={toWei(totalStakedAMount)}
                precision={0}
              />
            </Card>
          </Col>

          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title="GGP Staked"
                value={toWei(ggpStaked)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Cycle Start ${timezoneDisplay}`}
                formatter={() => createFormatter(rewardsCycleStartDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Eligibility ${timezoneDisplay}`}
                formatter={() => createFormatter(rewardsEligibilityDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Rewards Cycle End ${timezoneDisplay}`}
                formatter={() => createFormatter(rewardsCycleEndDate)}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Card loading={isLoading} bordered={false}>
              <Statistic
                title={`Next Rewards Eligibility ${timezoneDisplay}`}
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
