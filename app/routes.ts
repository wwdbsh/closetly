/**
 * Application Routes Configuration
 * 
 * This file defines all routes for the application using React Router's
 * file-based routing system. Routes are organized by feature and access level.
 * 
 * The structure uses layouts for shared UI elements and prefixes for route grouping.
 * This approach creates a hierarchical routing system that's both maintainable and scalable.
 */
import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("/robots.txt", "core/screens/robots.ts"),
  route("/sitemap.xml", "core/screens/sitemap.ts"),
  ...prefix("/debug", [
    // You should delete this in production.
    route("/sentry", "debug/sentry.tsx"),
    route("/analytics", "debug/analytics.tsx"),
  ]),
  // API Routes. Routes that export actions and loaders but no UI.
  ...prefix("/api", [
    ...prefix("/settings", [
      route("/theme", "features/settings/api/set-theme.tsx"),
      route("/locale", "features/settings/api/set-locale.tsx"),
    ]),
    ...prefix("/users", [
      index("features/users/api/delete-account.tsx"),
      route("/password", "features/users/api/change-password.tsx"),
      route("/email", "features/users/api/change-email.tsx"),
      route("/profile", "features/users/api/edit-profile.tsx"),
      route("/providers", "features/users/api/connect-provider.tsx"),
      route(
        "/providers/:provider",
        "features/users/api/disconnect-provider.tsx",
      ),
    ]),
    ...prefix("/cron", [route("/mailer", "features/cron/api/mailer.tsx")]),
    ...prefix("/blog", [route("/og", "features/blog/api/og.tsx")]),
  ]),

  layout("core/layouts/navigation.layout.tsx", [
    route("/auth/confirm", "features/auth/screens/confirm.tsx"),
    index("features/home/screens/home.tsx"),
    route("/error", "core/screens/error.tsx"),
    layout("core/layouts/public.layout.tsx", [
      // Routes that should only be visible to unauthenticated users.
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
      ...prefix("/auth", [
        route("/api/resend", "features/auth/api/resend.tsx"),
        route(
          "/forgot-password/reset",
          "features/auth/screens/forgot-password.tsx",
        ),
        route("/magic-link", "features/auth/screens/magic-link.tsx"),
        ...prefix("/otp", [
          route("/start", "features/auth/screens/otp/start.tsx"),
          route("/complete", "features/auth/screens/otp/complete.tsx"),
        ]),
        ...prefix("/social", [
          route("/start/:provider", "features/auth/screens/social/start.tsx"),
          route(
            "/complete/:provider",
            "features/auth/screens/social/complete.tsx",
          ),
        ]),
      ]),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-auth" }, [
      ...prefix("/auth", [
        route(
          "/forgot-password/create",
          "features/auth/screens/new-password.tsx",
        ),
        route("/email-verified", "features/auth/screens/email-verified.tsx"),
      ]),
      // Routes that should only be visible to authenticated users.
      route("/logout", "features/auth/screens/logout.tsx"),
    ]),
    route("/contact", "features/contact/screens/contact-us.tsx"),
    ...prefix("/payments", [
      route("/checkout", "features/payments/screens/checkout.tsx"),
      layout("core/layouts/private.layout.tsx", { id: "private-payments" }, [
        route("/success", "features/payments/screens/success.tsx"),
        route("/failure", "features/payments/screens/failure.tsx"),
      ]),
    ]),
  ]),

  layout("core/layouts/private.layout.tsx", { id: "private-dashboard" }, [
    layout("features/users/layouts/dashboard.layout.tsx", [
      ...prefix("/dashboard", [
        index("features/users/screens/dashboard.tsx"),
        route("/payments", "features/payments/screens/payments.tsx"),
      ]),
      route("/account/edit", "features/users/screens/account.tsx"),
    ]),
  ]),

  ...prefix("/legal", [route("/:slug", "features/legal/screens/policy.tsx")]),
  layout("features/blog/layouts/blog.layout.tsx", [
    ...prefix("/blog", [
      index("features/blog/screens/posts.tsx"),
      route("/:slug", "features/blog/screens/post.tsx"),
    ]),
  ]),

  // layout("core/layouts/private.layout.tsx", { id: "private-user" }, [
  //   // 일반 회원용 페이지
  //   ...prefix("/counselors", [
  //     index("features/counselors/screens/list.tsx"), // 상담사 목록
  //     route(":id", "features/counselors/screens/detail.tsx"), // 상담사 상세
  //   ]),
  //   ...prefix("/products", [
  //     index("features/products/screens/list.tsx"), // 상담 상품 목록
  //     route(":id", "features/products/screens/detail.tsx"), // 상담 상품 상세
  //   ]),
  //   route("/letters/new/:counselorId", "features/letters/screens/new.tsx"), // 상담서 작성
  //   ...prefix("/my", [
  //     route("letters", "features/letters/screens/my-list.tsx"), // 내 상담서 목록
  //     route("appointments", "features/appointments/screens/my-list.tsx"), // 내 예약 관리
  //     route("profile", "features/users/screens/my-profile.tsx"), // 마이페이지
  //     route("settings", "features/users/screens/settings.tsx"), // 계정 설정
  //     route("payments", "features/payments/screens/my-payments.tsx"), // 결제 내역
  //   ]),
  //   route("/book/:productId", "features/appointments/screens/book-by-product.tsx"), // 상담 예약하기 (상품 기준)
  //   route("/book/:counselorId", "features/appointments/screens/book-by-counselor.tsx"), // 상담 예약하기 (상담사 기준)
  // ]),

  // layout("core/layouts/private.layout.tsx", { id: "private-counselor" }, [
  //   // 상담사용 페이지
  //   ...prefix("/counselor", [
  //     route("profile", "features/counselor/screens/profile.tsx"), // 상담사 프로필 등록/수정
  //     route("products/new", "features/counselor/screens/products/new.tsx"), // 상담 상품 등록
  //     route("products", "features/counselor/screens/products/list.tsx"), // 상담 상품 관리
  //     route("products/:id/edit", "features/counselor/screens/products/edit.tsx"), // 상담 상품 수정
  //     route("letters", "features/counselor/screens/letters/list.tsx"), // 받은 상담서 목록
  //     route("letters/:id", "features/counselor/screens/letters/detail.tsx"), // 상담서 상세 및 답변
  //     route("appointments", "features/counselor/screens/appointments.tsx"), // 예약 관리
  //     route("schedule", "features/counselor/screens/schedule.tsx"), // 상담 일정 관리
  //     route("earnings", "features/counselor/screens/earnings.tsx"), // 수익 관리
  //     route("settings", "features/counselor/screens/settings.tsx"), // 상담사 설정
  //   ]),
  // ]),
] satisfies RouteConfig;
