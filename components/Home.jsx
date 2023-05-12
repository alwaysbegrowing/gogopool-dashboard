import React from "react";
import { Button, Col, Row, Statistic, Card, Space } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useContractReads } from "wagmi";
import { useIsMounted } from "../hooks/mounted";
import NodesTable from "./NodesTable";
import NodeOpsTable from './NodeOpsTable'
const { ethers } = require("ethers");
import Layout from './Layout/Layout';

import minipoolManagerABI from "../abis/minipoolmanager.json";
const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

export const minipoolmanagerContract = {
  address: "0xc8de41c35fb389286546cf4107102a7656da7037",
  abi: minipoolManagerABI,
};
export default function Home() {
  const isMounted = useIsMounted();

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...minipoolmanagerContract,
        functionName: "getMinipoolCount",
      },
      {
        ...minipoolmanagerContract,
        functionName: "getTotalAVAXLiquidStakerAmt",
      },
    ],
  });



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
              value={data?.[0].toNumber()}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card loading={isLoading} bordered={false}>
            <Statistic
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              title="AVAX Staked by Liquid Stakers"
              value={data?.[1].div(weiValue).toNumber()}
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
