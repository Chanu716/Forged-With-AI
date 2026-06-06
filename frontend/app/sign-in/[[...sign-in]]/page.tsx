import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(124,92,252,0.1) 0%, transparent 70%), var(--bg-primary)",
      }}
    >
      <SignIn />
    </div>
  );
}
