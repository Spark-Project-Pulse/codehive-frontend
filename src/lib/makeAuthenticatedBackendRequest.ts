import { GoogleAuth } from 'google-auth-library'

export async function makeAuthenticatedBackendFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (options.method && !['GET', 'HEAD', 'POST', 'DELETE', 'PUT', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'].includes(options.method)) {
    throw new Error(`Invalid request method: ${options.method}`);
  }

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
  }

  const url = `${baseUrl}${path}`
  const auth = new GoogleAuth()

  if (!auth) {
    throw new Error('Unable to create GoogleAuth object')
  }

  const client = await auth.getIdTokenClient(baseUrl)
  if (!client) {
    throw new Error('Unable obtain the ID toekn')
  }

  const response = await client.request({
    url,
    method: options.method as 'GET' | 'HEAD' | 'POST' | 'DELETE' | 'PUT' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH',
    headers: options.headers,
    body: options.body,
  })

  const { status, statusText, headers, data } = response;
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: headers,
  });
}