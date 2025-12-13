export interface NavItem {
  title: string;
  link?: string;
  dropdown?: {
    title: string;
    link: string;
  }[];
}

export const headerLinks: NavItem[] = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Shop",
    dropdown: [
      {
        title: "All Products",
        link: "/shop",
      },
      {
        title: "Lashes",
        link: "/shop/lashes",
      },
      {
        title: "Spa",
        link: "/shop/spa",
      },
      {
        title: "Tattoo",
        link: "/shop/tattoo",
      },
      {
        title: "Brows",
        link: "/shop/brows",
      },
      // {
      //   title: "Nails",
      //   link: "/shop?category=nails",
      // },
      // {
      //   title: "Tools",
      //   link: "/shop?category=tools",
      // },
      {
        title: "New Arrivals",
        link: "/new-arrivals",
      },
    ],
  },
  {
    title: "Booking",
    link: "/book-session",
  },
  {
    title: "Training",
    link: "/book-session?type=training",
  },
  {
    title: "New Arrivals",
    link: "/new-arrivals",
  },
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Contact Us",
    link: "/contact",
  },
];
