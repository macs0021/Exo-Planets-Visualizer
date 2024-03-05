import React from 'react';
import './loading.css'; // Asegúrate de importar el CSS

const Loading = ({ loading, starLoading, mainMenu }) => {
    return (
        <div className={`loading-wrapper ${(loading && !mainMenu) || starLoading ? 'fadeInLoading' : 'fadeOutLoading'}`}>
            <div className="sphere"></div>
            <div className="circle"></div>
            <div className="dot"></div>
        </div>
    );
};

export default Loading;