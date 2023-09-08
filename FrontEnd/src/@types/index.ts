export type Data = {
  id: number,
  title: string
  imageUrl: string
  categoryId: number,
  userId: number,
  category: {
    id: number,
    name: string
  }
}