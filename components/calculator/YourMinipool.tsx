import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Col,
  Descriptions,
  Divider,
  Input,
  InputNumber,
  Row,
  Slider,
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
        <Col span={24}>
          <Text strong>Number of Minipools &nbsp;</Text>
          <Tooltip title="Number of Minipools You Wish to Create">
            <InfoCircleOutlined />
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            addonAfter={numMinipools === 1 ? "Minipool" : "Minipools"}
            value={numMinipools}
            onChange={handleMinipoolChange}
          />
        </Col>
        <Col span={24}>
          <Text strong>AVAX Staked &nbsp;</Text>
          <Tooltip title="Always 1000 AVAX per minipool">
            <InfoCircleOutlined />
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            addonAfter="AVAX"
            value={Number(formatEther(avaxAmount))}
            readOnly
          />
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
        {/*GGP*/}
        <Col span={24}>
          <Text strong>GGP Collateral Percentage &nbsp;</Text>
          <Tooltip title={`(GGP Stake * GGP price) ÷ (AVAX Stake * AVAX Price) × 100`}>
            <InfoCircleOutlined />
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            value={Number(ggpCollatPercent.toFixed(1))}
            type="number"
            addonAfter={"%"}
            onChange={handlePercentChange}
          />
        </Col>
        <Col span={1}>
        </Col>
        <Col span={21}>
          <Slider
            style={{ width: "100%" }}
            min={10}
            max={150}
            defaultValue={50}
            step={1}
            marks={{
              10: "10%",
              150: "150%",
            }}
            onChange={handlePercentChange}
          />
        </Col>
        <Col span={24}>
          <Text strong>GGP Stake &nbsp;</Text>
          <Tooltip title="GGP stake needed to reach collateral percentage">
            <InfoCircleOutlined />
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            value={Number(formatEther(realGgpAmount))}
            addonAfter={"GGP"}
            type="number"
            onChange={handleGgpStake}
          />
        </Col>
      </Row>
    </>
  );
}
