import { CricketIcon } from "@/components/icons/CricketIcon";

export default function Footer() {
  return (
    <footer className="bg-muted/50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <CricketIcon className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for cricket fans. &copy; {new Date().getFullYear()} Cricket Edge. All rights reserved.
          </p>
        </div>
        <div className="text-center text-xs text-muted-foreground/60 md:text-right">
            <p>This is a demo application. All trades and balances use demo credits.</p>
            <p>Not a real financial product.</p>
        </div>
      </div>
    </footer>
  );
}
