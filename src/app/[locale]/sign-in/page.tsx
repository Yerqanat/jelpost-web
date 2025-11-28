import { SignInForm } from "@/src/components/auth/SignInForm";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Jelpost
          </h1>
          <p className="text-muted-foreground text-lg">
            {/* We can add a subtitle here if needed, or use translation */}
            Fast and secure delivery
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
