import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomeCategory } from "../types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: CustomeCategory[];
}

export const CategoriesSidebar = ({
    open,
    onOpenChange,
    data
}: Props) => {
    const router = useRouter();

    const [parentCategories, setParentCategories] = useState<CustomeCategory[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<CustomeCategory | null>(null);

    const currentCategory = parentCategories ?? data ?? [];

    const handleOpenChange = (open: boolean) => {
        setSelectedCategory(null);
        setParentCategories(null);
        onOpenChange(open);
    };

    const handleCategoryClick = (category: CustomeCategory) => {
        if (category.subcategories && category.subcategories.length > 0) {
            setParentCategories(category.subcategories as CustomeCategory[]);
            setSelectedCategory(category);
        } else {
            if(parentCategories && selectedCategory) {
                // Navigate to the selected category page
                router.push(`/${selectedCategory.slug}/${category.slug}`);
            } else {
                if(category.slug === "all") {
                    router.push("/");
                } else {
                    router.push(`/${category.slug}`);
                }
            }

            handleOpenChange(false);
        }
    };

    const handleBackClick = () => {
        if (parentCategories) {
            setParentCategories(null);
            setSelectedCategory(null);
        }
    };

    const backgroundColor = selectedCategory?.color || "white";

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                side="left"
                className="p-0 transition-none"
                style={{ backgroundColor }}
            >
                <SheetHeader className="p-4 border-b">
                    <SheetTitle>
                        Categories
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                    {parentCategories && (
                        <button
                            className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                            onClick={handleBackClick}
                        >
                            <ChevronLeftIcon className="size-4 mr-2"/>
                            Back
                        </button>
                    )}

                    {currentCategory.map((category) => (
                        <button
                            key={category.slug}
                            className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <ChevronRightIcon className="size-4 mr-2" />
                            )}
                        </button>
                    ))}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};