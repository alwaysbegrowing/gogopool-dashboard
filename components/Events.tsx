import { Button, Col, Input, Pagination, Row, Space, Typography } from "antd";
import DiscordMessages from "./DiscordMessages";
import { useEffect, useState } from "react";
import { DiscordIcon } from "./DiscordIcon";

const { Title } = Typography;
export function Events() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [messages, setMessages] = useState<{ data: any[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const onChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
  };
  const owner = useDebounce(search, 500);

  useEffect(() => {
    async function getMessages() {
      setMessages({ data: [], loading: true });
      const messages = await fetch(
        `/api/discord/messages?limit=${limit || 1000}&page=${page || 1}&owner=${
          owner || ""
        }`
      )
        .then((res) => res.json())
        .catch(console.error);
      setMessages({ data: messages, loading: false });
    }
    getMessages();
  }, [page, limit, owner]);

  return (
    <Space direction="vertical">
      <Row justify={"center"}>
        <Col>
          <Space direction="vertical">
            <Title>Events from the official Discord Channel</Title>
            <Button
              type="link"
              size="large"
              href="https://discord.com/invite/4fNtjkyuNw"
              icon={<DiscordIcon />}
              style={{ float: "right" }}
            >
              Join the Discord
            </Button>
            <Input
              placeholder="Search by owner"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Pagination
              total={messages?.data?.length || 0}
              onChange={onChange}
              showTotal={(total, range) => {
                console.log({ total, range });
                if (range[0] < 0) return `1 - ${total} of items`;
                return `${range[0]}-${range[1]} of ${total} items`;
              }}
              defaultPageSize={limit}
              defaultCurrent={page}
            />
          </Space>
        </Col>
      </Row>
      <DiscordMessages
        loading={messages.loading}
        limit={limit}
        messages={messages.data}
      />
    </Space>
  );
}

function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
