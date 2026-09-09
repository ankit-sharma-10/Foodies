import Link from "next/link";
import Image from "next/image";
import classes from "./main-header.module.css";
import MainHeaderBackground from './main-header-background';
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image
            src="/images/logo.png"
            alt="A plate with food in it"
            width={80}
            height={80}
            priority={true}
          />
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
