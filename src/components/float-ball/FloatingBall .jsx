import React, { useState } from 'react';
import styles from './FloatingBall.css';


const FloatingBall = ({ mainBall, childBalls }) => {
    // 使用 useState 管理子悬浮球的显示状态
    const [isClicked, setIsClicked] = useState(false);
  
    // 点击主悬浮球时切换子悬浮球的显示状态
    const handleClick = () => {
      setIsClicked(!isClicked);
    };
    return (
      <div
        className={styles.floatingBallContainer}
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick} // 点击事件
      >
        {/* 主悬浮球 */}
        <div className={styles.floatingBall}
            
        >
          <img src={mainBall.image} alt="Main" className={styles.ballImage} />
          {mainBall.text && <p className={styles.ballText}>{mainBall.text}</p>}
        </div>
  
        {/* 子悬浮球 */}
        {isClicked && (
          <div className={styles.childBallsContainer}>
            {childBalls.map((child, index) => (
                child.isShow && (
                    <div key={index} className={styles.floatingBallChild}>
                    <img src={child.image} alt={`Child ${index}`} className={styles.ballImage} />
                    {child.text && <p className={styles.ballText}>{child.text}</p>}
                    {child.data && <p className={styles.ballData}>{child.data}</p>}
                  </div>
                )
              
            ))}
          </div>
        )}
      </div>
    );
  };

export default FloatingBall;
