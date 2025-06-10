"use client";

import { CategoryDropdown } from "./category-dropdown";
import { CustomeCategory } from "../types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./category-sidebar";

interface Props {
    data: CustomeCategory[];
};

export const Categories = ({ data }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const [visibleCount, setVisibleCount] = useState(data.length);
    const [isAnyHovered, setIsAnyHovered] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const activeCategory = "all";

    const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory);
    const isActiveCatagoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

    useEffect(() => {
        const calculateVisble = () => {
            if(!containerRef.current || !measureRef.current || !viewAllRef.current) {
                return;
            };

            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const availableWidth = containerWidth - viewAllWidth;

            const items = Array.from(containerRef.current.children);
            let totalWidth = 0;
            let visible = 0;

            for (const item of items) {
                const itemWidth = item.getBoundingClientRect().width;
                if (totalWidth + itemWidth > availableWidth) {
                    break;
                } else {
                    totalWidth += itemWidth;
                    visible++;
                }
            }

            setVisibleCount(visible);
        };

        calculateVisble();

        console.log("Visible count: ",visibleCount);
        console.log("Data length: ", data.length);

        const resizeObserver = new ResizeObserver(calculateVisble);
        resizeObserver.observe(containerRef.current!);

        return () => resizeObserver.disconnect();
    }, [data.length]);

    return (
        <div className="relative w-full">
            {/* Categories sidebar */}
            <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} data={data}/>

            {/* hidden div to measure all items */}
            <div 
                className="absolute opacity-0 pointer-events-none flex" 
                style={{ position: "fixed", top: -9999, left: -9999 }}
                ref={measureRef}
            >
                {data.map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown 
                            category={category} 
                            isActive={activeCategory === category.slug}
                            isPagenationHovered={false}
                        />
                    </div>
                ))}
            </div>

            {/* visible items */}
            <div 
                className="flex flex-nowrap items-center"
                ref={containerRef}
                onMouseEnter={() => setIsAnyHovered(true)}
                onMouseLeave={() => setIsAnyHovered(false)}
            >
                {data.slice(0, visibleCount).map((category) => (
                    <div key={category.id}>
                        <CategoryDropdown 
                            category={category} 
                            isActive={activeCategory === category.slug}
                            isPagenationHovered={false}
                        />
                    </div>
                ))}

                <div
                    ref={viewAllRef}
                    className="shrink-0"
                >
                    <Button
                        className={cn(
                            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
                            isActiveCatagoryHidden && !isAnyHovered && "bg-white border-primary"
                        )}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        View All
                        <ListFilterIcon className="ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}