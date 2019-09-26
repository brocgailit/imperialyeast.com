export async function search(q, options = {}) {
  // search strains
  const strains = await this.$axios.$post('/collections/get/strains', {
    simple: 1,
    filter: {
      public: true,
      $or: [
        { name: { $regex: q } },
        { shortDescription: { $regex: q } },
        { fullDescription: { $regex: q } },
        { compareTo: q },
        { profiles: q }
      ]
    },
    populate: 2,
    rspc: 1
  })

  // search locations
  const locations = await this.$axios.$post('/collections/get/organizations', {
    simple: true,
    filter: {
      map: true,
      $or: [
        { name: { $regex: q } },
        { 'address.addressLocality': { $regex: q } },
        { 'address.addressRegion': { $regex: q } },
        { 'address.postalCode': { $regex: q } },
        { phone: { $regex: q } }
      ]
    },
    rspc: 1
  })

  // search pages
  const pages = await this.$axios.$post('/collections/get/pages', {
    simple: true,
    rspc: 1,
    filter: {
      $or: [
        { name: { $regex: q } },
        { description: { $regex: q } },
        { keywords: q }
      ]
    }
  })

  return { strains, pages, locations }
}
