import React from "react";
import { find, uniq } from "lodash";
import { Button, PageHeader, Table } from "antd";
import { GithubOutlined, GithubFilled } from "@ant-design/icons";
import Link from "next/link";
import { TableColumn } from "./lib/tableColumn";
import { generateCommitsLink } from "./lib/linkBuilder";

export function OrganizationSummary({
  login,
  description,
  avatarURL,
  githubURL,
}) {
  return (
    <>
      <PageHeader
        title={login}
        avatar={{ src: avatarURL }}
        subTitle={description}
        extra={[
          <Button
            key={login}
            icon={<GithubOutlined />}
            href={githubURL}
            target="_blank"
          >View on GitHub</Button>,
        ]}
      />
    </>
  );
}

/**
 * DEFAULT_SORTER is the sorter that follows natural ordering for ascending
 * @param {*} key key to index on
 */
const DEFAULT_SORTER = (key) => (a, b) => a[key] - b[key];

/**
 * DEFAULT_SORTER is the sorter that follows natural ordering for ascending of strings
 * @param {*} key key to index on
 */
const DEFAULT_STRING_SORTER = (key) => (a, b) => a[key].localeCompare(b[key]);

/**
 * REVERSE_SORTER is the sorter that follows reverse of natural ordering for ascending
 * @param {*} key key to index on
 */
const REVERSE_SORTER = (key) => (a, b) => -DEFAULT_SORTER(key)(a, b);

const repositoryColumns = [
  new TableColumn(
    "Name",
    "name",
    "name",
    (text, record) => (
      <Link href={generateCommitsLink(record.fullName)}>
        <a className="repo-link" id={`repo-link-${text}`}>{text}</a>
      </Link>
    ),
    {
      sorter: DEFAULT_STRING_SORTER("name"),
    }
  ),
  new TableColumn("Language", "language", "language", null, {
    onFilter: (value, record) => record.language === value,
  }),
  new TableColumn("Stargazers", "stargazersCount", "stargazersCount", null, {
    sorter: REVERSE_SORTER("stargazersCount"),
  }),
  new TableColumn("Forks", "forksCount", "forksCount", null, {
    sorter: REVERSE_SORTER("forksCount"),
  }),
  new TableColumn("Watchers", "watchersCount", "watchersCount", null, {
    sorter: REVERSE_SORTER("watchersCount"),
  }),
  new TableColumn("Open Issues", "openIssuesCount", "openIssuesCount", null, {
    sorter: REVERSE_SORTER("openIssuesCount"),
  }),
  new TableColumn("Size", "size", "size", null, {
    sorter: REVERSE_SORTER("size"),
  }),
  new TableColumn("GitHub Link", "githubURL", "githubURL", (text) => (
    <Button href={text} target="_blank" icon={<GithubFilled />} />
  )),
];

export function OrganizationRepositories({ repoData }) {
  const languages = uniq(repoData.map((v) => v.language)).map((v) => ({
    text: v,
    value: v,
  }));
  const languageColumn = find(repositoryColumns, { dataIndex: "language" });
  languageColumn.filters = languages;
  return <Table id="repository-table" columns={repositoryColumns} dataSource={repoData} />;
}
