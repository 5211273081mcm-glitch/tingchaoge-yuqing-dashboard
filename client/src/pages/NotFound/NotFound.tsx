import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: '#0d0d12',
        color: '#e2e8f0',
        fontFamily: 'Inter, "Microsoft YaHei", "PingFang SC", sans-serif',
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 700, color: '#f97316' }}>404</div>
      <div style={{ fontSize: 14, color: '#64748b' }}>页面不存在</div>
      <Link to="/june" style={{ fontSize: 13, color: '#3b82f6' }}>
        返回 6 月舆情大盘
      </Link>
    </div>
  );
};

export default NotFound;
