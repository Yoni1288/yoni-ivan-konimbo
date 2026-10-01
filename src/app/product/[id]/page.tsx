const ProductPage = async ({ params }: { params: Promise<{ id: string }> }): Promise<React.JSX.Element> => {
  const { id } = await params

  return (
    <main>
      <h1>Product {id}</h1>
    </main>
  )
}

export default ProductPage
