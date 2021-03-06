import styles from "../styles/Menu.module.css";

function Menu() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>MENU</h1>
      <div className={styles.menuBody}>
        <ul className={styles.menuTitles}>
          <h3 className={styles.title}>Food Sections</h3>
          <li className={styles.item}>Pizza </li>
          <li className={styles.item}>Calzone </li>
          <li className={styles.item}>Pasta </li>
          <li className={styles.item}>Wings </li>
          <li className={styles.item}>Fries </li>
          <li className={styles.item}>Drink </li>
        </ul>

        <ul className={styles.menuPrices}>
          <h3 className={styles.title}>Drink Sections</h3>

          <li className={styles.item}>Coke</li>
          <li className={styles.item}>Pepsi </li>
          <li className={styles.item}>Diet Coke</li>
          <li className={styles.item}>Dr Pepper </li>
          <li className={styles.item}>Mountain Dew </li>
          <li className={styles.item}>Sprite </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
