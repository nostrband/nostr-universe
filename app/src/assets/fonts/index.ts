import pathExtraLight from './Outfit/Outfit-ExtraLight.ttf'
import pathLight from './Outfit/Outfit-Light.ttf'
import pathRegular from './Outfit/Outfit-Regular.ttf'
import pathMedium from './Outfit/Outfit-Medium.ttf'
import pathSemiBold from './Outfit/Outfit-SemiBold.ttf'
import pathBold from './Outfit/Outfit-Bold.ttf'

const createFont = (name: string, style: string, weight: number, url: string) => {
  return {
    fontFamily: name,
    fontStyle: style,
    fontDisplay: 'swap',
    fontWeight: weight,
    src: `
          local(${name}),
          url(${url}) format('woff2')
        `,
    unicodeRange:
      'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF'
  }
}

const OutfitExtraLight = createFont('Outfit', 'normal', 200, pathExtraLight)
const OutfitLight = createFont('Outfit', 'normal', 300, pathLight)
const OutfitRegular = createFont('Outfit', 'normal', 400, pathRegular)
const OutfitMedium = createFont('Outfit', 'normal', 500, pathMedium)
const OutfitSemiBold = createFont('Outfit', 'normal', 600, pathSemiBold)
const OutfitBold = createFont('Outfit', 'normal', 700, pathBold)

export { OutfitExtraLight, OutfitLight, OutfitRegular, OutfitMedium, OutfitSemiBold, OutfitBold }
