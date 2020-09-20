import React from "react";
import { Input } from "antd";

import { useRouter } from "next/router";
import { generateOrgLink } from "./lib/linkBuilder";

const { Search } = Input;

export default function SearchBar({ value, id, disabled, style }) {
  const router = useRouter();
  return (
    <Search
      style={style}
      id={id}
      defaultValue={value}
      disabled={disabled}
      placeholder="Please enter organization name"
      enterButton
      size="large"
      onSearch={(entry) =>
        router.push(generateOrgLink(encodeURIComponent(entry)))
      }
    />
  );
}
