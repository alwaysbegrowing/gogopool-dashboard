import { debounce } from "@/helpers/debounce";
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
import { ChangeEvent } from "react";

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
  handleGgpStake: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { Text, Title } = Typography;

  return (
    <>
      <Title level={3}>Your Minipool</Title>
      {/*AVAX*/}
      <Row gutter={[0, 8]} justify="start">
        <Col span={16}>
          <Tooltip title="Number of Minipools">
            <Text strong>Number of Minipools</Text>
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="# MP"
            value={numMinipools}
            onChange={handleMinipoolChange}
          />
        </Col>
        <Col span={16}>
          <Tooltip title="AVAX Staked: 1000 per minipool.">
            <Text strong>AVAX Staked</Text>
          </Tooltip>
          <Descriptions size="small" bordered>
            <Descriptions.Item label="AVAX">
              {+formatEther(avaxAmount)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={16}>
          <Divider />
        </Col>
        {/*GGP*/}
        <Col span={16}>
          <Tooltip title="GGP Collateral Percentage is Calculated by the following formula: ((GGP Stake * GGP price) / (AVAX Stake * AVAX Price)) * 100">
            <Text strong>GGP Collateral Percentage</Text>
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            value={+ggpCollatPercent.toFixed(1)}
            type="number"
            addonAfter={"%"}
            onChange={handlePercentChange}
          />
        </Col>
        <Col span={16}>
          <Slider
            min={10}
            max={150}
            defaultValue={50}
            step={1}
            marks={{
              10: "10%",
              150: "150%",
            }}
            onChange={debounce(handlePercentChange, 500)}
          />
        </Col>
        <Col span={16}>
          <Tooltip title="GGP stake needed to reach collateral percentage">
            <Text strong>GGP Stake</Text>
          </Tooltip>
          <Input
            value={+formatEther(realGgpAmount)}
            addonBefore={"GGP"}
            type="number"
            onChange={handleGgpStake}
          />
        </Col>
      </Row>
    </>
  );
}
