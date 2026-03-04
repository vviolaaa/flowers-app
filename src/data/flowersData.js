export const flowers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Flower ${i + 1}`,
  image: `/flowersPngs/flower${i + 1}.png`
}));