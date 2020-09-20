import React from "react";
import { Layout, Row, Col } from "antd";
import Head from "next/head";
import { OrganizationCardList } from "../components/organizationCard";
import SearchBar from "../components/searchBar";

const { Content } = Layout;

const pushVertical = {
  marginTop: "10%",
  padding: "20px",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Landing Page</title>
      </Head>
      <Layout style={pushVertical}>
        <Content>
          <Row gutter={16} justify="center">
            <Col span={8}>
              <SearchBar id="search-bar" />
            </Col>
          </Row>
        </Content>
        <Content>
          <OrganizationCardList />
        </Content>
      </Layout>
    </>
  );
}
