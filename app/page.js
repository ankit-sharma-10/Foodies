import Link from 'next/link';

import classes from './page.module.css';
import ImageSlideshow from '@/components/image-slideshow/image-slideshow';
export default function Home() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>NextLevel Food for NextLevel Foodies</h1>
            <p>Taste & share food from all over the world.</p>
          </div>
          <div className={classes.cta}>
            <Link href="/community">Join the Community</Link>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </div>
      </header>
      <main>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            NextLevel Food is a community platform where passionate food lovers
            share their favorite home-cooked recipes, culinary tips, and cooking stories
            with the world.
          </p>
          <p>
            Browse diverse meals, follow clear step-by-step instructions, and share your own
            kitchen creations complete with appetizing photos.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            Authentic cooking thrives on real experiences. Unlike commercial cooking sites,
            every dish here is shared by home chefs who crafted it with love in their own kitchens.
          </p>
          <p>
            Connect with like-minded food lovers, discover mouth-watering recipes from all over
            the globe, and inspire others on your culinary journey.
          </p>
        </section>
      </main>
    </>
  );
}