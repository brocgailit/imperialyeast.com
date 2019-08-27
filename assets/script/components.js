import Hero from '~/components/layouts/Hero.vue'
import Grid from '~/components/layouts/Grid.vue'
import Image from '~/components/layouts/Image.vue'
import Section from '~/components/layouts/Section.vue'
import SectionParallax from '~/components/layouts/SectionParallax.vue'
import Text from '~/components/layouts/Text.vue'
import Heading from '~/components/layouts/Heading.vue'
import Form from '~/components/layouts/Form.vue'
import Button from '~/components/layouts/Button.vue'
import Divider from '~/components/layouts/Divider.vue'
import Gallery from '~/components/layouts/Gallery.vue'
import HTML from '~/components/layouts/HTML.vue'
import TrustIcons from '~/components/layouts/TrustIcons.vue'
import ContactOrganization from '~/components/layouts/ContactOrganization.vue'
import ContactPerson from '~/components/layouts/ContactPerson.vue'
import HowTo from '~/components/layouts/HowTo.vue'
import Downloads from '~/components/layouts/Downloads.vue'
import FAQList from '~/components/layouts/FAQList.vue'
import CalculatorGravityConversion from '~/components/layouts/CalculatorGravityConversion.vue'
import CalculatorPitch from '~/components/layouts/CalculatorPitch.vue'
import Testimonials from '~/components/layouts/Testimonials.vue'

const COMPONENTS = [
  { name: 'image', ref: Image },
  { name: 'grid', ref: Grid },
  { name: 'section', ref: Section },
  { name: 'parallaxSection', ref: SectionParallax },
  { name: 'text', ref: Text },
  { name: 'heading', ref: Heading },
  { name: 'form', ref: Form },
  { name: 'button', ref: Button },
  { name: 'divider', ref: Divider },
  { name: 'gallery', ref: Gallery },
  { name: 'html', ref: HTML },
  { name: 'hero', ref: Hero },
  { name: 'trustIcons', ref: TrustIcons },
  { name: 'organizationContact', ref: ContactOrganization },
  { name: 'personContact', ref: ContactPerson },
  { name: 'howto', ref: HowTo },
  { name: 'downloads', ref: Downloads },
  { name: 'faq', ref: FAQList },
  { name: 'gravityConversion', ref: CalculatorGravityConversion },
  { name: 'pitchCalculator', ref: CalculatorPitch },
  { name: 'testimonials', ref: Testimonials }
]

export { COMPONENTS }
