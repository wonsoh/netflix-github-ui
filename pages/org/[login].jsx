import React, { useEffect, useState } from "react";
import { get } from "lodash";
import { Layout, Spin, Space, Button } from "antd";

import { useRouter } from "next/router";
import Head from "next/head";
import ErrorPage from "next/error";
import { HomeFilled } from "@ant-design/icons";
import {
  OrganizationSummary,
  OrganizationRepositories,
} from "../../components/organizationInfo";
import { sendGitHubAPIRequest, API_OPERATIONS } from "../api/github";
import { PaginationParams } from "../../common/client/github";
import SearchBar from "../../components/searchBar";

const { Header, Content } = Layout;
const PARAM_KEY = "login";

const padded = {
  padding: "20px",
};

const searchBarStyle = {
  paddingTop: "12px",
};

function handleErrorPage(error) {
  if (error) {
    if (error.response && error.response.status) {
      return <ErrorPage statusCode={error.response.status} />;
    }
    return <ErrorPage title={error.message} />;
  }
  return null;
}

export default function Home() {
  const router = useRouter();
  const login = get(router, ["query", PARAM_KEY]);
  const [state, setState] = useState({
    loading: false,
    error: null,
    orgInfoData: null,
    repoData: [],
  });

  useEffect(() => {
    (async () => {
      if (login) {
        try {
          setState({
            ...state,
            loading: true,
            error: null,
          });
          const [orgInfo, repos] = await Promise.all([
            sendGitHubAPIRequest(API_OPERATIONS.getOrgByLogin, {
              login,
            }),
            (async () => {
              const repositories = [];
              for (let i = 1; ; i += 1) {
                const result = await sendGitHubAPIRequest(
                  API_OPERATIONS.getReposForOrg,
                  {
                    login,
                  },
                  new PaginationParams(i)
                );
                if (!result.data.length) {
                  return repositories;
                }
                repositories.push(...result.data);
              }
            })(),
          ]);
          setState({
            ...state,
            loading: false,
            orgInfoData: orgInfo.data,
            repoData: repos,
            error: null,
          });
        } catch (error) {
          setState({
            ...state,
            loading: false,
            error,
          });
        }
      }
    })();
  }, [login]);

  const { orgInfoData, repoData, loading, error } = state;

  const normalizedLogin = (orgInfoData && orgInfoData.login) || login;
  return (
    <>
      <Head>
        <title>{`Details on ${normalizedLogin}`}</title>
      </Head>
      <Layout>
        <Header>
          <Space>
            <Button href="/" icon={<HomeFilled />} />
            <SearchBar
              value={normalizedLogin}
              style={searchBarStyle}
              disabled={loading}
            />
          </Space>
        </Header>
        <Spin tip="Loading..." size="large" spinning={loading}>
          <Content style={padded}>
            {error ? (
              handleErrorPage(error)
            ) : (
              <>
                <OrganizationSummary {...orgInfoData} />
                <OrganizationRepositories repoData={repoData} />
              </>
            )}
          </Content>
        </Spin>
      </Layout>
    </>
  );
}
