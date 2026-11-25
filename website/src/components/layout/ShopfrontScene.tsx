import { ResponsivePicture } from '@/components/ui/ResponsivePicture';
import styles from './SiteFooter.module.css';

export function ShopfrontScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <ResponsivePicture
        name="footer-shopfront"
        widths={[642, 1284, 2172]}
        sizes="100vw"
        width={2172}
        height={724}
        alt=""
        className={styles.sceneImage}
      />
    </div>
  );
}
