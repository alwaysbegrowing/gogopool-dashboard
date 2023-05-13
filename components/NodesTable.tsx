import React from "react";
import { Card, Table, Button, Typography } from "antd";
const { ethers } = require("ethers");
const { Title } = Typography;
import { useContractRead } from "wagmi";
import minipoolManagerABI from "../abis/minipoolmanager.json";
const hashEmoji = require("hash-emoji");
const { Text, Link } = Typography;
const { Column, ColumnGroup } = Table;
import { formatDistance } from "date-fns";
const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

const App: React.FC = () => {
  const { data: minipoolData, isLoading }: any = useContractRead({
    address: "0xc8de41c35fb389286546cf4107102a7656da7037",
    abi: minipoolManagerABI,
    functionName: "getMinipools",
    args: [2, 0, 100],
  });
  const reversedData = minipoolData ? minipoolData.toReversed() : [];
  console.log(minipoolData);

  return (
    <Card title="Minipools">
      <Table
        size="small"
        scroll={{ x: true }}
        bordered={false}
        loading={isLoading}
        dataSource={reversedData}
        pagination={{ pageSize: 5 }}
      >
        <Column
          title="Owner"
          dataIndex="5"
          key="2"
          render={(n) => {
            return (
              <>
                {hashEmoji(n)}
                {` `}
                <Link copyable href={`https://snowtrace.io/address/${n}`}>
                  {n}
                </Link>
              </>
            );
          }}
        />
        <Column
          title="Node OP Avax"
          dataIndex="8"
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
        />
      </Table>
    </Card>
  );
};

export default App;
