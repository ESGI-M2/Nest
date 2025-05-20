import * as React from "react"

import { cn } from "@/lib/utils"

function FormErrorMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={
        cn(
          'text-xs text-red-500',
          className
        )
      }
      {...props}
    />
  )
}

export { FormErrorMessage }
