import Link from "next/link";
import "@/app/styles/pages/not-found.css";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__heading">404</h1>
        <p className="not-found__message">
          Dang. That sucks. It's probably my fault.
        </p>
        <p>Yea, it's totally me, not you.</p>
        <p>Maybe just go home where it's safe.</p>
        <Link href="/" className="not-found__link">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
