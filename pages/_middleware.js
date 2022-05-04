import { NextResponse } from "next/server";
// import { await jwt.verify } from "jsonwebtoken";
// import { jwt.verify } from "@tsndr/cloudflare-worker-jwt";
const jwt = require("@tsndr/cloudflare-worker-jwt");

export default async function middleware(req) {
  const { cookies } = req;
  const token = cookies.sessionToken;
  const url = req.page.name;
  const { pathname, origin } = req.nextUrl;
  // console.log(url);

  // if (url.split("/")[1] !== "api") {
  // }

  if (url == "/login" || url == "/signup") {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          return NextResponse.redirect(`${origin}`);
        }
      }
    }
  } else if (url == "/account" || url == "/orders") {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        } else {
          return NextResponse.next();
        }
      }
    } else {
      return NextResponse.redirect(`${origin}/login`);
    }
  } else if (
    url == "/search" ||
    url == "/[brand]" ||
    url == "/[brand]/[model]" ||
    url == "/"
  ) {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "admin") {
          return NextResponse.redirect(`${origin}/admin`);
        }
      }
    } else {
      return NextResponse.next();
    }
  } else if (url.split("/")[1] == "admin") {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "client") {
          return NextResponse.redirect(`${origin}`);
        } else {
          return NextResponse.next();
        }
      }
    } else {
      return NextResponse.redirect(`${origin}/login`);
    }
  } else if (url == "/api/orders") {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "client") {
          return NextResponse.next();
        }
      }
    } else {
      return new Response(
        JSON.stringify({ authenticated: false, message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  } else if (
    url == "/api/admin/orders" ||
    url == "/api/admin/brands" ||
    url == "/api/admin/brands" ||
    url == "/api/admin/[orders]" ||
    url == "/api/admin/models" ||
    url == "/api/admin/dashboard" ||
    url == "/api/admin/users"
  ) {
    if (token) {
      if (await jwt.verify(token, process.env.JWT_SECRET)) {
        const { role } = jwt.decode(token);
        if (role == "admin") {
          return NextResponse.next();
        }
      }
    } else {
      return new Response(
        JSON.stringify({ authenticated: false, message: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return NextResponse.next();
}
