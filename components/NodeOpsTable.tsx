import React from "react";
import { Card, Table } from "antd";
import { toWei } from "../hooks/mounted";
const { Column } = Table;
import { useStakers } from "@/hooks/mounted";
import { CopyableAddress } from "./Copyable";

const App: React.FC = () => {
  const { data, isLoading } = useStakers();
  const [pageSize, setPageSize] = React.useState(5);
  if (!data) return <></>;

  const cleanedData = [] as any;
  data.forEach((staker: any) => {
    if (toWei(staker[3])) {
      cleanedData.push(staker);
    }
  });
  cleanedData.sort((a: any, b: any) => toWei(b[6]) - toWei(a[6]));

  return (
    <Card title="Node Operators">
      <Table
        size="small"
        scroll={{ x: true }}
        loading={isLoading}
        dataSource={cleanedData}
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
          title="Node Address"
          dataIndex="0"
          key="0"
          render={(n) => {
            return <CopyableAddress address={n} />;
          }}
        />
        <Column
          title="PPY Staked"
          dataIndex="6"
          key="1"
          render={(n) => {
            return toWei(n).toLocaleString();
          }}
        />

        <Column
          title="Minipools"
          dataIndex="3"
          key="2"
          render={(n) => {
            return Math.floor(toWei(n) / 1000);
          }}
        />
        {/* <Column
        title="Liquid Staker PLS"
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
    </Card>
  );
};

export default App;
