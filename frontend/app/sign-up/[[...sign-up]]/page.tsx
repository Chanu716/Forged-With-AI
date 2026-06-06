import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(252,92,125,0.08) 0%, transparent 70%), var(--bg-primary)",
      }}
    >
      <SignUp />
    </div>
  );
}
