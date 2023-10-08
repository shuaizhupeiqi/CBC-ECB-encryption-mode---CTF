import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Router from 'next/router';

const ButtonGroup = ({ data }) => {
    const handleButtonClick = () => {
    Router.push('/SettingPage');
  };

  return (
 
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
         
      <Button 
        icon={<PlusOutlined style={{ fontSize: '70px' }} />}  // 调整加号图标的大小
        onClick={handleButtonClick} 
        style={{ 
          flex: 1, 
          margin: '0 10px', 
          width: '100px',  // 调整按钮宽度
          height: '100px',  // 调整按钮高度
          borderRadius: '50%',  // 使按钮成为圆形
          display: 'flex',  // 使图标居中
          alignItems: 'center',  // 使图标垂直居中
          justifyContent: 'center'  // 使图标水平居中
        }} 
      />
      <Button 
        icon={<PlusOutlined style={{ fontSize: '70px' }} />} 
        onClick={handleButtonClick} 
        style={{ 
            flex: 1, 
            margin: '0 10px', 
            width: '100px',  // 调整按钮宽度
            height: '100px',  // 调整按钮高度
            borderRadius: '50%',  // 使按钮成为圆形
            display: 'flex',  // 使图标居中
            alignItems: 'center',  // 使图标垂直居中
            justifyContent: 'center'  // 使图标水平居中
          }}       />
      <Button 
        icon={<PlusOutlined style={{ fontSize: '70px' }} />} 
        onClick={handleButtonClick} 
        style={{ 
            flex: 1, 
            margin: '0 10px', 
            width: '100px',  // 调整按钮宽度
            height: '100px',  // 调整按钮高度
            borderRadius: '50%',  // 使按钮成为圆形
            display: 'flex',  // 使图标居中
            alignItems: 'center',  // 使图标垂直居中
            justifyContent: 'center'  // 使图标水平居中
          }}       />
    </div>
  );
};

export default ButtonGroup;
