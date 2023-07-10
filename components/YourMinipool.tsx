import {
  Col,
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

  const { Text } = Typography;

  console.log({ ggpCollatPercent: ggpCollatPercent })

  return (
    <>
      <h1>Example Minipool Stake</h1>
      {/*AVAX*/}
      <Row gutter={[0, 8]} justify="center">
        <Col span={20}>
          <Tooltip title="Number of Minipools">
            Number of Minipools
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="# MP"
            value={numMinipools}
            onChange={handleMinipoolChange}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="AVAX Staked / 1000 per minipool.">
            AVAX Staked
          </Tooltip>
          <Text>{+formatEther(avaxAmount)}</Text>
        </Col>
        {/*GGP*/}
        <Col span={12}>
          <Slider
            min={10}
            max={150}
            step={1}
            marks={{
              10: "10%",
              150: "150%",
            }}
            value={ggpCollatPercent}
            onChange={handlePercentChange}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="GGP Collateral Percentage is Calculated by the following formula: ((GGP * GGP price) / (AVAX * AVAX Price)) * 100">
            GGP Collateral Percentage
          </Tooltip>
          <InputNumber
            style={{ width: "100%" }}
            value={+ggpCollatPercent.toFixed(1)}
            type="number"
            addonAfter={"%"}
            onChange={handlePercentChange}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="GGP stake needed to reach collateral percentage">
            GGP Stake
          </Tooltip>
          <Input
            value={+formatEther(realGgpAmount)}
            addonBefore={"GGP"}
            type="number"
            onChange={handleGgpStake}
          />
        </Col >
      </Row >
    </>
  );
}
