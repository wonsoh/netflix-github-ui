import React from "react";
import { chunk } from "lodash";
import { Row, Col, Card, Avatar, Empty, Spin } from "antd";
import Link from "next/link";
import { sendGitHubAPIRequest, API_OPERATIONS } from "../pages/api/github";
import { generateOrgLink } from "./lib/linkBuilder";

const { Meta } = Card;
const { useState, useEffect } = React;

const paddedStyle = {
  padding: "16px",
};

export function OrganizationCard({ login, avatarURL }) {
  return (
    <Card id={`org-card-${login}`}>
      <Meta avatar={<Avatar src={avatarURL} />} title={login} />
    </Card>
  );
}

export function OrganizationCardList() {
  const [state, setState] = useState({
    organizations: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      try {
        setState({
          loading: true,
        });
        const result = await sendGitHubAPIRequest(API_OPERATIONS.listOrgs);
        setState({
          ...state,
          organizations: result.data,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          loading: false,
          error,
        });
      }
    })();
  }, []);

  const chunks = chunk(state.organizations, 6);
  if (state.loading) {
    return (
      <Row justify="center">
        <Spin tip="Loading..." style={paddedStyle} />
      </Row>
    );
  }

  if (state.error || !chunks.length) {
    return (
      <Empty description="No data found. Please refresh or try searching for the specific repository" />
    );
  }

  return (
    <>
      <h1>Or select from one of the organizations below:</h1>
      {chunks.map((row) => (
        <Row>
          {row.map((cardEntry) => (
            <Col span={4} style={paddedStyle}>
              <Link href={generateOrgLink(cardEntry.login)}>
                <a>
                  <OrganizationCard {...cardEntry} />
                </a>
              </Link>
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}
