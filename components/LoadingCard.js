import React from "react";
import { atom, useRecoilState } from "recoil";
import { withRouter } from "next/router";
import { Card } from "antd";

// recoil atom保存loading状态
const loadingState = atom({
  key: "uniqueLoadingStateKey", 
  default: true, // 设置loading的状态为true
});

function LoadingCard() {
  const [loading, setLoading] = useRecoilState(loadingState);

  return (
    <Card
      style={{
        width: "100%",
        marginTop: 16,
      }}
      loading={loading}
    ></Card>
  );
}

export default withRouter(LoadingCard);