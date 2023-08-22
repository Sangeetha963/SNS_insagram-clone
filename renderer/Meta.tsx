import { FC, ReactNode, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'

export type MetaProps = {
    children?: ReactNode

    title?: string
    description?: string

    ogpIcon?: string

    canonicalPath?: string

    ogpType?: 'website' | 'blog' | 'article' | 'product'
}

export const defaultDescription = 'base clientのテストサイトです'

export const Meta: FC<MetaProps> = ({ children, title, description, ogpIcon, canonicalPath, ogpType }) => {
    const titleBase = 'base client with notespace Inc.'
    const titleTemplate = `%s | ${titleBase}`

    const baseUrl = process.env.BASE_URL

    const twitterAccount = '@notespace_inc'

    const titleText = useMemo(() => {
        return title ? titleTemplate.replace('%s', title) : titleBase
    }, [title, titleTemplate, titleBase])

    return (
        <Helmet>
            <title>{titleText}</title>
            <meta name="description" content={description ?? defaultDescription} />
            <meta property="og:image" content={ogpIcon ?? `${baseUrl}/static/ogpIcon.png`} />
            <meta property="og:title" content={titleText} />
            <meta property="og:site_name" content={titleBase} />
            <meta property="og:locale" content={'ja_JP'} />
            <meta property="og:description" content={description ?? defaultDescription} />

            <meta property="twitter:card" content={'summary_large_image'} />
            <meta property="twitter:site" content={twitterAccount} />
            <meta property="twitter:creator" content={twitterAccount} />
            <meta property="twitter:title" content={titleText} />
            <meta property="twitter:description" content={description ?? defaultDescription} />
            <meta property="twitter:image" content={ogpIcon ?? `${baseUrl}/static/ogpIcon.png`} />
            {canonicalPath && <link rel="twitter:url" href={`${baseUrl}${canonicalPath}`} />}

            <meta name={'keywords'} content={'base-client'} />

            {ogpType && <meta property="og:type" content={ogpType} />}
            {canonicalPath && <link rel="canonical" href={`${baseUrl}${canonicalPath}`} />}
            {canonicalPath && <meta property="og:url" content={`${baseUrl}${canonicalPath}`} />}
            {children}
        </Helmet>
    )
}
