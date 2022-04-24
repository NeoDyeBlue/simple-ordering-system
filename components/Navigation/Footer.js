import styles from "./Footer.module.scss";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  return (
    <footer className={`${styles["c-footer"]} js-footer`}>
      <Link href="/">
        <a className={styles["c-footer__logo"]}>Emphoneum</a>
      </Link>
      <ul className={styles["c-footer__socials"]}>
        <li role="button" className={styles["c-footer__socials-item"]}>
          <SocialIcon fgColor="white" url="https://facebook.com/" />
        </li>
        <li role="button" className={styles["c-footer__socials-item"]}>
          <SocialIcon fgColor="white" url="https://twitter.com/" />
        </li>
      </ul>
      <p className={styles["c-footer__copyright"]}>© Emphoneum 2022</p>
    </footer>
  );
}
