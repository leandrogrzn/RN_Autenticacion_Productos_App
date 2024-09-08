import { tesloApi } from "../../config/api/tesloApi"
import type{ TesloProduct } from "../../infrastructure/interfaces/teslo-products.response"
import { ProductMapper } from "../../infrastructure/mappers/product.mapper"

export const getProductsByPage = async(page: number, limit: number = 20) => {
  try {
    const {data} = await tesloApi.get<TesloProduct[]>(`/products?offset=${page * 10}&limit=${limit}`)
    const products = data.map( ProductMapper.tesloProductToEntity )
    return products;
  
  } catch (error) {
    console.log(error)
    throw new Error ('Error getting products')
  }
}