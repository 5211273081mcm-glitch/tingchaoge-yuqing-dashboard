import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import RoutesComponent from './app';
import './index.css';

// 使用 HashRouter，使得 /#/june、/#/may、/#/april 在任意静态托管下
// 刷新都不会 404，无需服务端 SPA 重写规则。
const MainApp = () => {
  return (
    <HashRouter>
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0d0d12',
              color: '#e2e8f0',
              fontFamily: 'Inter, "Microsoft YaHei", "PingFang SC", sans-serif',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 18, marginBottom: 8 }}>页面渲染出现问题</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{(error as Error)?.message}</div>
            </div>
          </div>
        )}
      >
        <RoutesComponent />
      </ErrorBoundary>
    </HashRouter>
  );
};

createRoot(document.getElementById('root')!).render(<MainApp />);
