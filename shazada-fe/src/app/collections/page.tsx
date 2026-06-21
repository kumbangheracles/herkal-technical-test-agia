import CollectionIndex from "@/components/Collections";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shazada - My Collection | Welcome, Selamat Datang",
  description: "Collection list Product carted",
};

const CollectionPage = () => {
  return <CollectionIndex />;
};

export default CollectionPage;
