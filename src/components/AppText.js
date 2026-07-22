import React, { memo } from 'react';
import { Text } from 'react-native';
import colors from '../config/Colors';
import fonts from '../config/Fonts';

const AppText = ({
  text = '',
  fontSize = 14,
  color,
  fontFamily = fonts.regular,
  otherStyles,
  style,
  onPress,
  numberOfLines,
  lSpacing = 0.3,
  textAlign,
  lineHeight,
  fontStyle,
  fontWeight,
  children,
  ...props
}) => {
  const isBold =
    fontWeight === 'bold' ||
    fontWeight === '700' ||
    fontWeight === '800' ||
    fontWeight === '600' ||
    fontWeight === '900';

  const resolvedFontFamily = isBold ? fonts.bold : fontFamily;
  const textColor = color || colors.black || '#000000';
  const customStyle = style || otherStyles;

  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize,
          color: textColor,
          fontFamily: resolvedFontFamily,
          letterSpacing: lSpacing,
          textAlign,
          lineHeight,
          fontStyle,
        },
        customStyle,
      ]}
      {...props}
    >
      {text || children}
    </Text>
  );
};

export default memo(AppText);
