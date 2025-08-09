// src/shared/ui/Button.tsx

import React from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

export function Button({ children, ...props }: ButtonProps) {
    return <button {...props}>{children}</button>;
}