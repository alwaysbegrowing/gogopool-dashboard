import React from "react";
import { Card, Table } from "antd";
const { ethers } = require("ethers");
import { useContractRead } from "wagmi";
const { Column } = Table;
import { formatDistance } from "date-fns";
import { BinTools } from "avalanche";
import { minipoolManagerAbi } from "@/abis/minipoolmanager";
import { BigNumber } from "ethers";
import { CopyableAddress, CopyableNodeId } from "./Copyable";

const bintools = BinTools.getInstance();

const weiValue = ethers.BigNumber.from("1000000000000000000"); // represents 1 Ether in wei (10^18)

const App: React.FC = () => {
  const [pageSize, setPageSize] = React.useState(5);

  const { data: minipoolData, isLoading }: any = useContractRead({
    address: "0xc8de41c35fb389286546cf4107102a7656da7037",
    abi: minipoolManagerAbi,
    functionName: "getMinipools",
    args: [2, BigNumber.from(0), BigNumber.from(100)],
  });
  const reversedData = minipoolData ? minipoolData.toReversed() : [];

  return (
    <Card title="Minipools">
      <Table
        size="small"
        scroll={{ x: true }}
        bordered={false}
        loading={isLoading}
        dataSource={reversedData}
        pagination={{
          pageSize,
          pageSizeOptions: ["5", "10", "50", "500"],
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPageSize(size);
          },
        }}
      >
        <Column
          title="NodeID"
          dataIndex="1"
          key="nodeID"
          render={(n: string) => {
            return <CopyableNodeId nodeId={n} />;
          }}
        />
        <Column
          title="Owner"
          dataIndex="5"
          key="2"
          render={(n) => {
            return <CopyableAddress address={n} />;
          }}
        />
        <Column
          title="Node OP PLS"
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
