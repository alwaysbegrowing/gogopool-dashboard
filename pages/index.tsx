import React from "react";
import { Button, Col, Row, Statistic, Card } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <Row gutter={24}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Active Minipools"
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
            value={112893}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Total Avax Liquid Staker Amount"
            value={9.3}
            precision={2}
            valueStyle={{ color: "#cf1322" }}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  );
}
