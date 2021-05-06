export const parse = <T extends { pkrn_auth?: string }>(response: T) => {
  if (response.pkrn_auth) {
    document.cookie = `pkrn_auth=${response.pkrn_auth};max-age=604800;domain=localhost`;
    delete response.pkrn_auth;
  }
}

export const attach = (request: Record<string, any>) => { // eslint-disable-line
  if (document.cookie) {
    request.pkrn_auth = document.cookie?.split("; ").find((row) => row.startsWith("pkrn_auth="))?.split('=')[1];
    if (!request.pkrn_auth) {
      delete request.pkrn_auth;
    }
  }
  return request;
}