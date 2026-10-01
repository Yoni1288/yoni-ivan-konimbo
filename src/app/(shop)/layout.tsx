import { SiteFooter } from "@/shared/components/site-footer"
import { SiteHeader } from "@/shared/components/site-header"

const ShopLayout = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  )
}

export default ShopLayout
