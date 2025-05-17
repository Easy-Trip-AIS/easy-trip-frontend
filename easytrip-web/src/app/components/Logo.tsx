import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.png" alt="Логотип" width={40} height={10} />
    </Link>
  );
}

export default Logo;