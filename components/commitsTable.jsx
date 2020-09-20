import React from "react";
import { Button, Avatar, Popover, Space, Table, Typography } from "antd";
import { GithubFilled, GithubOutlined } from "@ant-design/icons";
import { TableColumn } from "./lib/tableColumn";

const { Paragraph } = Typography;
const MAX_SHA_LENGTH = 8;
const MAX_MESSAGE_LENGTH = 100;

function Author({ name, avatarURL, email, authorURL }) {
  return (
    <Space>
      {avatarURL ? (
        <Avatar src={avatarURL} />
      ) : (
        <Avatar icon={<GithubFilled />} />
      )}
      <span>{name}</span>
      <a href={`mailto:${email}`}>{email}</a>
      <Button href={authorURL} icon={<GithubOutlined />} target="_blank">
        View on GitHub
      </Button>
    </Space>
  );
}

function CommitSHA({ sha }) {
  return (
    <Popover content={sha} placement="left">
      <pre>{sha.substring(0, MAX_SHA_LENGTH)}</pre>
    </Popover>
  );
}

function CommitMessage({ message }) {
  return (
    <Popover
      content={message}
      placement="bottom"
      style={{
        maxWidth: "100px",
      }}
    >
      <Paragraph
        ellipsis={{
          rows: 1,
          expandable: false,
        }}
      >
        {message.length > MAX_MESSAGE_LENGTH
          ? `${message.substring(0, MAX_MESSAGE_LENGTH)}...`
          : message}
      </Paragraph>
    </Popover>
  );
}

const commitColumns = [
  new TableColumn("Author", "author", ["author", "email"], (_, record) => (
    <Author {...record.author} />
  )),
  new TableColumn("Timestamp", "date", ["author", "date"]),
  new TableColumn("Commit Message", "message", "message", (text) => (
    <CommitMessage message={text} />
  )),
  new TableColumn("Commit SHA", "sha", "sha", (text) => (
    <CommitSHA sha={text} />
  )),
  new TableColumn("GitHub Link", "githubURL", "githubURL", (text) => (
    <Button href={text} target="_blank" icon={<GithubFilled />} />
  )),
];

export default function CommitsTable({ commits, pagination }) {
  return (
    <Table
      id="commits-table"
      columns={commitColumns}
      dataSource={commits}
      pagination={{
        onChange: pagination,
      }}
    />
  );
}
