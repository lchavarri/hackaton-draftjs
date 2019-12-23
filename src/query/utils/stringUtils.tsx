import { FilterCriteriaType } from '../components/layout/layoutTypes';

export function sanitizeParameterValue(value: string | number, type: string) {
  switch (type) {
    case FilterCriteriaType.INTEGER:
      return String(value).replace(/(?!^-)[^0-9]/g, '');
    case FilterCriteriaType.FLOAT:
      let replacer = String(value).replace(
        /[-]?[0-9]+[.]?[0-9]*([e|E][-|+]?[0-9]+)?/g,
        ''
      );
      let chars = String(value).split('');
      let dotIndex = chars.findIndex((e: string) => e === '.');
      let eIndex = chars.findIndex((e: string) => e === 'e');
      let capEIndex = chars.findIndex((e: string) => e === 'E');
      let positiveIndex = chars.findIndex((e: string) => e === '+');
      let negativeIndex = chars.findIndex(
        (e: string, ind: number) => e === '-' && ind > 0
      );
      let isNegNumber = chars[0] === '-';
      const hasE = eIndex > -1 || capEIndex > -1;
      const hasSign = positiveIndex > -1 || negativeIndex > -1;
      let eCount = String(value).match(/e|E/g);
      let signCount = String(value).match(/\+|-/g);
      let dotCount = String(value).match(/\./g);

      // . < e|E < +|-
      let finalValue = '';
      if (
        ((replacer.includes('e') ||
          replacer.includes('E') ||
          replacer.includes('+') ||
          replacer.includes('-')) &&
          // exponent management
          (((!dotCount || dotCount.length === 1) &&
            !hasSign &&
            hasE &&
            dotIndex < Math.max(eIndex, capEIndex) &&
            eCount &&
            eCount.length === 1) ||
            // sign management
            ((!dotCount || dotCount.length === 1) &&
              hasSign &&
              hasE &&
              dotIndex < Math.max(positiveIndex, negativeIndex) &&
              Math.max(eIndex, capEIndex) -
                Math.max(positiveIndex, negativeIndex) ===
                -1 &&
              (isNegNumber
                ? signCount && signCount.length === 2
                : signCount && signCount.length === 1)) ||
            // combined situation
            ((!dotCount || dotCount.length === 1) &&
              hasE &&
              dotIndex < Math.max(eIndex, capEIndex) &&
              hasSign &&
              Math.max(eIndex, capEIndex) <
                Math.max(positiveIndex, negativeIndex) &&
              Math.max(eIndex, capEIndex) -
                Math.max(positiveIndex, negativeIndex) ===
                -1 &&
              (isNegNumber
                ? signCount && signCount.length === 2
                : signCount && signCount.length === 1) &&
              eCount &&
              eCount.length === 1))) ||
        // let multiple signs and exponents pass they'll be catched at component
        ((isNegNumber
          ? signCount && signCount.length > 2
          : signCount && signCount.length > 1) ||
          (eCount && eCount.length > 1) ||
          (dotCount && dotCount.length > 1) ||
          (isNegNumber && chars.length === 1))
      ) {
        finalValue = String(value);
      } else {
        finalValue = String(value).replace(replacer, '');
      }

      return finalValue;
    case FilterCriteriaType.STRING:
      return String(value).replace(/[^0-9A-Za-z- ]/g, '');
    default:
      return value;
  }
}
