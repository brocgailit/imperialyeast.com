export async function search(q, options = {}) {
  const createFilterString = fields =>
    fields.reduce(
      (acc, f, i) =>
        Object.assign(acc, { [`filter[$or][${i}][${f}][$regex]`]: q }),
      {}
    )

  // search strains
  const strainFilters = createFilterString([
    'name',
    'shortDescription',
    'fullDescription',
    'compareTo',
    'profiles'
  ])

  const strains = await this.$axios.$get('/collections/get/strains', {
    params: Object.assign(
      {},
      options,
      {
        simple: true,
        'filter[public]': true,
        rspc: 1
      },
      strainFilters
    )
  })

  // search locations
  const locationFilters = createFilterString([
    'name',
    'address.addressLocality',
    'address.addressRegion',
    'address.postalCode',
    'phone'
  ])
  const locations = await this.$axios.$get('/collections/get/organizations', {
    params: Object.assign(
      {},
      options,
      {
        simple: true,
        'filter[map]': true,
        rspc: 1
      },
      locationFilters
    )
  })

  // search pages
  const pageFilters = createFilterString(['name', 'description', 'keywords'])
  const pages = await this.$axios.$get('/collections/get/pages', {
    params: Object.assign(
      {},
      options,
      {
        simple: true,
        rspc: 1
      },
      pageFilters
    )
  })

  return { strains, pages, locations }
}
