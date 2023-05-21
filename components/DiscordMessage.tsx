import { format, parseISO, formatDistanceToNow } from "date-fns";
// @ts-ignore
import { toHTML } from "./markdown";
import { Space, Typography } from "antd";

const { Text } = Typography;

export function colorIntToHex(color: number) {
  return "#" + color.toString(16).padStart(6, "0");
}

const buttonColors: { [key: string]: string } = {
  1: "discord-button-primary",
  2: "discord-button-secondary",
  3: "discord-button-success",
  4: "discord-button-destructive",
  5: "discord-button-secondary",
};

export default function DiscordMessage({ msg, timestamp }: any) {
  console.log(msg);
  const time = formatDistanceToNow(timestamp, { addSuffix: true });
  return (
    <Space direction="vertical">
      <div
        className="discord-messages discord-light-theme"
        style={{
          border: "none",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
        }}
      >
        <div className="discord-message">
          <div className="discord-message-content">
            {!!msg.content && (
              <div className="discord-message-body">
                <div
                  className="discord-message-markup"
                  dangerouslySetInnerHTML={{
                    __html: toHTML(msg.content || "", {}),
                  }}
                />
              </div>
            )}
            <div className="discord-message-compact-indent">
              {msg.embeds &&
                msg.embeds.map(({ data }: any) => {
                  let inlineFieldIndex = 0;
                  const embed = data;
                  const hexColor = embed.color
                    ? colorIntToHex(parseInt(embed.color))
                    : "#1f2225";
                  let timestamp = "";
                  if (embed.timestamp) {
                    const date = parseISO(embed.timestamp);
                    if (!isNaN(date.getTime())) {
                      timestamp = format(date, "dd/MM/yyyy");
                    }
                  }
                  return (
                    <div
                      key={embed.id}
                      className="discord-embed overflow-hidden"
                    >
                      <div
                        className="discord-left-border"
                        style={{ backgroundColor: hexColor }}
                      ></div>
                      <div className="discord-embed-root">
                        <div className="discord-embed-wrapper">
                          <div className="discord-embed-grid">
                            {!!embed.author?.name && (
                              <div className="discord-embed-author overflow-hidden break-all">
                                {!!embed.author.icon_url && (
                                  <img
                                    src={embed.author.icon_url}
                                    alt=""
                                    className="discord-author-image"
                                  />
                                )}
                                {embed.author.url ? (
                                  <a href={embed.author.url}>
                                    {embed.author.name}
                                  </a>
                                ) : (
                                  embed.author.name
                                )}
                              </div>
                            )}
                            {!!embed.title && (
                              <div className="discord-embed-title overflow-hidden break-all">
                                {embed.url ? (
                                  <a
                                    href={embed.url}
                                    dangerouslySetInnerHTML={{
                                      __html: toHTML(embed.title || "", {
                                        isTitle: true,
                                      }),
                                    }}
                                  ></a>
                                ) : (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: toHTML(embed.title || "", {
                                        isTitle: true,
                                      }),
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            {!!embed?.description && (
                              <div
                                className="discord-embed-description"
                                dangerouslySetInnerHTML={{
                                  __html: toHTML(embed.description || "", {}),
                                }}
                              />
                            )}
                            {!!embed?.fields.length && (
                              <div className="discord-embed-fields">
                                {embed.fields.map((field: any) => (
                                  <div
                                    key={field.id}
                                    className={`discord-embed-field${
                                      field.inline
                                        ? ` discord-embed-inline-field discord-embed-inline-field-${
                                            (inlineFieldIndex++ % 3) + 1
                                          }`
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className="discord-field-title overflow-hidden break-all"
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(field.name || "", {
                                          isTitle: true,
                                        }),
                                      }}
                                    />
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: toHTML(field.value, {}),
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            {!!embed.image && (
                              <div className="discord-embed-media">
                                <img
                                  src={embed.image.url}
                                  alt=""
                                  className="discord-embed-image"
                                />
                              </div>
                            )}
                            {!!embed.thumbnail && (
                              <img
                                src={embed.thumbnail.url}
                                alt=""
                                className="discord-embed-thumbnail"
                              />
                            )}
                            {(embed.footer?.text || embed.timestamp) && (
                              <div className="discord-embed-footer overflow-hidden break-all">
                                {embed.footer?.icon_url && (
                                  <img
                                    src={embed.footer?.icon_url}
                                    alt=""
                                    className="discord-footer-image"
                                  />
                                )}
                                {embed.footer?.text}
                                {embed.footer?.text && embed.timestamp && (
                                  <div className="discord-footer-separator">
                                    •
                                  </div>
                                )}
                                <div className="flex-none">{timestamp}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div className="discord-attachments">
                {msg.components.map((row: any) => (
                  <div className="discord-action-row" key={row.id}>
                    {row.components.map(({ data: comp }: any) =>
                      comp.type === 2 ? (
                        comp.style === 5 ? (
                          <a
                            className={`discord-button discord-button-hoverable ${
                              buttonColors[comp.style]
                            }`}
                            key={comp.id}
                            target="_blank"
                            href={comp.url}
                            rel="noreferrer"
                          >
                            <span>{comp.label}</span>
                            <svg
                              className="discord-button-launch"
                              aria-hidden="false"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z"
                              ></path>
                              <path
                                fill="currentColor"
                                d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z"
                              ></path>
                            </svg>
                          </a>
                        ) : (
                          <div
                            className={`discord-button discord-button-hoverable ${
                              buttonColors[comp.style]
                            }`}
                            key={comp.id}
                          >
                            <span>{comp.label}</span>
                          </div>
                        )
                      ) : undefined
                    )}
                  </div>
                ))}
              </div>
              <Text type="secondary">{time}</Text>
            </div>
          </div>
        </div>
      </div>
    </Space>
  );
}
