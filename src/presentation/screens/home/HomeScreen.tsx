import { getProductsByPage } from "../../../actions/products/get-products-by-page";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { MainLayout } from "../../layouts/MainLayout";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader";
import { ProductList } from "../../components/products/ProductList";

export const HomeScreen = () => {


  // const { isLoading, data: products = [] } = useQuery({
  //   queryKey: ['products', 'infinite'],
  //   staleTime: 1000 * 60 * 60, // 1 hora
  //   queryFn: () => getProductsByPage(0),
  // })

  const { isLoading, data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['products', 'infinite'],
    staleTime: 1000 * 60 * 60, // 1 hora
    initialPageParam: 0,

    queryFn: async(params) => {
      console.log(params);
      return await getProductsByPage(params.pageParam);
    },

    getNextPageParam: (lastPage, allPages) => allPages.length,
  })


  return (
    <MainLayout
      title="TesloShop - Products"
      subTitle="Aplicacion Administrativa"
    >
      {
        isLoading
        ? (<FullScreenLoader/>)
        : (<ProductList
            products={data?.pages.flat() ?? []}
            fetchNextPage={fetchNextPage}
            />
          )
      }

    </MainLayout>
  )
}
