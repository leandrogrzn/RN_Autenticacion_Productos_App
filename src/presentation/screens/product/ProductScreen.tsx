import { Button, ButtonGroup, Input, Layout, Text, useTheme } from "@ui-kitten/components"
import { MainLayout } from "../../layouts/MainLayout"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../../navigation/StackNavigator"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getProductById } from "../../../actions/products/get-product-by-id"
import { useRef } from "react"
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { FadeInImage } from "../../components/ui/FadeInImage"
import { Gender, Product, Size } from '../../../domain/entities/product';
import { MyIcon } from "../../components/ui/MyIcon"
import { Formik } from "formik"
import { updateCreateProduct } from "../../../actions/products/update-create-product"
import { Image } from "react-native"

const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];
const genders: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'>{}

export const ProductScreen = ({route}:Props) => {

  const theme = useTheme();

  const queryClient = useQueryClient();

  const productIdRef = useRef(route.params.productId)

  const { data: product } = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  })

  const mutation = useMutation({
    mutationFn: ( data: Product ) => updateCreateProduct({...data, id: productIdRef.current}),
    onSuccess(data: Product) {
      productIdRef.current = data.id;
      queryClient.invalidateQueries({ queryKey: ['products', 'infinite']});
      queryClient.invalidateQueries({ queryKey: ['product', data.id ]});
      console.log('succes')
      // console.log({data})
    },
  })

  
  if(!product) {
    return (<MainLayout title="Cargando..."/>)
  }

  return (
    <Formik
      initialValues={product}
      onSubmit={ (values) => mutation.mutate(values)}

    >

      {
        ({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
          <MainLayout
            title={values.title}
            subTitle={`Precio: ${values.price}`}
          >
            <ScrollView style={{ flex: 1 }}>
              {/* imagenes del producto */}
              <Layout style={{ marginVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                {
                  (values.images.length === 0)
                  ? <Image source={require('../../../assets/no-product-image.png')} style={{ width: 300, height: 300 }} />
                  : (
                    <FlatList
                      data={values.images}
                      keyExtractor={(item) => item}
                      horizontal
                      showsHorizontalScrollIndicator = {false}
                      renderItem={({item}) => (
                        <FadeInImage
                          uri={ item }
                          style={{ width: 300, height: 300, marginHorizontal: 7 }}
                        />
                      )}
                    />
                  )
                }
              </Layout>

              {/* formulario */}
              <Layout style={{ marginHorizontal: 10}}>
                <Input
                  label='Titulo'
                  style={{ marginVertical: 5 }}
                  value={ values.title }
                  onChangeText={ handleChange('title')}
                />

                <Input
                  label='Slug'
                  value={ values.slug }
                  onChangeText={ handleChange('slug')}
                  style={{ marginVertical: 5 }}
                />

                <Input
                  label='Descripcion'
                  value={ values.description }
                  onChangeText={ handleChange('description')}
                  multiline
                  numberOfLines={5}
                  style={{ marginVertical: 5 }}
                />

              </Layout>

              {/* precio e inventario */}
              <Layout style={{  marginVertical: 5, marginHorizontal: 15, flexDirection: 'row', gap: 10 }}>
                <Input
                    label='Precio'
                    value={ values.price.toString() }
                    onChangeText={ handleChange('price')}
                    style={{ flex: 1 }}
                    keyboardType="numeric"
                  />
                <Input
                    label='Inventario'
                    value={ values.stock.toString() }
                    onChangeText={ handleChange('stock')}
                    style={{ flex: 1 }}
                    keyboardType="numeric"
                  />
              </Layout>

              {/* selectores */}
              <ButtonGroup
                style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }}
                size="small"
                appearance="outline"
              >
                {
                  sizes.map((size) => (
                    <Button
                      onPress={ () => setFieldValue(
                        'sizes',
                        values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size]
                      )}
                      key={size}
                      style={{
                        flex: 1,
                        backgroundColor: values.sizes.includes(size) ? theme['color-primary-200'] : undefined
                      }} 
                    >{size}</Button>
                  ))
                }
                
              </ButtonGroup>


              {/* Genero */}
              <ButtonGroup
                style={{ margin: 2, marginTop: 20, marginHorizontal: 15 }}
                size="small"
                appearance="outline"
              >
                {
                  genders.map((gender) => (
                    <Button
                      onPress={() => setFieldValue('gender', gender)}
                      key={gender}
                      style={{
                        flex: 1,
                        backgroundColor: values.gender.startsWith(gender) ? theme['color-primary-200'] : undefined
                      }} 
                    >{gender}</Button>
                  ))
                }
                
              </ButtonGroup>


              {/* boton de guardar */}
              <Button
              accessoryLeft={ <MyIcon name="save-outline" white/>}
                onPress={() => handleSubmit()}
                disabled={mutation.isPending}
                style={{ margin: 15 }}
              >
                Guardar
              </Button>

              {/* <Text>{JSON.stringify(values, null, 2)}</Text> */}




              <Layout style={{ height: 250 }} />

            </ScrollView>
          </MainLayout>
        )
      }

    </Formik>
  )
}
