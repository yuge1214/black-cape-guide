import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-metal-dark/50 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <span className="text-xl font-bold metal-text">黑蓑影卫攻略组</span>
            <p className="text-sm text-zinc-500">
              专业明日方舟游戏攻略分享平台
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-400">
            <Link href="/" className="hover:text-accent transition-colors duration-300">
              首页
            </Link>
            <Link href="/articles" className="hover:text-accent transition-colors duration-300">
              攻略文章
            </Link>
            <Link href="/about" className="hover:text-accent transition-colors duration-300">
              关于我
            </Link>
          </div>

          <div className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} 黑蓑影卫攻略组
          </div>
        </div>
      </div>
    </footer>
  );
}