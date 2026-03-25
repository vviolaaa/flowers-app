export const flowers = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Flower ${i + 1}`,
  image: `/flowersPngs/flower${i + 1}.png`
}));

export const bows = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  image:`/bowsPngs/bow${i + 1}.png`
}));