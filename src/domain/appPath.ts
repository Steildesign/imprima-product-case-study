const configuredBasePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function prependBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${configuredBasePath}${normalizedPath}` || "/";
}

export function stripBasePath(pathname: string): string {
  if (!configuredBasePath) {
    return pathname;
  }

  if (pathname === configuredBasePath) {
    return "/";
  }

  if (pathname.startsWith(`${configuredBasePath}/`)) {
    return pathname.slice(configuredBasePath.length);
  }

  return pathname;
}
