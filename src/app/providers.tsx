"use client"

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { sendError } from "@/shared/errors/send-error"

const createQueryClient = (): QueryClient => {
  return new QueryClient({
    queryCache: new QueryCache({ onError: (error: Error) => sendError({ error }) }),
    defaultOptions: { queries: { staleTime: 60_000 } },
  })
}

export const Providers = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const [queryClient] = useState<QueryClient>(createQueryClient)
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
