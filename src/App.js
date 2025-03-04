import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import mermaid from 'mermaid';
import Mermaid from './components/Mermaid';

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 20px;
  gap: 20px;
  background: #f5f5f5;
`;

const Editor = styled.textarea`
  flex: 1;
  padding: 20px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  line-height: 1.5;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: calc(100vh - 80px); // 添加这行，减去padding和按钮的高度
  &:focus {
    outline: none;
    border-color: #2196F3;
  }
`;

const Preview = styled.div`
  flex: 1;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: auto;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #1976D2;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: #333;
  font-size: 24px;
  font-weight: 500;
  z-index: 100;
  background: #f5f5f5;
  padding: 0 20px;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #ffebee;
  border: 1px solid #ffcdd2;
  font-size: 14px;
`;

const CodeEditor = styled(SyntaxHighlighter)`
  flex: 1 !important;
  margin: 0 !important;
  padding: 20px !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  border: 1px solid #ddd !important;
  border-radius: 8px !important;
  resize: none !important;
  background: white !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  height: calc(100vh - 80px) !important;
  overflow: auto !important;
  &:focus {
    outline: none !important;
    border-color: #2196F3 !important;
  }
`;

function App() {
  const [code, setCode] = useState(`---
title: 流程图示例
---
flowchart TD
    A[开始] --> B{是否有会员卡?}
    B -->|是| C[享受会员折扣]
    B -->|否| D[建议办理会员]
    C --> E[收银付款]
    D --> E
    E --> F[结束]
    
    style A fill:#f9f,stroke:#333,stroke-width:4px
    style F fill:#bbf,stroke:#333,stroke-width:2px
    style B fill:#ff9,stroke:#333,stroke-width:2px`);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code.trim()) {
      setError(null);
      return;
    }

    try {
      mermaid.parse(code);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [code]);

  const handleClear = () => {
    setCode(`flowchart TD
    A[开始] --> B[结束]`);
  };

  const handleExportSVG = () => {
    const svgElement = document.querySelector('.mermaid svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mermaid-diagram.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportPNG = async () => {
    const svgElement = document.querySelector('.mermaid svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const cleanedSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        ${svgData}`;
    
      const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(cleanedSvg)));
    
      const img = new Image();
    
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 获取 SVG 的实际尺寸
        const svgWidth = svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value;
        const svgHeight = svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value;
        
        // 设置画布尺寸为 SVG 的实际尺寸
        canvas.width = svgWidth * 2;  // 2倍大小以提高清晰度
        canvas.height = svgHeight * 2;
        
        // 清空画布并设置白色背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 按比例绘制图像
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
        
        try {
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = 'mermaid-diagram.png';
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 'image/png');
        } catch (error) {
          console.error('导出失败:', error);
          window.open(svgUrl, '_blank');
        }
      };
      
      img.src = svgUrl;
    }
  };

  return (
    <Container>
      <Title>Mermaid代码编辑和预览器</Title>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', marginTop: '60px' }}>
        <ButtonGroup>
          <ActionButton onClick={handleClear}>
            清空编辑器
          </ActionButton>
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Editor
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="在这里输入 Mermaid 代码..."
        />
      </div>
      <div style={{ width: '50%', marginTop: '60px' }}>
        <PreviewHeader>
          <div></div>
          <ButtonGroup>
            <ActionButton onClick={handleExportSVG}>
              导出 SVG
            </ActionButton>
            <ActionButton onClick={handleExportPNG}>
              导出 PNG
            </ActionButton>
          </ButtonGroup>
        </PreviewHeader>
        <Preview>
          <Mermaid chart={code} />
        </Preview>
      </div>
      <ExampleList>
        {Object.entries(examples).map(([name, example]) => (
          <ExampleButton key={name} onClick={() => setCode(example)}>
            {name}示例
          </ExampleButton>
        ))}
      </ExampleList>
    </Container>
  );
}

const ExampleList = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 100;
`;

const ExampleButton = styled.button`
  padding: 6px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0.8;
  &:hover {
    background: #45a049;
    opacity: 1;
  }
`;

const examples = {
  flowchart: `flowchart LR
    A[硬件层] --> B[系统层]
    B --> C[应用层]
    B --> D[数据层]
    C --> E[用户界面]
    D --> F[数据库]
    D --> G[缓存]`,

  sequence: `sequenceDiagram
  participant 用户
  participant 前端
  participant 服务器
  participant 数据库

  用户->>前端: 点击登录
  前端->>服务器: 发送登录请求
  服务器->>数据库: 查询用户信息
  数据库-->>服务器: 返回用户数据
  服务器-->>前端: 返回登录结果
  前端-->>用户: 显示登录状态`,

  gantt: `gantt
  title 项目开发计划
  dateFormat  YYYY-MM-DD
  section 设计阶段
  需求分析     :a1, 2024-01-01, 7d
  UI设计      :a2, after a1, 10d
  section 开发阶段
  前端开发     :a3, after a2, 15d
  后端开发     :a4, after a2, 20d
  section 测试阶段
  功能测试     :a5, after a4, 7d
  性能测试     :a6, after a5, 5d`,

  classDiagram: `classDiagram
  class Animal {
      +String name
      +int age
      +makeSound()
  }
  class Dog {
      +String breed
      +bark()
  }
  class Cat {
      +String color
      +meow()
  }
  Animal <|-- Dog
  Animal <|-- Cat`,

  mindmap: `mindmap
  root((思维导图))
      编程语言
          前端
              HTML
              CSS
              JavaScript
          后端
              Java
              Python
              Go
      数据库
          关系型
              MySQL
              PostgreSQL
          非关系型
              MongoDB
              Redis`
};

// 删除文件末尾重复的 examples、handleClear、handleExportSVG 和 handleExportPNG 声明

export default App;