import { InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import {
  Col,
  Divider,
  InputNumber,
  Row,
  Slider,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

export function YourMinipool({
  numMinipools,
  avaxAmount,
  ggpCollatPercent,
  realGgpAmount,
  handleMinipoolChange,
  handlePercentChange,
  handleGgpStake,
}: {
  numMinipools: number;
  avaxAmount: BigNumber;
  ggpCollatPercent: number;
  realGgpAmount: BigNumber;
  handleMinipoolChange: (minipools: number | null) => void;
  handlePercentChange: (percent: number | null) => void;
  handleGgpStake: (stake: number | null) => void;
}) {
  const { Text, Title } = Typography;

  return (
    <>
      <Title level={3}>Your Minipool</Title>
      {/*AVAX*/}
      <Row gutter={[0, 8]} justify="start">
        <Row>
          <Col span={10}>
            <Space direction="vertical">
              <Space>
                <Text strong>Number of Minipools</Text>
                <Tooltip title="Number of Minipools You Wish to Create">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
              <InputNumber
                style={{ width: "100%" }}
                addonAfter={numMinipools === 1 ? "Minipool" : "Minipools"}
                value={numMinipools}
                onChange={handleMinipoolChange}
              />
            </Space>
          </Col>
          <Col span={4}>
            <Tooltip title="The number of minipools and amount of AVAX staked is linked together.">
              <LinkOutlined
                style={{
                  marginTop: "32px",
                  fontSize: "26px",
                  color: "#696969",
                  display: "block",
                }}
                rotate={45}
                twoToneColor={"primary"}
              />
            </Tooltip>
          </Col>
          <Col span={10}>
            <Space direction="vertical">
              <Space>
                <Text strong>AVAX Staked</Text>
                <Tooltip title="Always 1000 AVAX per minipool">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
              <InputNumber
                style={{ width: "100%" }}
                addonAfter="AVAX"
                value={Number(formatEther(avaxAmount))}
                disabled
              />
            </Space>
          </Col>
        </Row>

        <Col span={24}>
          <Divider />
        </Col>
        {/*GGP*/}
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Text strong>GGP Collateral Percentage</Text>
              <Tooltip
                title={`(GGP Stake * GGP price) ÷ (AVAX Stake * AVAX Price) × 100`}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <InputNumber
              style={{ width: "100%" }}
              value={Number(ggpCollatPercent.toFixed(1))}
              type="number"
              addonAfter={"%"}
              onChange={handlePercentChange}
            />
          </Space>
        </Col>
        <Col span={24}>
          <Slider
            min={10}
            style={{ width: "100%" }}
            max={150}
            defaultValue={50}
            step={1}
            marks={{
              10: "10%",
              150: "150%",
            }}
            onChange={handlePercentChange}
            value={ggpCollatPercent}
          />
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Text strong>GGP Stake</Text>
              <Tooltip title="GGP stake needed to reach collateral percentage">
                <InfoCircleOutlined />
              </Tooltip>
            </Space>
            <InputNumber
              style={{ width: "100%" }}
              value={Number(formatEther(realGgpAmount))}
              addonAfter={"GGP"}
              type="number"
              onChange={handleGgpStake}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
}
