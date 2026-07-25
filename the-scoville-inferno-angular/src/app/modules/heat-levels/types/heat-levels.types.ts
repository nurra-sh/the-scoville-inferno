export interface HeatLevel {
    id: number
    name: string
    slug: string
    minScoville: number
    maxScoville: number | null
    sortOrder: number
    createdAt: string
    updatedAt: string | null
}

export interface GetHeatLevelsResponse {
    data: HeatLevel[]
}