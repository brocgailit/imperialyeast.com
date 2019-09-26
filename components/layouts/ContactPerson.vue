<template>
  <div v-if="!person.display" class="container columns person-contact">
    <div class="column is-narrow">
      <figure class="image is-128x128">
        <no-ssr>
          <v-lazy-image
            class="is-rounded"
            :src="
              person.image.path
                | asset({ w: 256, h: 256, fit: 'facearea', facepad: 2 })
            "
            :alt="person.image.title"
          />
        </no-ssr>
      </figure>
    </div>
    <div class="column">
      <h3 class="title">
        {{ person.name }}
      </h3>
      <h4 class="subtitle">
        {{ person.jobTitle }}
      </h4>
      <div class="content">
        <div v-html="person.description" />
        <p v-if="person.url.indexOf($route.path) < 0">
          <br />
          <a
            :href="person.url"
            size="is-small"
            type="is-light"
            icon-right="arrow-right"
          >
            Learn more about {{ person.name }}
          </a>
        </p>
      </div>

      <ul class="contact-profiles">
        <li class="contact-profile">
          <a :href="'mailto:' + person.email" aria-label="Email">
            <fa-icon :icon="['fal', 'envelope']" size="2x" />
          </a>
        </li>
        <li
          v-for="profile of person.profiles"
          :key="profile.value.platform"
          class="contact-profile"
        >
          <a
            :href="profile.value.url"
            target="_blank"
            rel="noopener"
            :aria-label="profile.value.platform"
          >
            <fa-icon :icon="['fab', profile.value.platform]" size="2x" />
          </a>
        </li>
      </ul>

      <address class="contact-address">
        <strong>Mailing Address:</strong>
        {{ person.address.streetAddress }}
        {{ person.address.addressLocality }},
        {{ person.address.addressRegion }}
        {{ person.address.postalCode }}
      </address>
    </div>
  </div>
</template>

<script>
import { component } from '~/assets/script/mixins'
export default {
  name: 'ContactPersonLayout',
  mixins: [component],
  computed: {
    person() {
      return this.layout.settings.person
    }
  },
  watch: {
    person(value) {
      if (value.display) {
        // assume person is just a link and get them
        this.$axios
          .$get(`collections/get/people`, {
            params: {
              limit: 1,
              simple: true,
              'filter[_id]': value._id
            }
          })
          .then(([person]) => {
            this.layout.settings.person = person
          })
      }
    }
  },
  jsonld() {
    if (this.person.display) return {}
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: `${this.person.name}`,
      image: [
        this.$options.filters.asset(this.person.image.path, {
          w: 500,
          h: 500,
          fit: 'min'
        }),
        this.$options.filters.asset(this.person.image.path, {
          w: 1024,
          h: 768,
          fit: 'min'
        }),
        this.$options.filters.asset(this.person.image.path, {
          w: 1280,
          h: 720,
          fit: 'min'
        })
      ],
      jobTitle: this.person.jobTitle,
      worksFor: this.person.worksFor,
      birthDate: this.person.birthDate,
      description: this.person.description,
      telephone: this.person.telephone,
      email: this.person.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.person.address.streetAddress,
        addressLocality: this.person.address.addressLocality,
        addressRegion: this.person.address.addressRegion,
        postalCode: this.person.address.postalCode,
        addressCountry: this.person.address.addressCountry
      },
      url: this.person.url
    }

    if (this.person.colleagues) {
      schema.colleagues = this.person.colleagues.map(c => c.value)
    }

    if (this.person.profiles) {
      schema.sameAs = this.person.profiles.map(s => s.value.url)
    }

    return schema
  }
}
</script>

<style lang="scss">
.person-contact {
  .contact-profiles {
    display: inline-block;
    .contact-profile {
      display: inline;
      margin: $size-7;
      &:first-child {
        margin-left: 0;
      }
    }
  }

  .contact-address {
    display: block;
    margin-top: $size-5;
    font-style: normal;
    font-size: $size-7;
  }
}
</style>
