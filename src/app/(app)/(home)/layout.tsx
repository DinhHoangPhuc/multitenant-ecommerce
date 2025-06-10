import React from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { SearchFilters } from './search-filters';

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Category } from '@/payload-types';
import { CustomeCategory } from './types';

interface Props {
    children: React.ReactNode;
};

const layout = async({ children }: Props) => {
    const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formatedData: CustomeCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((subdoc) => ({
      ...(subdoc as Category),
      subcategories: undefined,
    })),
  }));

  console.log({
    data,
    formatedData,
  });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <SearchFilters data={formatedData}/>
            <div className="flex-1 bg-[#F4F4F0]">
                {children}
            </div>
            <Footer/>
        </div>
    );
}

export default layout;