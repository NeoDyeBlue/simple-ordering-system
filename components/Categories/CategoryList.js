import CategoryItem from "./CategoryItem";
import styles from "./Categories.module.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import { ClientContext } from "../../contexts/Client.context";
import { useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function CategoryList() {
  const { phoneCategories } = useContext(ClientContext);
  const listRef = useRef();
  const elSelect = gsap.utils.selector(listRef);
  const timeline = useRef();

  const categoryItems = phoneCategories.map((brand) => (
    <CategoryItem key={brand._id} name={brand.name} image={brand.image.url} />
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
  }, [phoneCategories]);

  // function handleScroll(event) {
  //   event.preventDefault();
  //   listRef.current.scrollLeft += event.deltaY;
  // }

  return (
    <div ref={listRef} className={styles["c-category-list-wrapper"]}>
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
