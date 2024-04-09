
import { ICreateProduct, IProductAuth, IChangeProduct, IDeleteProduct, IReorderProduct } from 'src/utils/interface/ProductInterface';
import { CreateProductDto } from 'src/logic/Dto/catalog/create-product.dto';
import { ConsoleLogger, Injectable, Req } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GuitarProduct } from '@prisma/client';
import { ICreateCategory } from 'src/utils/interface/categoryInterface';


interface IQueryParams {
    take?: number;
    skip?: number;
    authorId: number;
    minPrice?: number;
    maxPrice?: number;
    categoryId?: number
    order?: number;
    newOrder?: number;
    type?: string[];
    string?: string[];
}

@Injectable()
export class CatalogDataService {
    constructor(private prisma: PrismaService) { } 

    async createProduct(
        product: ICreateProduct,
        authorId: number, 
        orderId: number
    ): Promise<any> {
        try {
            const newProduct = await this.prisma.product.create({
                data: {
                    authorId: authorId, 
                    name: product.name,
                    photo: product.photo,
                    price: product.price,
                    description: product.description,
                    visibility: product.visibility,
                    inStock: product.inStock,
                    categoryId: product.categoryId,
                    order: orderId+1

                },
            });

            return newProduct;
        } catch (error) {
            throw error; 
        }
    }

    async getProducts(where: IQueryParams) {
        try {
            const products = await this.prisma.product.findMany({
                // skip: +where.skip,
                // take: +where.take,
                where: {
                    // price: {
                    //     gte: where.minPrice, 
                    //     lte: where.maxPrice, 
                    // },
                    categoryId: where.categoryId,

                    order: {
                        gte: where.order
                    },
                    
                   
                    authorId: where.authorId,
                },
            });

            return products;
        } catch (error) {
            throw error;
        }
    }

    async changeProduct(product: IChangeProduct){
        try{
            const changedProduct = await this.prisma.product.update({
                where: {
                    id: product.id
                },
                data: {
                    name: product.name,
                    photo: product.photo,
                    price: product.price,
                    description: product.description,
                    visibility: product.visibility,
                    inStock: product.inStock,
                    categoryId: product.categoryId,
                    order: product.order

                }
            })
            console.log(changedProduct)
        } catch (error) {
            throw error;
        }
    }

    async reorderProduct(reorderProductDto: IReorderProduct): Promise<void> {
        try {
            const [productWithOrderA, productWithOrderB] = await Promise.all([
                this.prisma.product.findFirst({
                    where: {
                        authorId: reorderProductDto.authorId,
                        order: reorderProductDto.order
                    }
                }),
                this.prisma.product.findFirst({
                    where: {
                        authorId: reorderProductDto.authorId,
                        order: reorderProductDto.newOrder
                    }
                })
            ]);

            // Update the orders
            await Promise.all([
                this.prisma.product.update({
                    where: { id: productWithOrderA.id },
                    data: { order: reorderProductDto.newOrder }
                }),
                this.prisma.product.update({
                    where: { id: productWithOrderB.id },
                    data: { order: reorderProductDto.order }
                })
            ]);
        } catch (error) {
            throw error;
        }
    }



    async lowerOrderByOne(products: IChangeProduct[]): Promise<void> {
        try {
            await Promise.all(products.map(async (product) => {
                await this.prisma.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        order: {
                            decrement: 1 // Decrement the order by one
                        }
                    }
                });
            }));
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(product: IDeleteProduct){
        try {
            const deleteProduct = await this.prisma.product.delete({
                where: {
                    id: product.id
                }
            })
        } catch (error){
            throw error
        }
    }


    async createCategory(category: ICreateCategory){
        try {
            const createCategory = await this.prisma.category.create({
                data: {
                    name: category.name
                }
            })
        }catch (error){
            throw error;
        }
    }

    async findCategory(category: string){
        try {
            const categoryName = this.prisma.category.findFirst({
                where: {
                    name: category
                }
            })
            return categoryName || null
        } catch (error) {
            console.error("Error finding category: ", error)
            throw new Error(error);
        }
    }

    async getCategories(){
        try{
            const categories = this.prisma.category.findMany()
            return categories
        }catch (error){
            throw new Error(error)
        }
    }

    async findMaxOrder(categoryId: number, authorId: number): Promise<number | null> {
    try {
        const maxOrder = await this.prisma.product.aggregate({
            where: {
                categoryId: categoryId,
                authorId: authorId
            },
            _max: {
                order: true
            }
        });
        return maxOrder._max.order || 0;
    } catch (error) {
        console.error('Error finding max order:', error);
        throw error;
    }
}

}

