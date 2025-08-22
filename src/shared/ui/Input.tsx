// src/shared/ui/Input.tsx

import React from "react";

type InputProps = React.ComponentPropsWithoutRef<"input">;

export function Input(props: InputProps) {
    return <input {...props} />;
}