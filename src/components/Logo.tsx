import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Ploynora Games beranda">
      <b>P</b>
      <span>
        ploynora<em>.</em>
      </span>
    </Link>
  );
}
