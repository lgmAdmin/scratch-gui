import React, { useEffect, useRef } from 'react';

const SerialMonitor = ({ serialData }) => {
    const monitorRef = useRef(null);

    useEffect(() => {
        // 每次数据更新后滚动到底部
        if (monitorRef.current) {
            monitorRef.current.scrollTop = monitorRef.current.scrollHeight;
        }
    }, [serialData]);

    return (
        <div
            ref={monitorRef}
            style={{
                backgroundColor: '#1e1e1e',
                color: '#00ff88',
                padding: '10px',
                borderRadius: '8px',
                height: '300px',
                width: '100%',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)'
            }}
        >
            {serialData}
        </div>
    );
};

export default SerialMonitor;
