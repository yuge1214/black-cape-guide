export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-24 w-24">
          <img
            src="/black-cape-guide/loading.gif"
            alt="加载中"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm tracking-widest text-zinc-500 animate-pulse-slow">
            INITIALIZING...
          </p>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-metal-mid">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}