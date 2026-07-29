export type NavigationLink = {
  title: string;
  href: string;
  target?: string;
};

const links: NavigationLink[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/#about" },
  { title: "Skills", href: "/#skills" },
  { title: "Projects", href: "/#projects" },
  { title: "Blogs", href: "/blogs" },
  { title: "Contact", href: "/#contact" },
];

export { links };
