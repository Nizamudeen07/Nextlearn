const API_BASE_URL = 'https://nexlearn.noviindusdemosites.in';

function buildTargetUrl(pathSegments, searchParams) {
  const path = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
  const url = new URL(`${API_BASE_URL}/${path}`);
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  return url;
}

async function proxyRequest(request, { params }) {
  try {
    const targetUrl = buildTargetUrl(params.path, request.nextUrl.searchParams);
    const headers = new Headers();

    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers.set('authorization', authorization);
    }

    const accept = request.headers.get('accept');
    if (accept) {
      headers.set('accept', accept);
    }

    let body;
    if (!['GET', 'HEAD'].includes(request.method)) {
      const contentType = request.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        const forwarded = new FormData();

        for (const [key, value] of formData.entries()) {
          forwarded.append(key, value);
        }

        body = forwarded;
      } else {
        body = await request.text();
        if (contentType) {
          headers.set('content-type', contentType);
        }
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const responseHeaders = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Proxy request failed',
      },
      { status: 502 }
    );
  }
}

export async function GET(request, context) {
  return proxyRequest(request, context);
}

export async function POST(request, context) {
  return proxyRequest(request, context);
}

export async function PUT(request, context) {
  return proxyRequest(request, context);
}

export async function PATCH(request, context) {
  return proxyRequest(request, context);
}

export async function DELETE(request, context) {
  return proxyRequest(request, context);
}
