import React, { useState, useEffect } from 'react';

function CustomizedMap(props) {
  // 使用 useState 替换 this.state
  const [MapComponent, setMapComponent] = useState(null);

  // 使用 useEffect 替换 componentDidMount
  useEffect(() => {
    // 定义一个异步函数来动态加载组件
    async function loadComponent() {
      const ImportedMapComponent = (await import("./../components/Map")).default;
      setMapComponent(() => ImportedMapComponent); // 使用 setMapComponent 更新状态，替代 this.setState
    }

    loadComponent(); // 调用该异步函数
  }, []); // 传递一个空数组确保 useEffect 只在组件挂载时执行，类似于 componentDidMount

  return (
    <div style={{ height: "30vh" }}>
      {MapComponent && (
        <MapComponent
          center={props.centerCoordinates}
          marker={props.markerCoordinates}
          content={props.content}
        />
      )}
    </div>
  );
}

export default CustomizedMap;