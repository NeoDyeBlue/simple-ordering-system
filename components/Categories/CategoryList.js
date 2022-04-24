import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const categories = [
  "Samsung",
  "iPhone",
  "Xiaomi",
  "Oppo",
  "Vivo",
  "Motorola",
  "Lenovo",
  "LG",
  "Nokia",
];

export default function CategoryList() {
  const listRef = useRef();
  const elSelect = gsap.utils.selector(listRef);
  const timeline = useRef();

  const categoryItems = categories.map((category, index) => (
    <CategoryItem
      key={index}
      name={category}
      image={`/sample_images/${category.toLowerCase()}.png`}
    />
  ));

  useEffect(() => {
    const listEl = listRef.current;
    timeline.current = gsap
      .timeline({
        scrollTrigger: {
          trigger: listEl,
          start: "top 60px",
          // markers: true, //for testing the trigger
          // endTrigger: ".js-footer",
          // end: "+=1000 bottom",
          // scroller: "#__next",
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
  }, []);

  function handleScroll(event) {
    event.preventDefault();
    listRef.current.scrollLeft += event.deltaY;
  }

  return (
    <div
      ref={listRef}
      className={styles["c-category-list-wrapper"]}
      onWheel={handleScroll}
    >
      <ul className={styles["c-category-list"]}>
        <li
          className={`${styles["c-category"]} ${styles["c-category--active"]}`}
        >
          <div className="c-category__image-icon-wrap">
            <HomeOutlinedIcon className={styles["c-category__icon"]} />
          </div>
          <p className={styles["c-category__name"]}>Home</p>
        </li>
        {categoryItems}
      </ul>
    </div>
  );
}
