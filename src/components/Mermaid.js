import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

// 初始化 mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  logLevel: 'error',
});

const Mermaid = ({ chart }) => {
  const mermaidRef = useRef();

  useEffect(() => {
    const renderChart = async () => {
      if (!mermaidRef.current) return;
      
      try {
        // 清空之前的内容
        mermaidRef.current.innerHTML = '';
        
        // 生成唯一ID
        const id = `mermaid-${Date.now()}`;
        
        // 验证语法
        await mermaid.parse(chart);
        
        // 渲染图表
        const { svg } = await mermaid.render(id, chart);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid 渲染错误:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div style="color: red; padding: 10px;">
              图表渲染错误：${error.message || '请检查语法'}
            </div>
          `;
        }
      }
    };

    renderChart();
  }, [chart]);

  return <div ref={mermaidRef} className="mermaid" style={{ width: '100%', height: '100%' }} />;
};

export default Mermaid;