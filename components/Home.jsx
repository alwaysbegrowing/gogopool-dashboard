import React from "react";
import { Button, Col, Row, Statistic, Card, Space } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useIsMounted } from "../hooks/mounted";
import NodesTable from "./NodesTable";
import NodeOpsTable from './NodeOpsTable'
import Layout from './Layout/Layout';
import { useMinipools } from "../hooks/mounted";
import { toWei } from "../hooks/mounted";


export default function Home() {
  const isMounted = useIsMounted();
  const {data, isLoading} = useMinipools()
console.log({data})
  const [minipoolCount, totalStakedAMount, allMinipools] = data || []


  if (!isMounted) return null;

  return (
    <Layout
  
  >
    <Space direction="vertical" size="large">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              title="Active Minipools"
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: "#3f8600" }}
              value={minipoolCount?.toNumber()}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              title="AVAX Staked by Liquid Stakers"
              value={toWei(totalStakedAMount)}
              precision={0}
            />
          </Card>
        </Col>
      </Row>
      <NodesTable />
      {/* <NodeOpsTable  /> */}

    </Space>
    </Layout>
  );
}
