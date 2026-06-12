import MinimalLayout from '~/layouts/minimal'

export default function ServerError() {
  return (
    <>
      <h1>Something went wrong</h1>
    </>
  )
}

ServerError.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
