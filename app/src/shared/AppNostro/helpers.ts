import { APP_NAME_FONT_SIZE_VALUE, APP_NAME_GUTTER_VALUE, APP_NOSTRO_SIZE, APP_NOSTRO_SIZE_VALUE } from './const'
import { AppNostroSize } from './types'

export const getSizeAppNostro = (size: AppNostroSize = APP_NOSTRO_SIZE.LARGE) => {
  switch (size) {
    case APP_NOSTRO_SIZE.LARGE:
      return APP_NOSTRO_SIZE_VALUE[APP_NOSTRO_SIZE.LARGE]

    case APP_NOSTRO_SIZE.MEDIUM:
      return APP_NOSTRO_SIZE_VALUE[APP_NOSTRO_SIZE.MEDIUM]

    case APP_NOSTRO_SIZE.SMALL:
      return APP_NOSTRO_SIZE_VALUE[APP_NOSTRO_SIZE.SMALL]
  }
}

export const getFontSizeAppNostro = (size: AppNostroSize = APP_NOSTRO_SIZE.LARGE) => {
  switch (size) {
    case APP_NOSTRO_SIZE.LARGE:
      return APP_NAME_FONT_SIZE_VALUE[APP_NOSTRO_SIZE.LARGE]

    case APP_NOSTRO_SIZE.MEDIUM:
      return APP_NAME_FONT_SIZE_VALUE[APP_NOSTRO_SIZE.MEDIUM]

    case APP_NOSTRO_SIZE.SMALL:
      return APP_NAME_FONT_SIZE_VALUE[APP_NOSTRO_SIZE.SMALL]
  }
}

export const getGutterNameAppNostro = (size: AppNostroSize = APP_NOSTRO_SIZE.LARGE) => {
  switch (size) {
    case APP_NOSTRO_SIZE.LARGE:
      return APP_NAME_GUTTER_VALUE[APP_NOSTRO_SIZE.LARGE]

    case APP_NOSTRO_SIZE.MEDIUM:
      return APP_NAME_GUTTER_VALUE[APP_NOSTRO_SIZE.MEDIUM]

    case APP_NOSTRO_SIZE.SMALL:
      return APP_NAME_GUTTER_VALUE[APP_NOSTRO_SIZE.SMALL]
  }
}
