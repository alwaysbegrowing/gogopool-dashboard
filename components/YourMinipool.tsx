import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Slider,
  Space,
  Tooltip,
} from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils.js";
import { Dispatch, SetStateAction } from "react";

export function YourMinipool({
  numMinipools,
  setNumMinipools,
  avaxAmount,
  setAvaxAmount,
  ggpCollatPercent,
  setGgpCollatPercent,
  realGgpAmount,
  setRealGgpAmount,
  ggpPriceInAvax,
}: {
  numMinipools: number;
  setNumMinipools: Dispatch<SetStateAction<number>>;
  avaxAmount: BigNumber;
  setAvaxAmount: Dispatch<SetStateAction<BigNumber>>;
  ggpCollatPercent: number;
  setGgpCollatPercent: Dispatch<SetStateAction<number>>;
  realGgpAmount: BigNumber;
  setRealGgpAmount: Dispatch<SetStateAction<BigNumber>>;
  ggpPriceInAvax: BigNumber;
}) {
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
            onChange={(e) => {
              let num = e ? e : 1;
              setNumMinipools(num);
              setAvaxAmount(parseEther((num * 1000).toString()));
            }}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="AVAX Staked / 1000 per minipool.">
            AVAX Staked
          </Tooltip>
          <Input
            type="number"
            disabled
            addonBefore="AVAX"
            value={+formatEther(avaxAmount)}
            onChange={(e) => {
              setAvaxAmount(parseEther(e.target.value || "0"));
              // setGgpPriceinAvax(parseEther(e.target.value || "0"));
            }}
          />
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
            value={ggpCollatPercent * 100}
            onChange={(e) => {
              setGgpCollatPercent(e / 100);
              setRealGgpAmount(
                avaxAmount
                  .div(ggpPriceInAvax)
                  .mul(parseEther((e / 100).toString()))
              );
            }}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="GGP Collateral Percentage is Calculated by the following formula: ((GGP * GGP price) / (AVAX * AVAX Price)) * 100">
            GGP Collateral Percentage
          </Tooltip>
          <Input
            value={ggpCollatPercent * 100}
            type="number"
            addonAfter={"%"}
            onChange={(e) => {
              setGgpCollatPercent(+e.target.value / 100);
              setRealGgpAmount(
                avaxAmount
                  .div(ggpPriceInAvax)
                  .mul(parseEther((+e.target.value / 100).toString()))
              );
            }}
          />
        </Col>
        <Col span={20}>
          <Tooltip title="GGP stake needed to reach collateral percentage">
            GGP Stake
          </Tooltip>
          <Input
            value={+formatEther(realGgpAmount)}
            addonBefore={"GGP"}
            addonAfter={
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setGgpCollatPercent(
                    +formatEther(
                      realGgpAmount.mul(ggpPriceInAvax).div(avaxAmount)
                    )
                  );
                }}
              >
                Calculate
              </div>
            }
            type="number"
            onChange={(e) => {
              setRealGgpAmount(parseEther(e.target.value || "0"));
            }}
          />
        </Col >
      </Row >
    </>
  );
}