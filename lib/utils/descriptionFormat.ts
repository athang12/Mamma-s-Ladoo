export function parseIngredientList(description: string | null | undefined): string[] {
  if (!description) return []

  const items = description
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)

  const hasSentencePunctuation = /[.!?]/.test(description)
  const isLikelyIngredientList = items.length >= 3 && !hasSentencePunctuation

  return isLikelyIngredientList ? items : []
}
