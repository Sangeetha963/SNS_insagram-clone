import { FC } from 'react'
import { Helmet } from 'react-helmet-async'

export const GA4: FC<{ trackingCode: string; isEnable: boolean }> = ({ trackingCode, isEnable }) => {
    if (!isEnable) return <></>

    return (
        <Helmet>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingCode}`} />
            <script>
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${trackingCode}');
                `}
            </script>
        </Helmet>
    )
}
