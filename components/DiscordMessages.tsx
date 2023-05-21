import DiscordMessage from "./DiscordMessage";
import { Col, Row, Skeleton } from "antd";

export default function DiscordMessages({
  messages,
  loading,
  limit,
}: {
  messages: any[];
  loading: boolean;
  limit: number;
}) {
  if (!messages) return null;
  const skeletons = Array.from(
    Array.prototype.fill.call({ length: limit }, <Skeleton active />)
  );
  return (
    <Row gutter={[16, 16]} justify="space-between" align="top">
      {loading
        ? skeletons
        : messages.map(
            ({ message, timestamp }) =>
              message && (
                <Col key={message._id}>
                  <DiscordMessage msg={message} timestamp={timestamp} />
                </Col>
              )
          )}
    </Row>
  );
}
