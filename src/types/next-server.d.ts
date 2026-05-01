declare module 'next/server' {
  export type NextRequest = any
  export type NextFetchEvent = any
  export type NextMiddleware = any
  export type MiddlewareConfig = any
  export type NextProxy = any
  export type ProxyConfig = any

  export const NextResponse: any
  export const URLPattern: any
  export const userAgent: any
  export const userAgentFromString: any
}
