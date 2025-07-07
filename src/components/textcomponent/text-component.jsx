import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './text-component.css';

const TextComponent = ({ text, isBold, isItalic, isUnderline }) => {
    return (
        <div
            className={classNames(styles.textContainer, {
                [styles.bold]: isBold,
                [styles.italic]: isItalic,
                [styles.underline]: isUnderline,
            })}
        >
            <div style={{border: '1px solid #ccc', backgroundColor: '#f9f9f9', padding: '10px',height:'100%',width:'30%'}}>
                {text}
            </div>
            
        </div>
    );
};

TextComponent.propTypes = {
    text: PropTypes.string.isRequired,
    isBold: PropTypes.bool,
    isItalic: PropTypes.bool,
    isUnderline: PropTypes.bool
};

TextComponent.defaultProps = {
    isBold: false,
    isItalic: false,
    isUnderline: false
};

export default TextComponent;