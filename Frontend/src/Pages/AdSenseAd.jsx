import React, { useEffect } from 'react';

const AdSenseAd = () => {
    useEffect(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
            window.adsbygoogle.push({});
        }
    }, []);

    const adStyle = {
        display: 'block',
        margin: '10px auto', // Example margin
        maxWidth: '100%', // Example width
        height:'20px',
        zindex:'999',
    };

    return (
        <ins className="adsbygoogle"
            style={adStyle}
            data-ad-client="ca-pub-5228658089159350"
            data-ad-slot="5633755342"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
    );
};

export default AdSenseAd;
