import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Features",
    path: "/#features",
    newTab: false,
  },
  {
    id: 2,
    title: "Pricing",
    path: "/#pricing",
    newTab: false,
  },
  {
    id: 3,
    title: "SellerCenter",
    path: "/client/profile",
    newTab: false,
    requireAuth: true,
  },
  {
    id: 4,
    title: "UserGuide",
    path: "/docs",
    newTab: false,
  },
];

export default menuData;
