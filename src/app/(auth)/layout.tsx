import Link from "next/link";
import { CricketIcon } from "@/components/icons/CricketIcon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <CricketIcon className="h-6 w-6" />
          <span className="font-bold font-headline">Cricket Edge</span>
        </Link>
      </div>
      {children}
    </div>
  )
}
