import React from "react";
import { Button, Col, Row, Statistic, Card, Space } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useIsMounted } from "../hooks/mounted";
import NodesTable from "./NodesTable";
import NodeOpsTable from './NodeOpsTable'
import Layout from './Layout/Layout';
import { useMinipools, useStakingInfo } from "../hooks/mounted";
import { toWei } from "../hooks/mounted";


export default function Home() {
  const isMounted = useIsMounted();
  const {data, isLoading} = useMinipools()
  const {data: stakerData, isLoading: isLoadingStakers} = useStakingInfo()
  const [minipoolCount, totalStakedAMount, allMinipools] = data || []
  const [stakersCount, ggpStaked] = stakerData || []



  if (!isMounted) return null;

  return (
    <Layout
  
  >
    <Space direction="vertical" size="large">
      <Row gutter={[24, 24]}>
        <Col xs={12} md={12} lg={6}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              title="Total Minipools"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#3f8600" }}
              value={minipoolCount?.toNumber()}
            />
          </Card>
        </Col>
        <Col xs={12} md={12} lg={6}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              title="Total Stakers"
              value={stakersCount}
            />
          </Card>
        </Col>
        <Col xs={12} md={12}  lg={6}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              title="AVAX Staked"
              value={toWei(totalStakedAMount)}
              precision={0}
            />
          </Card>
        </Col>
   
        <Col  xs={12} md={12} lg={6}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              title="GGP Staked"
              value={toWei(ggpStaked)}
              precision={0}
            />
          </Card>
        </Col>
      </Row>
      <NodesTable />
      <NodeOpsTable  />

    </Space>
    </Layout>
  );
}
