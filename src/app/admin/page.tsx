import { notFound } from "next/navigation";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage(): never {
  notFound();
}
