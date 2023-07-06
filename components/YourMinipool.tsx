import { Button, Col, Input, InputNumber, Row, Slider } from "antd";
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
      <Row gutter={32}>
        <Col>
          <div>Number of Minipools</div>
        </Col>
        <Col span={3}>
          <InputNumber
            value={numMinipools}
            onChange={(e) => {
              let num = e ? e : 1;
              setNumMinipools(num);
              setAvaxAmount(parseEther((num * 1000).toString()));
            }}
          />
        </Col>
        <Col>
          <div>AVAX amount</div>
        </Col>
        <Col span={3}>
          <Input
            type="number"
            value={+formatEther(avaxAmount)}
            onChange={(e) => {
              setAvaxAmount(parseEther(e.target.value || "0"));
              // setGgpPriceinAvax(parseEther(e.target.value || "0"));
            }}
          />
        </Col>
        <Col span={12}>
          <Row gutter={32}>
            <Col span={6}>
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

            <Col span={8}>
              <Input
                value={ggpCollatPercent * 100}
                type="number"
                onChange={(e) => {
                  setGgpCollatPercent(+e.target.value / 100);
                  setRealGgpAmount(
                    avaxAmount
                      .div(ggpPriceInAvax)
                      .mul(parseEther((+e.target.value / 100).toString()))
                  );
                }}
              />
              <div>%</div>
            </Col>
            <Col span={6}>
              <Input
                value={+formatEther(realGgpAmount)}
                type="number"
                onChange={(e) => {
                  setRealGgpAmount(parseEther(e.target.value || "0"));
                }}
              />
              <div>GGP</div>
              <Button
                onClick={() => {
                  setGgpCollatPercent(
                    +formatEther(
                      realGgpAmount.mul(ggpPriceInAvax).div(avaxAmount)
                    )
                  );
                }}
              >
                calc
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
