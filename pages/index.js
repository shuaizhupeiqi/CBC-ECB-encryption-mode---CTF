import HomePage from "./HomePage";
import Layout from "./layout";
import { Button, Space } from 'antd';


export default function App() {
  const a = () => {
    console.log('11',process.env.NODE_ENV)
  }
  return (

    <Space direction="vertical" style={{ width: "100%" }} size={[0, 48]}>
      <div>

          <HomePage />

      </div>
    </Space>   

  );
}
