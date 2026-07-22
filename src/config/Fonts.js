import { Platform } from 'react-native';

const fonts = {
  regular: Platform.OS === 'ios' ? 'Tenor Sans' : 'tenorSans-Regular',
  bold: Platform.OS === 'ios' ? 'Nexa-Bold' : 'nexa-Bold',
  light: Platform.OS === 'ios' ? 'Nexa-Light' : 'nexa-Light',
  serif: Platform.OS === 'ios' ? 'Javanese Text' : 'javaneseText-Regular',
  javanese: Platform.OS === 'ios' ? 'Javanese Text' : 'javaneseText-Regular',
};

export default fonts;
