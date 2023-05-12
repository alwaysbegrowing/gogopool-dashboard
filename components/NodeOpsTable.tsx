import React from "react";
import { Card, Table, Button, Typography } from "antd";
const { ethers } = require("ethers");
const { Title } = Typography;
import { useContractRead } from "wagmi";
import minipoolManagerABI from "../abis/minipoolmanager.json";
import stakerABI from "../abis/staker.json";

const { Column, ColumnGroup } = Table;
import { formatDistance } from "date-fns";
const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

const App: React.FC = () => {
  const { data: minipoolData, isLoading }: any = useContractRead({
    address: "0x9946e68490D71Fe976951e360f295c4Cf8531D00",
    abi: stakerABI,
    functionName: "getStakers",
    args: [0, 100],
  });
  const reversedData = minipoolData ? minipoolData.toReversed() : [];
  console.log(minipoolData);

  return (
    <Table
      size="small"
      title={() => <div>Minipools</div>}
      scroll={{ x: true }}
      bordered={false}
      loading={isLoading}
      dataSource={reversedData}
      pagination={{ pageSize: 5 }}
    >
      <Column
        title="Node Address"
        dataIndex="0"
        key="2"
        render={(n) => {
          return (
            <Button type="ghost" href={`https://snowtrace.io/address/${n}`}>
              {n}
            </Button>
          );
        }}
      />
      <Column
        title="GGP Staked"
        dataIndex="6"
        key="2"
        render={(n) => {
          return n.div(weiValue).toNumber();
        }}
      />
      {/* <Column
        title="Liquid Staker Avax"
        dataIndex="9"
        key="2"
        render={(n) => {
          return n.div(weiValue).toNumber();
        }}
      />
      <Column
        title="Created"
        dataIndex="11"
        key="3"
        render={(n) => {
          const date = new Date(n.toNumber() * 1000);
          const timeAgo = formatDistance(date, new Date(), {
            addSuffix: true,
          });

          return timeAgo;
        }}
      /> */}
    </Table>
    // </Card>
  );
};

export default App;
