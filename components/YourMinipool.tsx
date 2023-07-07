import {
  Button,
  Col,
  Divider,
  Input,
  InputNumber,
  Row,
  Slider,
  Space,
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
    <div>
      <h1>Your Minipool</h1>
      <Space direction="vertical" size={2} style={{ display: "flex" }}>
        {/*AVAX*/}
        <Row gutter={12}>
          <Col span={12}>
            <InputNumber
              addonBefore={<div># MP</div>}
              value={numMinipools}
              onChange={(e) => {
                let num = e ? e : 1;
                setNumMinipools(num);
                setAvaxAmount(parseEther((num * 1000).toString()));
              }}
            />
          </Col>
          <Col span={12}>
            <Input
              type="number"
              addonBefore={<div>AVAX</div>}
              value={+formatEther(avaxAmount)}
              onChange={(e) => {
                setAvaxAmount(parseEther(e.target.value || "0"));
                // setGgpPriceinAvax(parseEther(e.target.value || "0"));
              }}
            />
          </Col>
        </Row>
        <Divider />
        {/*GGP*/}
        <Row gutter={64} align="middle">
          <Col span={8}>
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
            <Input
              value={ggpCollatPercent * 100}
              type="number"
              addonAfter={<div>%</div>}
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
          <Col span={12} offset={4}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Input
                value={+formatEther(realGgpAmount)}
                addonBefore={<div>GGP</div>}
                addonAfter={
                  <Button
                    onClick={() => {
                      setGgpCollatPercent(
                        +formatEther(
                          realGgpAmount.mul(ggpPriceInAvax).div(avaxAmount)
                        )
                      );
                    }}
                  >
                    Calculate
                  </Button>
                }
                type="number"
                onChange={(e) => {
                  setRealGgpAmount(parseEther(e.target.value || "0"));
                }}
              />
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
}
