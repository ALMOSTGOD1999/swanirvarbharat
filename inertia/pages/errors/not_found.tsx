import MinimalLayout from '~/layouts/minimal'

export default function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
    </>
  )
}

NotFound.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
