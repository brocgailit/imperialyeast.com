import axios from 'axios'
const DEFAULT_LIMIT = 20
export const search = async (q, options) => {
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
    'profiles'
  ])

  const { data: strains } = await axios
    .get(
      `/items/strains?fields=*.*&${strainFilters}&filter[status]=published&limit=${limit ||
        DEFAULT_LIMIT}`
    )
    .then(res => res.data)

  // search locations
  const locationFilters = createFilterString([
    'name',
    'city',
    'state',
    'postal_code',
    'phone'
  ])
  const { data: locations } = await axios
    .get(
      `/items/purchase_locations?fields=*.*&${locationFilters}&filter[status]=published&limit=${limit ||
        DEFAULT_LIMIT}`
    )
    .then(res => res.data)

  // search pages
  const pageFilters = createFilterString([
    'name',
    'layouts.heading',
    'layouts.subheading',
    'keywords'
  ])
  const { data: pages } = await axios
    .get(
      `/items/pages?fields=*.*,layouts.*&${pageFilters}&filter[status]=published&limit=${limit ||
        DEFAULT_LIMIT}`
    )
    .then(res => res.data)

  return { strains, pages, locations }
}
