import React from "react";

const pickFirstChildOfType = (children: React.ReactNode, type: React.ElementType) => {
    const childrenArray = React.Children.toArray(children);
    for (const child of childrenArray) {
        if (React.isValidElement(child) && child.type === type) {
            return child;
        }
    }
    return null;
};

export default pickFirstChildOfType;