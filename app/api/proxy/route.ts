import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://probeauty-backend.onrender.com";

export async function POST(request: NextRequest) {
  try {
    // Try to parse JSON body, but handle empty body gracefully
    let body = {};
    try {
      const text = await request.text();
      if (text && text.trim()) {
        body = JSON.parse(text);
      }
    } catch (parseError) {
      console.log("⚠️ No valid JSON body or empty body, using empty object");
    }

    const path = request.nextUrl.searchParams.get("path") || "";

    console.log("🔄 Proxy forwarding to:", `${BACKEND_URL}${path}`);
    console.log("📦 Request body:", body);

    // Forward all relevant headers from the original request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔑 Forwarding Authorization header");
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("📡 Backend response status:", response.status);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      return NextResponse.json(
        { message: "Backend returned non-JSON response", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("✅ Backend response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Proxy error:", error);
    return NextResponse.json(
      {
        message: error.message || "Proxy request failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "";

    console.log("🔄 Proxy GET forwarding to:", `${BACKEND_URL}${path}`);

    // Forward all relevant headers from the original request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔑 Forwarding Authorization header");
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "GET",
      headers,
    });

    console.log("📡 Backend GET response status:", response.status);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      return NextResponse.json(
        { message: "Backend returned non-JSON response", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("✅ Backend GET response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Proxy GET error:", error);
    return NextResponse.json(
      {
        message: error.message || "Proxy request failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "";

    console.log("🔄 Proxy PATCH forwarding to:", `${BACKEND_URL}${path}`);

    // Forward all relevant headers from the original request
    const headers: Record<string, string> = {};

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔑 Forwarding Authorization header");
    }

    // Check if it's a multipart/form-data request
    const contentType = request.headers.get("content-type");
    let body;

    if (contentType?.includes("multipart/form-data")) {
      // For multipart, pass the formData directly
      body = await request.formData();
      console.log("📦 Request type: multipart/form-data");
    } else {
      // For JSON, parse and stringify
      headers["Content-Type"] = "application/json";
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      console.log("📦 Request body:", jsonBody);
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "PATCH",
      headers,
      body,
    });

    console.log("📡 Backend PATCH response status:", response.status);

    // Check if response is JSON
    const responseContentType = response.headers.get("content-type");
    if (
      !responseContentType ||
      !responseContentType.includes("application/json")
    ) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      return NextResponse.json(
        { message: "Backend returned non-JSON response", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("✅ Backend PATCH response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Proxy PATCH error:", error);
    return NextResponse.json(
      {
        message: error.message || "Proxy request failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "";

    console.log("🔄 Proxy DELETE forwarding to:", `${BACKEND_URL}${path}`);

    // Forward all relevant headers from the original request
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔑 Forwarding Authorization header");
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "DELETE",
      headers,
    });

    console.log("📡 Backend DELETE response status:", response.status);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      return NextResponse.json(
        { message: "Backend returned non-JSON response", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("✅ Backend DELETE response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Proxy DELETE error:", error);
    return NextResponse.json(
      {
        message: error.message || "Proxy request failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path") || "";

    console.log("🔄 Proxy PUT forwarding to:", `${BACKEND_URL}${path}`);

    // Forward all relevant headers from the original request
    const headers: Record<string, string> = {};

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
      console.log("🔑 Forwarding Authorization header");
    }

    // Check if it's a multipart/form-data request
    const contentType = request.headers.get("content-type");
    let body;

    if (contentType?.includes("multipart/form-data")) {
      // For multipart, pass the formData directly
      body = await request.formData();
      console.log("📦 Request type: multipart/form-data");
    } else {
      // For JSON, parse and stringify
      headers["Content-Type"] = "application/json";
      const jsonBody = await request.json();
      body = JSON.stringify(jsonBody);
      console.log("📦 Request body:", jsonBody);
    }

    const response = await fetch(`${BACKEND_URL}${path}`, {
      method: "PUT",
      headers,
      body,
    });

    console.log("📡 Backend PUT response status:", response.status);

    // Check if response is JSON
    const responseContentType = response.headers.get("content-type");
    if (
      !responseContentType ||
      !responseContentType.includes("application/json")
    ) {
      const text = await response.text();
      console.error("❌ Non-JSON response:", text);
      return NextResponse.json(
        { message: "Backend returned non-JSON response", details: text },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log("✅ Backend PUT response data:", data);

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("❌ Proxy PUT error:", error);
    return NextResponse.json(
      {
        message: error.message || "Proxy request failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
