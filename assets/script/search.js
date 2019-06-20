const DEFAULT_LIMIT = 20
export async function search(q, options) {
  const createFilterString = fields =>
    fields
      .map((f, i) => `filter[${f}][logical]=or&filter[${f}][contains]=${q}`)
      .join('&')

  const { limit } = options

  // search strains
  const strainFilters = createFilterString([
    'name',
    'short_description',
    'full_description',
    'compare_to',
    'profiles',
    'similar_strains.similar_strains_id.name'
  ])

  const { data: strains } = await this.$axios.$get(
    `/items/strains?fields=*.*,similar_strains.similar_strains_id.name&${strainFilters}&filter[status]=published&limit=${limit ||
      DEFAULT_LIMIT}`
  )

  // search locations
  const locationFilters = createFilterString([
    'name',
    'city',
    'state',
    'postal_code',
    'phone'
  ])
  const { data: locations } = await this.$axios.$get(
    `/items/purchase_locations?fields=*.*&${locationFilters}&filter[status]=published&limit=${limit ||
      DEFAULT_LIMIT}`
  )

  // search pages
  const pageFilters = createFilterString([
    'name',
    'layouts.heading',
    'layouts.subheading',
    'keywords'
  ])
  const { data: pages } = await this.$axios.$get(
    `/items/pages?fields=*.*,layouts.*&${pageFilters}&filter[status]=published&limit=${limit ||
      DEFAULT_LIMIT}`
  )

  console.log(this)

  return { strains, pages, locations }
}
