import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { ClientContext } from "../../contexts/Client.context";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategoryList() {
  // const { phoneCategories } = useContext(ClientContext);
  const listRef = useRef();
  const elSelect = gsap.utils.selector(listRef);
  const timeline = useRef();
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });
  const { data, error } = useSWR("/api/brands");

  const router = useRouter();

  useEffect(() => {
    function handleResize() {
      setWindowDimensions((prev) => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const listEl = listRef.current;
    // ScrollTrigger.config({
    //   autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    // });
    timeline.current = gsap
      .timeline({
        scrollTrigger: {
          trigger: "#__next",
          start: "61px 61px",
          // markers: true, //for testing the trigger
          // endTrigger: listEl,
          end: `${60 + listEl.clientHeight}px 59px`,
          scroller: "#__next",
          // toggleActions: "play none none reverse",
          scrub: true,
        },
      })
      // .to(listRef.current, { position: "sticky" }, 0)
      .to(
        elSelect(".c-category__image-icon-wrap"),
        {
          scale: 0,
          opacity: 0,
          marginTop: "-48px",
        },
        0
      );

    return () => {
      timeline.current.kill();
    };
  }, [data?.brands]);

  const categoryItems = data?.brands.map((brand) => (
    <CategoryItem key={brand._id} name={brand.name} image={brand.image.url} />
  ));

  return (
    <div ref={listRef} className={styles["c-category-list-wrapper"]}>
      <ul className={styles["c-category-list"]}>
        {categoryItems && (
          <li
            className={`${styles["c-category"]} ${styles["c-category--active"]}`}
          >
            <Link href="/">
              <a
                className={`${styles["c-category__link"]} ${
                  router.pathname == "/"
                    ? styles["c-category__link--active"]
                    : ""
                }`}
              >
                <div className="c-category__image-icon-wrap">
                  <HomeOutlinedIcon className={styles["c-category__icon"]} />
                </div>
                <p className={styles["c-category__name"]}>Home</p>
              </a>
            </Link>
          </li>
        )}
        {categoryItems ||
          [...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              width={82}
              height={82}
              baseColor="#343a40"
              highlightColor="#495057"
              className={styles["skeleton-category"]}
            />
          ))}
      </ul>
    </div>
  );
}
