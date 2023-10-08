//This page is the standard layout for all pages
import {useRecoilState} from 'recoil';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import{ Row } from "antd";




function Layout(props) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <NavBar />
      <div style={{
        padding: '0 0.5rem',
        width: '90%',
        minHeight: 'calc(100vh - 50px)',
        margin: 'auto',
        boxSizing: 'border-box', // 添加 box-sizing 可以确保 padding 和 border 不会增加元素的宽度
      }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;