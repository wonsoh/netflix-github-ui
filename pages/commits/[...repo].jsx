import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Layout, Spin, Result, Button, Alert, Typography, Space } from "antd";

import { useRouter } from "next/router";
import { HomeFilled } from "@ant-design/icons";
import Link from "next/link";
import { sendGitHubAPIRequest, API_OPERATIONS } from "../api/github";
import { PaginationParams } from "../../common/client/github";
import CommitsTable from "../../components/commitsTable";
import { generateOrgLink } from "../../components/lib/linkBuilder";

const { Content, Header } = Layout;
const { Title } = Typography;

const PARAM_KEY = "repo";
// all repos should be in <org_name>/<repo> format
const REPO_PARAM_LENGTH = 2;

const padded = {
  padding: "20px",
};

const headerStyle = {
  paddingTop: "12px",
};

export default function Home() {
  const router = useRouter();
  const repos = get(router, ["query", PARAM_KEY], []);
  if (repos.length !== REPO_PARAM_LENGTH) {
    return (
      <Result
        status="error"
        title="Invalid Request"
        extra={
          <Button href="/" icon={<HomeFilled />} size="large">
            Go Home
          </Button>
        }
      />
    );
  }
  const repositoryFullName = repos.join("/");
  const [state, setState] = useState({
    error: null,
    fetchable: true, // will be set to false if no further data is fetchable
    commits: [],
    currentPage: 1,
    loading: false,
  });

  const { commits, currentPage, fetchable, loading, error } = state;

  /**
   * fetchData ttempts to fetch more commits for this table. If maximum bounds are reached
   * This function should be exception-safe. It handles the error on its own so the caller
   * should not handle the error
   * @param {Number} curPage Current page in the table
   * @param {Number} maxPage Maximum page in the table
   */
  async function fetchData(curPage, maxPage) {
    if (fetchable && curPage * maxPage >= commits.length) {
      try {
        setState({
          ...state,
          loading: true,
        });
        const result = await sendGitHubAPIRequest(
          API_OPERATIONS.getCommitsForRepo,
          {
            repositoryFullName,
          },
          new PaginationParams(currentPage)
        );
        // no data means no longer fetchable,
        const moreData =
          Boolean(result.data.length) || result.data.length >= 100;
        setState({
          ...state,
          error: null,
          fetchable: moreData,
          commits: [...state.commits, ...result.data],
          currentPage: state.currentPage + 1,
          loading: false,
        });
      } catch (err) {
        setState({
          ...state,
          error: err,
        });
      }
    }
  }

  useEffect(() => {
    fetchData(0, 0);
  }, []);

  return (
    <>
      <Layout>
        <Header style={headerStyle}>
          <Title level={3} style={{ color: "white" }}>
            <Space>
              <Button href="/" icon={<HomeFilled />} />
              <>
                <Link href={generateOrgLink(repos[0])}>
                  <a>{repos[0]}</a>
                </Link>
                {" / "}
                {repos[1]}
              </>
            </Space>
          </Title>
        </Header>
        <Content style={padded}>
          <Spin size="large" tip="Loading more commits..." spinning={loading}>
            <CommitsTable commits={commits} pagination={fetchData} />
            {error && <Alert message="Error occured" type="error" showIcon />}
          </Spin>
        </Content>
      </Layout>
    </>
  );
}
