import { RefObject } from "react";

export const useDropdownPosition = (
    ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
    const getDropdownPosition = () => {
        if(!ref.current) return { top: 0, left: 0 };

        const rect = ref.current.getBoundingClientRect();
        const dropdownWidth = 240; // Width of the dropdown

        // Calculate the initial position
        let left = rect.left + window.scrollX;
        const top = rect.bottom + window.scrollY;

        // Check if the dropdown goes off the right side of the screen
        if (left + dropdownWidth > window.innerWidth) {
            // Align to the right side of the button instead
            left = rect.right + window.scrollX - dropdownWidth;

            // If still off screen, align to the right egde of viewport with the some padding
            if (left < 0) {
                left = window.innerWidth - dropdownWidth - 16; // 16px padding
            }
        }

        // Ensure the dropdown doesn't go off the left edge
        if (left < 0) {
            left = 16; // 16px padding
        }

        return { top, left };
    };

    return { getDropdownPosition };
};