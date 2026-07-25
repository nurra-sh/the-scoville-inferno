export interface Brand {
    id: number
    name: string
    slug: string
    createdAt: string
    updatedAt: string | null
}

export interface GetBrandsResponse {
    data: Brand[]
}