"use client";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.removeItem("aqs_cookie_consent");
        window.location.reload();
      }}
      className="hover:text-white/30 transition-colors cursor-pointer"
    >
      Cookie Settings
    </button>
  );
}
