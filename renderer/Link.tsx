import { Link as ChakraLink, LinkProps as ChakraLinkProps } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import {
    Link as ReactRouterLink,
    LinkProps as ReactRouterLinkProps,
    NavLink as ReactRouterNavLink,
    NavLinkProps as ReactRouterNavLinkProps,
} from 'react-router-dom'
import { ParseUrlParams } from 'typed-url-params'

import { routes } from '~/pages/routes'
import { buildRouteParams } from '~/util/router/build-route-params'

export const Link: FC<ReactRouterLinkProps & ChakraLinkProps> = (props) => <ChakraLink as={ReactRouterNavLink} {...props} />

type TypedLinkProps = Omit<ReactRouterLinkProps & ChakraLinkProps, 'to'>
export const TypedLink = <T extends typeof routes[number], K extends ParseUrlParams<T>>({
    to,
    ...props
}: TypedLinkProps & { to: [T, K] }) => {
    const url = useMemo(() => buildRouteParams(...to), [to])
    return <Link {...props} to={url} />
}

export const NavLink: FC<ReactRouterNavLinkProps & ChakraLinkProps> = (props) => <ChakraLink as={ReactRouterLink} {...props} />

type TypedNavLinkProps = Omit<ReactRouterNavLinkProps & ChakraLinkProps, 'to'>
export const TypedNavLink = <T extends typeof routes[number], K extends ParseUrlParams<T>>({
    to,
    ...props
}: TypedNavLinkProps & { to: [T, K] }) => {
    const url = useMemo(() => buildRouteParams(...to), [to])
    return <NavLink {...props} to={url} />
}
